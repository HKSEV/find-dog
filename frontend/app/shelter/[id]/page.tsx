"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchShelterAnimals } from "../../redux/shelterSlice";
import { genderLabel, statusLabel, toImageUrl, toMonthDay } from "../animalFormat";
import { useLikedAnimals } from "../useLikedAnimals";

import Header from "@/app/components/Header";
import { CustomAlert } from "@/app/components/CustomAlert";
import * as S from "@/assets/css/Style.styles";

const adoptSteps = ["신청서 작성", "보호소 연락", "방문 상담", "입양"];

export default function ShelterAnimalDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  // 💡 상세 조회 API가 아직 없어서 목록을 받아 같은 id를 찾음 (목록을 이미 받았으면 그대로 사용)
  const {animals, loading, error} = useSelector((state: RootState) => state.shelter);
  const animal = animals.find((item) => item.id === id);
  const {isLiked, toggle} = useLikedAnimals();
  const [isApplyAlertOpen, setIsApplyAlertOpen] = useState(false);

  useEffect(() => {
    if (animals.length === 0) dispatch(fetchShelterAnimals());
  }, [dispatch, animals.length]);

  // 목록에서 들어왔으면 뒤로, 주소로 바로 들어왔으면 입양 목록으로
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/shelter");
    };
  };

  if (!animal) {
    const message = loading || (animals.length === 0 && !error)
      ? "불러오는 중이에요"
      : error
        ? "보호 동물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요"
        : "공고가 끝났거나 없는 친구예요";

    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="보호 동물" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{message}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const liked = isLiked(animal.id);
  const imageUrl = toImageUrl(animal.imageUrl);
  const isDone = animal.status === "COMPLETED";
  const gender = genderLabel[animal.gender] ?? animal.gender;
  const status = statusLabel[animal.status] ?? animal.status;
  const regDate = toMonthDay(animal.regDate);

  return (
    <S.AppWrapper>
      <S.Container>
        <S.DetailPage>
          <S.DetailHero>
            {imageUrl ? (
              <S.DetailHeroImage src={imageUrl} alt={`${animal.breed} 사진`}/>
            ) : (
              <S.AdoptPhotoEmpty $height="400px" $square>사진 준비 중</S.AdoptPhotoEmpty>
            )}
            <S.DetailBackButton type="button" aria-label="뒤로" onClick={handleBack}>
              <S.DetailBackIcon/>
            </S.DetailBackButton>
          </S.DetailHero>

          <S.DetailSection>
            <S.DetailKicker $done={isDone}>{status} · 공고 {regDate}</S.DetailKicker>
            <S.DetailTitle>{animal.breed}<span>{gender}</span></S.DetailTitle>
            <S.DetailNotice>공고번호 {animal.noticeNo}</S.DetailNotice>

            <S.DetailFacts>
              <S.DetailFact><dt>품종</dt><dd>{animal.breed}</dd></S.DetailFact>
              <S.DetailFact><dt>성별</dt><dd>{gender}</dd></S.DetailFact>
              <S.DetailFact><dt>상태</dt><dd>{status}</dd></S.DetailFact>
              <S.DetailFact><dt>공고일</dt><dd>{regDate}</dd></S.DetailFact>
              <S.DetailFact $wide><dt>구조 장소</dt><dd>{animal.rescueLocation}</dd></S.DetailFact>
            </S.DetailFacts>
          </S.DetailSection>

          {animal.content && (
            <S.DetailSection>
              <S.DetailHeading>보호소가 남긴 내용</S.DetailHeading>
              <S.DetailText>{animal.content}</S.DetailText>
            </S.DetailSection>
          )}

          <S.DetailSection>
            <S.DetailHeading>입양 절차</S.DetailHeading>
            <S.DetailSteps>
              {adoptSteps.map((step, index) => (
                <S.DetailStep key={step} $first={index === 0}>
                  <span>{index + 1}</span>{step}
                </S.DetailStep>
              ))}
            </S.DetailSteps>
          </S.DetailSection>
        </S.DetailPage>

        <S.DetailActionBar>
          <S.DetailHeartButton
          type="button"
          $liked={liked}
          aria-pressed={liked}
          aria-label={liked ? "관심 동물에서 빼기" : "관심 동물에 추가"}
          onClick={() => toggle(animal.id)}>
            {liked ? <S.AdoptHeartFilledIcon/> : <S.AdoptHeartIcon/>}
          </S.DetailHeartButton>
          <S.DetailApplyButton type="button" disabled={isDone} onClick={() => setIsApplyAlertOpen(true)}>
            {isDone ? "입양이 완료된 친구예요" : "입양 신청하기"}
          </S.DetailApplyButton>
        </S.DetailActionBar>
      </S.Container>

      {/* 입양 신청서 화면은 다음 작업에서 */}
      <CustomAlert
      isOpen={isApplyAlertOpen}
      message="입양 신청은 준비 중이에요. 공고번호로 보호소에 문의해 주세요."
      type="info"
      onConfirm={() => setIsApplyAlertOpen(false)}/>
    </S.AppWrapper>
  );
};
