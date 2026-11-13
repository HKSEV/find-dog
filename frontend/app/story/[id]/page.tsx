"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CommunityPost, categoryLabel, deleteCommunityPost, fetchCommunityPost, toCommunityError } from "../communityApi";
import { toImageUrl } from "../../shelter/animalFormat";
import { timeAgo } from "../../missing/missingFormat";

import Header from "@/app/components/Header";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { queueToast, showToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

// 💡 커뮤니티 회원 글 상세 (/story/[id]). 내 글이면 아래에 고치기·지우기
export default function CommunityPostDetail() {
  const router = useRouter();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchCommunityPost(id)
      .then((data) => {
        if (!alive) return;
        setPost(data);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("missing"));
    return () => {
      alive = false;
    };
  }, [id]);

  const handleBack = () => (window.history.length > 1 ? router.back() : router.push("/story"));

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteCommunityPost(id);
      queueToast("글을 지웠어요");
      router.replace("/story");
    } catch (error) {
      setConfirmDelete(false);
      setBusy(false);
      const message = toCommunityError(error, "지우지 못했어요. 잠시 후 다시 시도해 주세요.");
      showToast(message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요" : message);
    };
  };

  if (!post) {
    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="커뮤니티" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{status === "loading" ? "불러오는 중이에요" : "삭제됐거나 없는 글이에요"}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const photos = post.mediaUrls.map((url) => toImageUrl(url)).filter((url): url is string => Boolean(url));
  const avatar = toImageUrl(post.authorImageUrl);
  const edited = post.updatedAt && post.createdAt && post.updatedAt.substring(0, 16) !== post.createdAt.substring(0, 16);

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title={categoryLabel(post.category)} onBackClick={handleBack}/>
        <S.HeaderOffset/>
        <S.DetailPage>
          <S.DetailSection>
            <S.CommunityPostKind>{categoryLabel(post.category)}</S.CommunityPostKind>
            <S.DetailTitle>{post.title}</S.DetailTitle>
            <S.CommunityAuthor>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatar ? <img src={avatar} alt=""/> : <span aria-hidden="true"/>}
              <strong>{post.authorName}</strong>
              <span>· {timeAgo(post.createdAt)}{edited ? " · 고쳐짐" : ""}</span>
            </S.CommunityAuthor>

            {photos.length > 0 && (
              <>
                <S.CommunityPhotos>
                  {photos.map((url, index) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={url} src={url} alt={`${post.title} 사진 ${index + 1}`}/>
                  ))}
                </S.CommunityPhotos>
                {photos.length > 1 && <S.CommunityPhotoCount>사진 {photos.length}장 · 옆으로 넘겨 보세요</S.CommunityPhotoCount>}
              </>
            )}

            <S.DetailText>{post.content}</S.DetailText>
          </S.DetailSection>
        </S.DetailPage>

        {post.mine && (
          <S.DetailActionBar>
            <S.MissingOwnerButton as={Link} href={`/story/write?edit=${post.id}`}>고치기</S.MissingOwnerButton>
            <S.MissingOwnerButton type="button" $danger onClick={() => setConfirmDelete(true)}>지우기</S.MissingOwnerButton>
          </S.DetailActionBar>
        )}
      </S.Container>

      <ConfirmDialog
      isOpen={confirmDelete}
      title="글을 지울까요?"
      message="지운 글은 되돌릴 수 없어요."
      confirmText="지우기"
      danger
      busy={busy}
      onConfirm={handleDelete}
      onCancel={() => setConfirmDelete(false)}/>
    </S.AppWrapper>
  );
};
