"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMyMissingPosts } from "../../redux/missingSlice";
import { toImageUrl } from "../../shelter/animalFormat";
import { missingBadge, missingRowTraits, timeAgo } from "../../missing/missingFormat";
import { CommunityPost, fetchMyCommunityPosts, toCommunityError } from "../../story/communityApi";
import PostList from "../../story/PostList";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import * as S from "@/assets/css/Style.styles";

const kinds = ["실종·제보", "커뮤니티"] as const;
type Kind = (typeof kinds)[number];

const loginNotice = (
  <S.MissingEmptyText>
    로그인이 필요해요. <Link href={loginHref("/mypage/posts")}>로그인하기</Link>
  </S.MissingEmptyText>
);

// 💡 마이 > 작성한 글: 내가 올린 실종·제보 글과 커뮤니티 글 (칩으로 나눠 봄, 최신순)
export default function MyPostsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {myPosts, myPostsLoading, myPostsError} = useSelector((state: RootState) => state.missing);
  const [kind, setKind] = useState<Kind>("실종·제보");
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communityStatus, setCommunityStatus] = useState<"loading" | "ready" | "login" | "error">("loading");

  useEffect(() => {
    dispatch(fetchMyMissingPosts());
  }, [dispatch]);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!localStorage.getItem("token")) {
        setCommunityStatus("login");
        return;
      };
      try {
        const list = await fetchMyCommunityPosts();
        if (!alive) return;
        setCommunityPosts(list);
        setCommunityStatus("ready");
      } catch (error) {
        if (alive) setCommunityStatus(toCommunityError(error, "") === "UNAUTHORIZED" ? "login" : "error");
      };
    };
    const timer = setTimeout(load, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const renderMissing = () => {
    if (myPostsError === "UNAUTHORIZED") return loginNotice;
    if (myPostsLoading && myPosts.length === 0) {
      return <S.MissingEmptyText>작성한 글을 불러오는 중이에요</S.MissingEmptyText>;
    };
    if (myPostsError) {
      return <S.MissingEmptyText>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    };
    if (myPosts.length === 0) {
      return (
        <S.MissingEmptyText>
          아직 쓴 실종·제보 글이 없어요. <Link href="/missing">실종·제보 보러 가기</Link>
        </S.MissingEmptyText>
      );
    };

    return (
      <S.MissingRows>
        {myPosts.map((post) => {
          const done = post.status === "COMPLETED";
          const photo = toImageUrl(post.mediaUrls?.[0]);
          return (
            <S.MissingRow key={post.id} as={Link} href={`/missing/${post.id}`} $done={done}>
              {photo ? (
                <S.MissingRowThumb src={photo} alt={`${post.breed || "실종 동물"} 사진`}/>
              ) : (
                <S.MissingRowThumbEmpty>사진 없음</S.MissingRowThumbEmpty>
              )}
              <S.MissingRowBody>
                <S.MissingBadge $tone={missingBadge(post).tone}>{missingBadge(post).label}</S.MissingBadge>
                <S.MissingRowTitle>{post.title || post.breed}</S.MissingRowTitle>
                <S.MissingRowTraits>{missingRowTraits(post)}</S.MissingRowTraits>
                <S.MissingRowMeta>{[post.rescueLocation, timeAgo(post.createdAt)].filter(Boolean).join(" · ")}</S.MissingRowMeta>
              </S.MissingRowBody>
            </S.MissingRow>
          );
        })}
      </S.MissingRows>
    );
  };

  const renderCommunity = () => {
    if (communityStatus === "login") return loginNotice;
    if (communityStatus === "loading") return <S.MissingEmptyText>작성한 글을 불러오는 중이에요</S.MissingEmptyText>;
    if (communityStatus === "error") return <S.MissingEmptyText>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    if (communityPosts.length === 0) {
      return (
        <S.MissingEmptyText>
          아직 쓴 커뮤니티 글이 없어요. <Link href="/story">커뮤니티 보러 가기</Link>
        </S.MissingEmptyText>
      );
    };
    return <PostList items={communityPosts} showCategory/>;
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="작성한 글"/>
        <S.HeaderOffset/>
        <S.CategoryChips role="tablist" aria-label="작성한 글 종류">
          {kinds.map((item) => (
            <S.CategoryChip key={item} role="tab" aria-selected={kind === item} $active={kind === item} onClick={() => setKind(item)}>
              {item}
            </S.CategoryChip>
          ))}
        </S.CategoryChips>
        {kind === "실종·제보" ? renderMissing() : renderCommunity()}
      </S.Container>
    </S.AppWrapper>
  );
};
