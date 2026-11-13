"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CommunityCategory,
  communityCategories,
  createCommunityPost,
  fetchCommunityPost,
  toCommunityError,
  updateCommunityPost
} from "../communityApi";
import { compressImage } from "../../missing/compressImage";
import { toImageUrl } from "../../shelter/animalFormat";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import { queueToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

const MAX_PHOTOS = 5;

type Photo = {file: File; preview: string};
type Errors = Partial<Record<"category" | "title" | "content" | "photos" | "submit", string>>;

const isCategory = (value: string | null): value is CommunityCategory =>
  communityCategories.some((item) => item.value === value);

// 분류마다 쓰는 법 안내 (placeholder)
const contentHint: Record<CommunityCategory, string> = {
  FREE: "아이와 보낸 하루나 나누고 싶은 이야기를 적어 주세요",
  ADOPTION_REVIEW: "새 가족이 된 아이와의 하루를 들려주세요",
  RESCUE_STORY: "어떻게 만나 구조하게 됐는지 들려주세요",
  QUESTION: "입양, 임시보호, 돌봄에 대해 궁금한 점을 적어 주세요"
};

function CommunityWriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = Number(searchParams.get("edit")) || null;
  const pickedCategory = searchParams.get("category");

  const [status, setStatus] = useState<"loading" | "ready" | "login" | "missing">("loading");
  const [category, setCategory] = useState<CommunityCategory | null>(isCategory(pickedCategory) ? pickedCategory : null);
  const [form, setForm] = useState({title: "", content: ""});
  const [keptPhotos, setKeptPhotos] = useState<string[]>([]); // 고치기: 남겨 둔 기존 사진 (서버 주소 그대로)
  const [photos, setPhotos] = useState<Photo[]>([]); // 새로 고른 사진
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!localStorage.getItem("token")) {
        setStatus("login");
        return;
      };
      if (!editId) {
        setStatus("ready");
        return;
      };
      try {
        const post = await fetchCommunityPost(editId);
        if (!alive) return;
        if (!post.mine) {
          setStatus("missing");
          return;
        };
        setCategory(post.category);
        setForm({title: post.title, content: post.content});
        setKeptPhotos(post.mediaUrls);
        setStatus("ready");
      } catch {
        if (alive) setStatus("missing");
      };
    };
    const timer = setTimeout(load, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [editId]);

  // 화면을 떠날 때 미리보기 주소 정리
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview)), []);

  const total = keptPhotos.length + photos.length;

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []).filter((file) => file.type.startsWith("image/"));
    e.target.value = ""; // 같은 사진을 지웠다가 다시 고를 수 있게
    const room = MAX_PHOTOS - total;
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

  const setField = (key: "title" | "content", value: string) => {
    setForm((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key]: undefined, submit: undefined}));
  };

  const handleBack = () => (window.history.length > 1 ? router.back() : router.push(editId ? `/story/${editId}` : "/story"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!category) next.category = "분류를 골라 주세요.";
    if (!form.title.trim()) next.title = "제목을 적어 주세요.";
    if (!form.content.trim()) next.content = "내용을 적어 주세요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    };

    setSubmitting(true);
    try {
      const files = await Promise.all(photos.map((photo) => compressImage(photo.file)));
      const dto = {category: category!, title: form.title.trim(), content: form.content.trim()};
      const saved = editId
        ? await updateCommunityPost(editId, {...dto, keepMediaUrls: keptPhotos}, files)
        : await createCommunityPost(dto, files);
      queueToast(editId ? "글을 고쳤어요" : "글을 올렸어요");
      if (editId && window.history.length > 1) {
        // 고치기는 상세에서 들어왔으니 그 상세로 돌아감 (replace로 상세를 하나 더 쌓으면 뒤로가기를 두 번 눌러야 함)
        router.back();
      } else {
        // 방금 쓴 글로 이동 (뒤로 가면 글쓰기 대신 들어왔던 화면으로)
        router.replace(`/story/${saved.id}`);
      };
    } catch (error) {
      const message = toCommunityError(error, editId ? "고치지 못했어요. 잠시 후 다시 시도해 주세요." : "올리지 못했어요. 잠시 후 다시 시도해 주세요.");
      setErrors({submit: message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요." : message});
      setSubmitting(false);
    };
  };

  const renderBody = () => {
    if (status === "login") {
      const back = editId ? `/story/write?edit=${editId}` : `/story/write${category ? `?category=${category}` : ""}`;
      return (
        <S.WriteLoginNotice>
          <p>로그인하면 커뮤니티에<br/>글을 쓸 수 있어요</p>
          <Link href={loginHref(back)}>로그인</Link>
        </S.WriteLoginNotice>
      );
    };
    if (status === "loading") return <S.AdoptEmpty>불러오는 중이에요</S.AdoptEmpty>;
    if (status === "missing") return <S.AdoptEmpty>내가 쓴 글만 고칠 수 있어요</S.AdoptEmpty>;

    return (
      <S.WriteForm onSubmit={handleSubmit} noValidate>
        <S.WriteField role="radiogroup" aria-labelledby="cw-category-label">
          <S.WriteLabel as="span" id="cw-category-label">분류</S.WriteLabel>
          <S.ApplyChoiceGroup $columns={2}>
            {communityCategories.map((item) => (
              <S.WriteChoice
              key={item.value}
              type="button"
              role="radio"
              aria-checked={category === item.value}
              $checked={category === item.value}
              onClick={() => {
                setCategory(item.value);
                setErrors((prev) => ({...prev, category: undefined}));
              }}>
                {item.label}
              </S.WriteChoice>
            ))}
          </S.ApplyChoiceGroup>
          {errors.category && <S.WriteError>{errors.category}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="cw-title">제목</S.WriteLabel>
          <S.WriteInput
          id="cw-title"
          maxLength={100}
          value={form.title}
          $invalid={Boolean(errors.title)}
          aria-invalid={Boolean(errors.title)}
          onChange={(e) => setField("title", e.target.value)}/>
          {errors.title && <S.WriteError>{errors.title}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="cw-content">내용</S.WriteLabel>
          <S.WriteTextArea
          id="cw-content"
          rows={8}
          maxLength={5000}
          placeholder={category ? contentHint[category] : "분류를 고르고 이야기를 들려주세요"}
          value={form.content}
          $invalid={Boolean(errors.content)}
          aria-invalid={Boolean(errors.content)}
          onChange={(e) => setField("content", e.target.value)}/>
          {errors.content && <S.WriteError>{errors.content}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel as="span">사진 <span>(선택, 최대 {MAX_PHOTOS}장)</span></S.WriteLabel>
          <S.WritePhotos>
            {total < MAX_PHOTOS && (
              <S.WritePhotoAdd>
                <S.WriteCameraIcon aria-hidden="true"/>
                {total}/{MAX_PHOTOS}
                <input type="file" accept="image/*" multiple onChange={handleAddPhotos} aria-label="사진 추가"/>
              </S.WritePhotoAdd>
            )}
            {keptPhotos.map((url, index) => (
              <S.WritePhoto key={url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={toImageUrl(url)} alt={`올린 사진 ${index + 1}`}/>
                <S.WritePhotoRemove
                type="button"
                aria-label={`올린 사진 ${index + 1} 빼기`}
                onClick={() => setKeptPhotos((prev) => prev.filter((item) => item !== url))}>
                  <S.WriteRemoveIcon/>
                </S.WritePhotoRemove>
              </S.WritePhoto>
            ))}
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

        <S.WriteBar>
          {errors.submit ? <S.WriteError as="p">{errors.submit}</S.WriteError> : <p>닉네임으로 올라가요. 실명과 연락처는 보이지 않아요.</p>}
          <S.WriteSubmit type="submit" disabled={submitting}>
            {submitting ? (editId ? "고치는 중..." : "올리는 중...") : (editId ? "고치기" : "올리기")}
          </S.WriteSubmit>
        </S.WriteBar>
      </S.WriteForm>
    );
  };

  return (
    <>
      <Header title={editId ? "글 고치기" : "글쓰기"} onBackClick={handleBack}/>
      <S.HeaderOffset/>
      {renderBody()}
    </>
  );
};

// 💡 커뮤니티 글쓰기 (/story/write?category=QUESTION, 고치기는 ?edit=id). 실종·제보 글쓰기와 같은 모양
export default function CommunityWritePage() {
  return (
    <S.AppWrapper>
      <S.Container>
        <Suspense>
          <CommunityWriteForm/>
        </Suspense>
      </S.Container>
    </S.AppWrapper>
  );
};
