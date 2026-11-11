"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMyMissingPosts } from "../../redux/missingSlice";
import { toImageUrl } from "../../shelter/animalFormat";
import { missingBadge, missingRowTraits, timeAgo } from "../../missing/missingFormat";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

// 💡 마이 > 작성한 글: 내가 올린 실종·제보 글 (최신순)
export default function MyPostsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {myPosts, myPostsLoading, myPostsError} = useSelector((state: RootState) => state.missing);

  useEffect(() => {
    dispatch(fetchMyMissingPosts());
  }, [dispatch]);

  const renderBody = () => {
    if (myPostsError === "UNAUTHORIZED") {
      return (
        <S.MissingEmptyText>
          로그인이 필요해요. <Link href="/login">로그인하기</Link>
        </S.MissingEmptyText>
      );
    };
    if (myPostsLoading && myPosts.length === 0) {
      return <S.MissingEmptyText>작성한 글을 불러오는 중이에요</S.MissingEmptyText>;
    };
    if (myPostsError) {
      return <S.MissingEmptyText>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    };
    if (myPosts.length === 0) {
      return (
        <S.MissingEmptyText>
          아직 쓴 글이 없어요. <Link href="/missing">실종·제보 보러 가기</Link>
        </S.MissingEmptyText>
      );
    };

    return myPosts.map((post) => {
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
    });
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="작성한 글"/>
        <S.HeaderOffset/>
        <S.MissingRows>{renderBody()}</S.MissingRows>
      </S.Container>
    </S.AppWrapper>
  );
};
