"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMissingPost } from "../../redux/missingSlice";
import { setActiveTab } from "../../redux/shelterSlice";
import { toImageUrl } from "../../shelter/animalFormat";
import { missingStatusLabel, timeAgo } from "../missingFormat";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

export default function MissingPostDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const {detail, detailError} = useSelector((state: RootState) => state.missing);
  const post = detail?.id === id ? detail : null;

  useEffect(() => {
    if (Number.isFinite(id)) dispatch(fetchMissingPost(id));
  }, [dispatch, id]);

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 실종·제보 목록으로
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/missing");
    };
  };

  if (!post) {
    const message = detailError === "NOT_FOUND" || !Number.isFinite(id)
      ? "삭제됐거나 없는 글이에요"
      : detailError
        ? "글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요"
        : "불러오는 중이에요";

    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="실종·제보" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{message}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const done = post.status === "COMPLETED";
  const author = post.authorName?.trim(); // 백엔드가 닉네임을 줌 (없으면 "익명")
  const photo = toImageUrl(post.mediaUrls?.[0]);
  const facts = [
    {label: "품종", value: post.breed},
    {label: "성별", value: post.gender},
    {label: "나이", value: post.age},
    {label: "체중", value: post.weight},
    {label: "털색", value: post.color},
    {label: "등록", value: timeAgo(post.createdAt)}
  ].filter((fact) => fact.value);

  return (
    <S.AppWrapper>
      <S.Container>
        <S.DetailPage>
          <S.DetailHero>
            {photo ? (
              <S.DetailHeroImage src={photo} alt={`${post.breed || "실종 동물"} 사진`}/>
            ) : (
              <S.AdoptPhotoEmpty $height="400px" $square>사진 없음</S.AdoptPhotoEmpty>
            )}
            <S.DetailBackButton type="button" aria-label="뒤로" onClick={handleBack}>
              <S.DetailBackIcon/>
            </S.DetailBackButton>
          </S.DetailHero>

          <S.DetailSection>
            <S.MissingBadge $done={done}>{missingStatusLabel[post.status] ?? post.status}</S.MissingBadge>
            <S.DetailTitle>{post.title || post.breed}</S.DetailTitle>
            {author && <S.DetailNotice>작성자 {author}</S.DetailNotice>}

            {facts.length > 0 && (
              <S.DetailFacts>
                {facts.map((fact) => (
                  <S.DetailFact key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></S.DetailFact>
                ))}
                {post.rescueLocation && (
                  <S.DetailFact $span={3}><dt>실종 장소</dt><dd>{post.rescueLocation}</dd></S.DetailFact>
                )}
              </S.DetailFacts>
            )}
          </S.DetailSection>

          {post.content && (
            <S.DetailSection>
              <S.DetailHeading>{done ? "돌아온 이야기" : "찾고 있어요"}</S.DetailHeading>
              <S.DetailText>{post.content}</S.DetailText>
            </S.DetailSection>
          )}

          {!done && (
            <S.DetailSection>
              <S.MissingShelterHint as={Link} href="/shelter" $flush onClick={() => dispatch(setActiveTab("입양"))}>
                <S.MissingHintSearchIcon aria-hidden="true"/>
                <span><strong>보호소에 들어왔을 수도 있어요.</strong> 보호소 공고도 확인해 보세요.</span>
                <S.MissingHintChevron aria-hidden="true"/>
              </S.MissingShelterHint>
            </S.DetailSection>
          )}
        </S.DetailPage>
      </S.Container>
    </S.AppWrapper>
  );
};
