"use client";

import React, { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { compressImage } from "../compressImage";
import { placeLabel, whenLabel } from "../missingFormat";

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
  const [form, setForm] = useState({breed: "", color: "", gender: "미상", age: "", weight: "", rescueLocation: "", occurredAt: "", content: ""});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<{rescueLocation?: string; content?: string; photos?: string; submit?: string}>({});
  const [submitting, setSubmitting] = useState(false);

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
    if (!form.content.trim()) nextErrors.content = "자세한 내용을 적어 주세요.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    };

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    };

    setSubmitting(true);
    try {
      // 시안처럼 제목은 "품종 · 털색·특징" (예: 비글 믹스 · 노란 스카프)
      const title = [form.breed.trim() || "품종 모름", form.color.trim()].filter(Boolean).join(" · ");
      const dto = {
        type: kind,
        title,
        breed: form.breed.trim(),
        color: form.color.trim(),
        gender: form.gender,
        age: form.age.trim(),
        weight: form.weight.trim(),
        rescueLocation: form.rescueLocation.trim(),
        occurredAt: form.occurredAt || null,
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

  if (hasToken === false) {
    return (
      <S.WriteLoginNotice>
        <p>로그인하면 실종 신고와<br/>목격 제보를 올릴 수 있어요</p>
        <Link href="/login">로그인</Link>
      </S.WriteLoginNotice>
    );
  };

  return (
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
        <S.WriteInput
        id="mw-place"
        placeholder="동네, 가까운 건물"
        value={form.rescueLocation}
        $invalid={Boolean(errors.rescueLocation)}
        aria-invalid={Boolean(errors.rescueLocation)}
        onChange={(e) => setField("rescueLocation", e.target.value)}/>
        {errors.rescueLocation && <S.WriteError>{errors.rescueLocation}</S.WriteError>}
      </S.WriteField>

      <S.WriteField>
        <S.WriteLabel htmlFor="mw-when">{whenLabel(kind)} <span>(선택)</span></S.WriteLabel>
        <S.WriteInput id="mw-when" type="datetime-local" value={form.occurredAt} onChange={(e) => setField("occurredAt", e.target.value)}/>
      </S.WriteField>

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
        <S.WriteSubmit type="submit" disabled={submitting}>{submitting ? "등록하는 중..." : "등록하기"}</S.WriteSubmit>
      </S.WriteBar>
    </S.WriteForm>
  );
};

// 💡 실종·제보 글쓰기 (/missing/write). 홈 "잃어버렸어요"와 실종·제보 탭 "신고·제보하기"에서 들어옴
export default function MissingWritePage() {
  const router = useRouter();

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="신고·제보하기" onBackClick={() => (window.history.length > 1 ? router.back() : router.push("/missing"))}/>
        <S.HeaderOffset/>
        <Suspense>
          <MissingWriteForm/>
        </Suspense>
      </S.Container>
    </S.AppWrapper>
  );
};
