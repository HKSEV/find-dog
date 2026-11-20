"use client";

import React from "react";
import Link from "next/link";
import { CommunityPost, categoryLabel } from "./communityApi";
import { toImageUrl } from "../shelter/animalFormat";
import { timeAgo } from "../missing/missingFormat";

import * as S from "@/assets/css/Style.styles";

// 💡 커뮤니티 회원 글 한 줄: 분류 · 제목 · 내용 한 줄 · 닉네임과 시간, 사진이 있으면 오른쪽에 첫 장
//    커뮤니티 탭과 마이 > 작성한 글에서 같이 씀
export default function PostList({items, showCategory}: {items: CommunityPost[]; showCategory?: boolean}) {
  return (
    <S.CommunityPostList>
      {items.map((post) => {
        const thumb = toImageUrl(post.mediaUrls[0]);
        return (
          <li key={post.id}>
            <S.CommunityPostRow as={Link} href={`/story/detail/?id=${post.id}`}>
              <S.CommunityPostBody>
                {showCategory && <S.CommunityPostKind>{categoryLabel(post.category)}</S.CommunityPostKind>}
                <S.CommunityPostTitle>{post.title}</S.CommunityPostTitle>
                <S.CommunityPostSummary>{post.content}</S.CommunityPostSummary>
                <S.CommunityPostMeta>
                  {[post.authorName, timeAgo(post.createdAt), post.likeCount > 0 ? `공감 ${post.likeCount}` : "", post.commentCount > 0 ? `댓글 ${post.commentCount}` : ""].filter(Boolean).join(" · ")}
                </S.CommunityPostMeta>
              </S.CommunityPostBody>
              {thumb && <S.CommunityPostThumb src={thumb} alt=""/>}
            </S.CommunityPostRow>
          </li>
        );
      })}
    </S.CommunityPostList>
  );
};
