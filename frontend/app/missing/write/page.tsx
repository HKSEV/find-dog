"use client";

import React, { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { compressImage } from "../compressImage";
import { placeLabel, whenLabel } from "../missingFormat";
import WhenPicker, { WhenValue, emptyWhen, fromOccurred, toOccurred } from "../WhenPicker";
import MapPicker, { PickedPlace } from "../../components/map/MapPicker";
import MiniMap from "../../components/map/MiniMap";
import { MapPoint } from "../../components/map/kakaoMap";
import { toImageUrl } from "../../shelter/animalFormat";
import { MissingAnimal, missingAuthHeader } from "../../redux/missingSlice";
import { toMissingError, updateMissingPost } from "../missingApi";
import { queueToast } from "../../components/Toast";
import { loginHref } from "../../components/loginLink";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

const MAX_PHOTOS = 5;

type Kind = "LOST" | "FOUND";

// 💡 화면에는 남/여/모름으로 보이고, 저장은 예전 글과 같은 값(수컷/암컷/미상)으로
const genderOptions = [
  {label: "남", value: "수컷"},
  {label: "여", value: "암컷"},
  {label: "모름", value: "미상"}
];

const notePlaceholder: Record<Kind, string> = {
  LOST: "성격, 이름에 반응하는지, 착용한 물건 등",
  FOUND: "상태, 이동 방향, 지금 데리고 있는지 등"
};

type Photo = {file: File; preview: string};

// 로그인 여부 (localStorage의 token). 서버에서 그릴 때는 아직 모름(null)
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getHasToken = () => Boolean(localStorage.getItem("token"));
const getServerHasToken = () => null;

function MissingWriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasToken = useSyncExternalStore(subscribeStorage, getHasToken, getServerHasToken);

  // 홈 "발견했어요" 등에서 ?type=found로 들어오면 발견했어요가 먼저 선택됨
  const [kind, setKind] = useState<Kind>(searchParams.get("type") === "found" ? "FOUND" : "LOST");
  const [form, setForm] = useState({breed: "", color: "", gender: "미상", age: "", weight: "", rescueLocation: "", content: ""});
  const [when, setWhen] = useState<WhenValue>(emptyWhen); // 잃어버린 때 / 발견한 때 (날짜 필수)
  const [point, setPoint] = useState<MapPoint | null>(null); // 지도에서 고른 장소 (선택)
  const [pickerOpen, setPickerOpen] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<{rescueLocation?: string; when?: string; content?: string; photos?: string; submit?: string}>({});
  const [submitting, setSubmitting] = useState(false);

  // 💡 수정 모드 (/missing/write?edit=글번호): 내 글이면 내용을 채워서 고치기. 사진은 그대로 둠
  const editId = Number(searchParams.get("edit")) || null;
  const [editState, setEditState] = useState<"loading" | "ready" | "forbidden" | "error">("loading");
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!editId || !hasToken) return;
    axios.get<MissingAnimal>(`/api/missing-posts/${editId}`, {headers: missingAuthHeader()})
      .then(({data}) => {
        if (!data.mine) {
          setEditState("forbidden");
          return;
        };
        setKind(data.type === "FOUND" ? "FOUND" : "LOST");
        setForm({
          breed: data.breed ?? "",
          color: data.color ?? "",
          gender: data.gender || "미상",
          age: data.age ?? "",
          weight: data.weight ?? "",
          rescueLocation: data.rescueLocation ?? "",
          content: data.content ?? ""
        });
        setWhen(fromOccurred(data.occurredAt, data.occurredTime));
        setPoint(data.lat != null && data.lng != null ? {lat: data.lat, lng: data.lng} : null);
        setExistingPhotos((data.mediaUrls ?? []).map((url) => toImageUrl(url)).filter((url): url is string => Boolean(url)));
        setEditState("ready");
      })
      .catch(() => setEditState("error"));
  }, [editId, hasToken]);

  // 화면을 떠날 때 미리보기 주소 정리
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview)), []);

  const setField = (name: keyof typeof form, value: string) => {
    setForm((prev) => ({...prev, [name]: value}));
    if (name === "rescueLocation" || name === "content") {
      setErrors((prev) => ({...prev, [name]: undefined}));
    };
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    e.target.value = ""; // 같은 사진을 지웠다가 다시 고를 수 있게
    const room = MAX_PHOTOS - photos.length;
    const added = picked.slice(0, room).map((file) => ({file, preview: URL.createObjectURL(file)}));
    setPhotos((prev) => [...prev, ...added]);
    setErrors((prev) => ({...prev, photos: picked.length > room ? `사진은 최대 ${MAX_PHOTOS}장까지 올릴 수 있어요.` : undefined}));
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
    setErrors((prev) => ({...prev, photos: undefined}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: typeof errors = {};
    if (!form.rescueLocation.trim()) nextErrors.rescueLocation = `${placeLabel(kind)}를 적어 주세요.`;
    if (!when.date) nextErrors.when = "날짜를 골라 주세요.";
    if (!form.content.trim()) nextErrors.content = "자세한 내용을 적어 주세요.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    };

    const token = localStorage.getItem("token");
    if (!token) {
      router.push(loginHref(editId ? `/missing/write?edit=${editId}` : "/missing/write"));
      return;
    };

    // 시안처럼 제목은 "품종 · 털색·특징" (예: 비글 믹스 · 노란 스카프)
    const title = [form.breed.trim() || "품종 모름", form.color.trim()].filter(Boolean).join(" · ");

    if (editId) {
      setSubmitting(true);
      try {
        await updateMissingPost(editId, {
          type: kind,
          title,
          breed: form.breed.trim(),
          color: form.color.trim(),
          gender: form.gender,
          age: form.age.trim(),
          weight: form.weight.trim(),
          rescueLocation: form.rescueLocation.trim(),
          ...toOccurred(when),
          lat: point?.lat ?? null,
          lng: point?.lng ?? null,
          content: form.content.trim()
        });
        queueToast("글을 고쳤어요");
        router.replace(`/missing/${editId}`);
      } catch (error) {
        setErrors({submit: toMissingError(error, "고치지 못했어요. 잠시 후 다시 시도해 주세요.")});
        setSubmitting(false);
      };
      return;
    };

    setSubmitting(true);
    try {
      const dto = {
        type: kind,
        title,
        breed: form.breed.trim(),
        color: form.color.trim(),
        gender: form.gender,
        age: form.age.trim(),
        weight: form.weight.trim(),
        rescueLocation: form.rescueLocation.trim(),
        ...toOccurred(when),
        lat: point?.lat ?? null,
        lng: point?.lng ?? null,
        content: form.content.trim()
      };

      const data = new FormData();
      data.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));
      const compressed = await Promise.all(photos.map((photo) => compressImage(photo.file)));
      compressed.forEach((file) => data.append("files", file));

      const response = await axios.post("/api/missing-posts", data, {
        headers: {Authorization: `Bearer ${token}`}
      });

      // 방금 쓴 글로 이동 (뒤로 가면 글쓰기 대신 들어왔던 화면으로)
      router.replace(`/missing/${response.data.id}`);
    } catch (error: unknown) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = axios.isAxiosError(error) && typeof error.response?.data === "string" ? error.response.data : "";
      setErrors({
        submit: status === 401 || status === 403
          ? "로그인이 끝났어요. 다시 로그인해 주세요."
          : message || "등록하지 못했어요. 잠시 후 다시 시도해 주세요."
      });
      setSubmitting(false);
    };
  };

  const header = (
    <Header
    title={editId ? "글 고치기" : "신고·제보하기"}
    onBackClick={() => (window.history.length > 1 ? router.back() : router.push(editId ? `/missing/${editId}` : "/missing"))}/>
  );

  if (hasToken === false) {
    return (
      <>
        {header}
        <S.HeaderOffset/>
        <S.WriteLoginNotice>
          <p>로그인하면 실종 신고와<br/>목격 제보를 올릴 수 있어요</p>
          <Link href={loginHref(editId ? `/missing/write?edit=${editId}` : "/missing/write")}>로그인</Link>
        </S.WriteLoginNotice>
      </>
    );
  };

  if (editId && editState !== "ready") {
    const message = editState === "forbidden" ? "내가 쓴 글만 고칠 수 있어요" : editState === "error" ? "글을 불러오지 못했어요" : "불러오는 중이에요";
    return (
      <>
        {header}
        <S.HeaderOffset/>
        <S.AdoptEmpty>{message}</S.AdoptEmpty>
      </>
    );
  };

  return (
    <>
    {header}
    <S.HeaderOffset/>
    <S.WriteForm id="missing-write-form" onSubmit={handleSubmit} noValidate>
      <S.WriteKindGroup role="radiogroup" aria-label="글 종류">
        <S.WriteKindButton type="button" role="radio" aria-checked={kind === "LOST"} $checked={kind === "LOST"} onClick={() => setKind("LOST")}>
          <strong>잃어버렸어요</strong>
          <span>우리 아이 실종 신고</span>
        </S.WriteKindButton>
        <S.WriteKindButton type="button" role="radio" aria-checked={kind === "FOUND"} $checked={kind === "FOUND"} onClick={() => setKind("FOUND")}>
          <strong>발견했어요</strong>
          <span>목격했거나 데리고 있어요</span>
        </S.WriteKindButton>
      </S.WriteKindGroup>

      {editId ? (
        <S.WriteField>
          <S.WriteLabel as="span">사진 <span>(고치기에서는 바꿀 수 없어요)</span></S.WriteLabel>
          {existingPhotos.length > 0 ? (
            <S.WritePhotos>
              {existingPhotos.map((url, index) => (
                <S.WritePhoto key={url}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`올린 사진 ${index + 1}`}/>
                </S.WritePhoto>
              ))}
            </S.WritePhotos>
          ) : (
            <S.SignupHint>올린 사진이 없어요</S.SignupHint>
          )}
        </S.WriteField>
      ) : (
      <S.WriteField>
        <S.WriteLabel as="span">사진 <span>(최대 {MAX_PHOTOS}장, 얼굴과 무늬가 잘 보이게)</span></S.WriteLabel>
        <S.WritePhotos>
          {photos.length < MAX_PHOTOS && (
            <S.WritePhotoAdd>
              <S.WriteCameraIcon aria-hidden="true"/>
              {photos.length}/{MAX_PHOTOS}
              <input type="file" accept="image/*" multiple onChange={handleAddPhotos} aria-label="사진 추가"/>
            </S.WritePhotoAdd>
          )}
          {photos.map((photo, index) => (
            <S.WritePhoto key={photo.preview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.preview} alt={`첨부한 사진 ${index + 1}`}/>
              <S.WritePhotoRemove type="button" aria-label={`사진 ${index + 1} 빼기`} onClick={() => handleRemovePhoto(index)}>
                <S.WriteRemoveIcon/>
              </S.WritePhotoRemove>
            </S.WritePhoto>
          ))}
        </S.WritePhotos>
        {errors.photos && <S.WriteError>{errors.photos}</S.WriteError>}
      </S.WriteField>
      )}

      <S.WriteRow>
        <S.WriteField>
          <S.WriteLabel htmlFor="mw-breed">품종</S.WriteLabel>
          <S.WriteInput id="mw-breed" placeholder="예: 비글 믹스" value={form.breed} onChange={(e) => setField("breed", e.target.value)}/>
        </S.WriteField>
        <S.WriteField>
          <S.WriteLabel htmlFor="mw-color">털색·특징</S.WriteLabel>
          <S.WriteInput id="mw-color" placeholder="예: 흰색, 노란 스카프" value={form.color} onChange={(e) => setField("color", e.target.value)}/>
        </S.WriteField>
      </S.WriteRow>

      <S.WriteField role="radiogroup" aria-labelledby="mw-gender-label">
        <S.WriteLabel as="span" id="mw-gender-label">성별</S.WriteLabel>
        <S.WriteChoiceGroup>
          {genderOptions.map((option) => (
            <S.WriteChoice
            key={option.value}
            type="button"
            role="radio"
            aria-checked={form.gender === option.value}
            $checked={form.gender === option.value}
            onClick={() => setField("gender", option.value)}>
              {option.label}
            </S.WriteChoice>
          ))}
        </S.WriteChoiceGroup>
      </S.WriteField>

      <S.WriteRow>
        <S.WriteField>
          <S.WriteLabel htmlFor="mw-age">나이 <span>(선택)</span></S.WriteLabel>
          <S.WriteInput id="mw-age" placeholder="예: 1살" value={form.age} onChange={(e) => setField("age", e.target.value)}/>
        </S.WriteField>
        <S.WriteField>
          <S.WriteLabel htmlFor="mw-weight">몸무게 <span>(선택)</span></S.WriteLabel>
          <S.WriteInput id="mw-weight" placeholder="예: 5kg" value={form.weight} onChange={(e) => setField("weight", e.target.value)}/>
        </S.WriteField>
      </S.WriteRow>

      <S.WriteField>
        <S.WriteLabel htmlFor="mw-place">{placeLabel(kind)}</S.WriteLabel>
        {/* 지도에서 고르면 작은 지도(보기만)가 생기고, 장소 칸에 주소가 채워짐 (고칠 수 있음) */}
        {point && <MiniMap point={point} label={form.rescueLocation || placeLabel(kind)}/>}
        <S.SignupInputRow>
          <S.WriteInput
          id="mw-place"
          placeholder="동네, 가까운 건물"
          value={form.rescueLocation}
          $invalid={Boolean(errors.rescueLocation)}
          aria-invalid={Boolean(errors.rescueLocation)}
          onChange={(e) => setField("rescueLocation", e.target.value)}/>
          <S.SignupSideButton type="button" onClick={() => setPickerOpen(true)}>
            {point ? "다시 고르기" : "지도에서 선택"}
          </S.SignupSideButton>
        </S.SignupInputRow>
        {errors.rescueLocation && <S.WriteError>{errors.rescueLocation}</S.WriteError>}
        {point && (
          <S.WhenSubLabel>
            다른 사람에게는 이 근처(약 300m)로만 보여요. <S.WhenLink type="button" onClick={() => setPoint(null)}>지도 빼기</S.WhenLink>
          </S.WhenSubLabel>
        )}
      </S.WriteField>

      <WhenPicker
      label={whenLabel(kind)}
      value={when}
      error={errors.when}
      onChange={(update) => {
        setWhen(update);
        setErrors((prev) => ({...prev, when: undefined}));
      }}/>
      <S.WriteField>
        <S.WriteLabel htmlFor="mw-note">자세한 내용</S.WriteLabel>
        <S.WriteTextArea
        id="mw-note"
        rows={4}
        placeholder={notePlaceholder[kind]}
        value={form.content}
        $invalid={Boolean(errors.content)}
        aria-invalid={Boolean(errors.content)}
        onChange={(e) => setField("content", e.target.value)}/>
        {errors.content && <S.WriteError>{errors.content}</S.WriteError>}
      </S.WriteField>

      <S.WriteBar>
        {errors.submit ? <S.WriteError as="p">{errors.submit}</S.WriteError> : <p>연락은 로그인한 계정의 연락처로 받아요.</p>}
        <S.WriteSubmit type="submit" disabled={submitting}>
          {submitting ? (editId ? "고치는 중..." : "등록하는 중...") : (editId ? "고치기" : "등록하기")}
        </S.WriteSubmit>
      </S.WriteBar>
    </S.WriteForm>

    {/* 지도 고르기는 글쓰기 form 밖에 둠 (안에 검색 form이 있어서 form이 겹치지 않게) */}
    {pickerOpen && (
      <MapPicker
      initial={point}
      onClose={() => setPickerOpen(false)}
      onSelect={(place: PickedPlace) => {
        setPoint({lat: place.lat, lng: place.lng});
        setField("rescueLocation", place.address);
        setPickerOpen(false);
      }}/>
    )}
    </>
  );
};

// 💡 실종·제보 글쓰기 (/missing/write). 홈 "잃어버렸어요"와 실종·제보 탭 "신고·제보하기"에서 들어옴
export default function MissingWritePage() {
  return (
    <S.AppWrapper>
      <S.Container>
        <Suspense>
          <MissingWriteForm/>
        </Suspense>
      </S.Container>
    </S.AppWrapper>
  );
};
