"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VolunteerPost, dateParts, fetchVolunteers, volunteerBadge } from "../volunteer/volunteerApi";

import * as S from "@/assets/css/Style.styles";

// 💡 입양·봉사 탭 > 봉사: 오늘 이후 봉사 모집 (가까운 날짜 순, 선착순 신청)
export default function VolunteerTab() {
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

  if (status === "loading") return <S.VolunteerEmpty>봉사 모집을 불러오는 중이에요</S.VolunteerEmpty>;
  if (status === "error") return <S.VolunteerEmpty>봉사 모집을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.VolunteerEmpty>;

  return (
    <S.VolunteerSection $first>
      <S.VolunteerIntro>보호소 봉사는 선착순이에요. 신청하면 바로 확정돼요.</S.VolunteerIntro>
      {posts.length === 0 ? (
        <S.VolunteerEmpty>지금 모집 중인 봉사가 없어요</S.VolunteerEmpty>
      ) : (
        <S.VolunteerPostList>
          {posts.map((post) => {
            const {month, day, weekday} = dateParts(post.activityDate);
            const badge = volunteerBadge(post);
            return (
              <li key={post.id}>
                <S.VolunteerPostRow as={Link} href={`/volunteer/${post.id}`} $done={badge.tone === "done"}>
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
    </S.VolunteerSection>
  );
};
