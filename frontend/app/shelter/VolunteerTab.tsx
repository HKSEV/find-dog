"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VolunteerPost, dateParts, fetchVolunteers, volunteerBadge } from "../volunteer/volunteerApi";
import HelpSection from "./HelpSection";

import * as S from "@/assets/css/Style.styles";

// 💡 함께해요 > 봉사: 맨 위 도움이 필요해요(물품·임시 보호), 그 아래 오늘 이후 봉사 모집 (가까운 날짜 순, 선착순 신청)
export default function VolunteerTab({keyword = ""}: {keyword?: string}) {
  const [posts, setPosts] = useState<VolunteerPost[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let alive = true;
    fetchVolunteers()
      .then((list) => {
        if (!alive) return;
        setPosts(list);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, []);

  // 검색 (헤더 돋보기): 봉사 이름·장소·내용에 검색어가 모두 들어간 것
  const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const visiblePosts = words.length === 0 ? posts
    : posts.filter((post) => words.every((word) => `${post.title} ${post.place} ${post.content ?? ""}`.toLowerCase().includes(word)));

  return (
    <>
    {/* 검색 중에는 도움 요청을 숨기고 봉사 검색 결과만 */}
    {!keyword && <HelpSection/>}
    <S.VolunteerSection $first={Boolean(keyword)}>
      <S.VolunteerSectionHead>
        <S.VolunteerSectionTitle>봉사 모집</S.VolunteerSectionTitle>
      </S.VolunteerSectionHead>
      {status === "loading" ? (
        <S.VolunteerEmpty>봉사 모집을 불러오는 중이에요</S.VolunteerEmpty>
      ) : status === "error" ? (
        <S.VolunteerEmpty>봉사 모집을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.VolunteerEmpty>
      ) : (
      <>
      <S.VolunteerIntro>어서찾아주개와 함께하는 협력 보호소의 봉사예요. 선착순이라 신청하면 바로 확정돼요.</S.VolunteerIntro>
      {visiblePosts.length === 0 ? (
        <S.VolunteerEmpty>{keyword ? "찾는 봉사가 없어요" : "지금 모집 중인 봉사가 없어요"}</S.VolunteerEmpty>
      ) : (
        <S.VolunteerPostList>
          {visiblePosts.map((post) => {
            const {month, day, weekday} = dateParts(post.activityDate);
            const badge = volunteerBadge(post);
            return (
              <li key={post.id}>
                <S.VolunteerPostRow as={Link} href={`/volunteer/detail/?id=${post.id}`} $done={badge.tone === "done"}>
                  <S.VolunteerDate aria-hidden="true">
                    <small>{month}</small>
                    <strong>{day}</strong>
                    <small>{weekday}</small>
                  </S.VolunteerDate>
                  <S.VolunteerPostBody>
                    <S.VolunteerPostTitle>{post.title}</S.VolunteerPostTitle>
                    <S.VolunteerPostMeta>{post.startTime}~{post.endTime} · {post.place}</S.VolunteerPostMeta>
                    <S.VolunteerPostFoot>
                      <S.VolunteerBadge $tone={badge.tone}>{badge.label}</S.VolunteerBadge>
                      <span>{post.appliedCount}/{post.capacity}명</span>
                    </S.VolunteerPostFoot>
                  </S.VolunteerPostBody>
                </S.VolunteerPostRow>
              </li>
            );
          })}
        </S.VolunteerPostList>
      )}
      </>
      )}
    </S.VolunteerSection>
    </>
  );
};
