"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { VolunteerPost, fetchVolunteer, formatVolunteerWhen, volunteerBadge } from "../volunteerApi";
import { toImageUrl } from "../../shelter/animalFormat";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import * as S from "@/assets/css/Style.styles";

// 💡 봉사 상세 (/volunteer/[id]). 선착순이라 신청하면 바로 확정
export default function VolunteerDetailPage() {
  const router = useRouter();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const [post, setPost] = useState<VolunteerPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(() => setLoggedIn(Boolean(localStorage.getItem("token"))), 0);
    fetchVolunteer(id)
      .then((data) => {
        if (!alive) return;
        setPost(data);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("missing"));
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id]);

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 봉사 목록으로
  const handleBack = () => (window.history.length > 1 ? router.back() : router.push("/shelter"));

  const renderAction = (data: VolunteerPost) => {
    if (data.myApplicationId) return <S.DetailApplyButton as={Link} href="/mypage/volunteers">신청 내역 보기</S.DetailApplyButton>;
    if (data.state === "CLOSED") return <S.DetailApplyButton type="button" disabled>모집이 끝났어요</S.DetailApplyButton>;
    if (data.state === "FULL") return <S.DetailApplyButton type="button" disabled>정원이 다 찼어요</S.DetailApplyButton>;
    const applyPath = `/volunteer/${data.id}/apply`;
    return <S.DetailApplyButton as={Link} href={loggedIn ? applyPath : loginHref(applyPath)}>{loggedIn ? "신청하기" : "로그인하고 신청하기"}</S.DetailApplyButton>;
  };

  if (!post) {
    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="봉사" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{status === "loading" ? "불러오는 중이에요" : "삭제됐거나 없는 봉사예요"}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const badge = volunteerBadge(post);
  const imageUrl = toImageUrl(post.imageUrl);
  const left = Math.max(post.capacity - post.appliedCount, 0);

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="봉사" onBackClick={handleBack}/>
        <S.HeaderOffset/>
        <S.DetailPage>
          {imageUrl && <S.VolunteerHeroImage src={imageUrl} alt=""/>}

          <S.DetailSection>
            <S.VolunteerBadge $tone={badge.tone}>{badge.label}</S.VolunteerBadge>
            <S.DetailTitle>{post.title}</S.DetailTitle>
            <S.DetailNotice>
              {post.state === "OPEN" ? `${post.capacity}명 중 ${left}자리 남았어요` : `${post.capacity}명 모집 · ${post.appliedCount}명 신청`}
            </S.DetailNotice>

            <S.DetailFacts>
              <S.DetailFact $span={3}><dt>날짜</dt><dd>{formatVolunteerWhen(post)}</dd></S.DetailFact>
              <S.DetailFact $span={3}><dt>장소</dt><dd>{post.place}</dd></S.DetailFact>
            </S.DetailFacts>
          </S.DetailSection>

          {post.content && (
            <S.DetailSection>
              <S.DetailHeading>이런 일을 해요</S.DetailHeading>
              <S.DetailText>{post.content}</S.DetailText>
            </S.DetailSection>
          )}

          <S.DetailSection>
            <S.DetailHeading>신청 안내</S.DetailHeading>
            <S.DetailText>선착순으로 받아서 신청하면 바로 확정돼요. 못 가게 되면 봉사 날까지 마이 &gt; 봉사 신청 내역에서 취소해 주세요. 다른 분이 그 자리에 신청할 수 있어요.</S.DetailText>
          </S.DetailSection>
        </S.DetailPage>

        <S.DetailActionBar>{renderAction(post)}</S.DetailActionBar>
      </S.Container>
    </S.AppWrapper>
  );
};
