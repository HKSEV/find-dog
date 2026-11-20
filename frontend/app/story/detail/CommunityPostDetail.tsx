"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommunityPost, categoryLabel, communityReportReasons, deleteCommunityPost, fetchCommunityPost, reportCommunityPost, toCommunityError } from "../communityApi";
import { toImageUrl } from "../../shelter/animalFormat";
import { timeAgo } from "../../missing/missingFormat";

import Header from "@/app/components/Header";
import ProfileAvatar from "@/app/components/ProfileAvatar";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import ActionSheet from "@/app/components/ActionSheet";
import ReportSheet from "@/app/components/ReportSheet";
import { loginHref } from "@/app/components/loginLink";
import { queueToast, showToast } from "@/app/components/Toast";
import * as S from "@/assets/css/Style.styles";

// 💡 커뮤니티 회원 글 상세 (/story/detail/?id=...). 내 글이면 아래에 고치기·지우기
export default function CommunityPostDetail({id}: {id: number}) {
  const router = useRouter();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<"menu" | "report" | null>(null); // 더보기(⋮) / 신고 시트

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
          <Header title="이야기" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{status === "loading" ? "불러오는 중이에요" : "삭제됐거나 없는 글이에요"}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const photos = post.mediaUrls.map((url) => toImageUrl(url)).filter((url): url is string => Boolean(url));
  const edited = post.updatedAt && post.createdAt && post.updatedAt.substring(0, 16) !== post.createdAt.substring(0, 16);

  return (
    <S.AppWrapper>
      <S.Container>
        {/* 남의 글이면 오른쪽 위 더보기(⋮) > 신고하기 (내 글은 아래 고치기·지우기) */}
        <Header
        title={categoryLabel(post.category)}
        onBackClick={handleBack}
        action={!post.mine ? (
          <S.HeaderRoundButton type="button" aria-label="더보기" title="더보기" onClick={() => setSheet("menu")}>
            <S.MoreMenuIcon aria-hidden="true"/>
          </S.HeaderRoundButton>
        ) : undefined}/>
        <S.HeaderOffset/>
        <S.DetailPage>
          <S.DetailSection>
            <S.CommunityPostKind>{categoryLabel(post.category)}</S.CommunityPostKind>
            <S.DetailTitle>{post.title}</S.DetailTitle>
            <S.CommunityAuthor>
              {/* 💡 글쓴이: 누르면 프로필 (쓴 글 보기) */}
              {post.authorId != null ? (
                <S.CommunityAuthorLink as={Link} href={`/profile/?id=${post.authorId}`} aria-label={`${post.authorName}님 프로필 보기`}>
                  <ProfileAvatar image={post.authorImageUrl} size={28}/>
                  <strong>{post.authorName}</strong>
                </S.CommunityAuthorLink>
              ) : (
                <S.CommunityAuthorLink as="span">
                  <ProfileAvatar image={post.authorImageUrl} size={28}/>
                  <strong>{post.authorName}</strong>
                </S.CommunityAuthorLink>
              )}
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

      {sheet === "menu" && (
        <ActionSheet
        onClose={() => setSheet((current) => (current === "menu" ? null : current))}
        items={[{
          label: "신고하기",
          danger: true,
          onSelect: () => (localStorage.getItem("token") ? setSheet("report") : router.push(loginHref(`/story/detail/?id=${post.id}`)))
        }]}/>
      )}
      {sheet === "report" && (
        <ReportSheet
        title="이 글을 신고할까요?"
        note="운영팀이 확인 후 처리해요. 신고한 사실은 글쓴이에게 알리지 않아요."
        reasons={communityReportReasons}
        onSubmit={({reason, detail}) => reportCommunityPost(post.id, {reason, detail})}
        toError={(error) => {
          const message = toCommunityError(error, "신고하지 못했어요. 잠시 후 다시 시도해 주세요.");
          return message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요." : message;
        }}
        onClose={() => setSheet(null)}/>
      )}

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
