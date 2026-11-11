"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchShelterAnimals } from "../redux/shelterSlice";
import { genderLabel, toImageUrl, toMonthDay } from "./animalFormat";
import { useLikedAnimals } from "./useLikedAnimals";

import * as S from "@/assets/css/Style.styles";

// 로고의 처진 귀 모양 (사진이 없을 때)
const EarMark = () => (
  <svg width="28" height="20" viewBox="0 0 20 14" aria-hidden="true">
    <ellipse cx="5" cy="7" rx="3.4" ry="6" transform="rotate(-25 5 7)" fill="#d8c9c4"/>
    <ellipse cx="15" cy="7" rx="3.4" ry="6" transform="rotate(25 15 7)" fill="#d8c9c4"/>
  </svg>
);

// 💡 입양·봉사 탭 > 입양: 보호 동물 사진 격자 (최신순)
export default function AdoptTab() {
  const dispatch = useDispatch<AppDispatch>();
  const {animals, loading, error} = useSelector((state: RootState) => state.shelter);
  const {isLiked, toggle} = useLikedAnimals();
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchShelterAnimals());
  }, [dispatch]);

  // 품종·구조 지역·공고번호로 찾고, 공고일 최신순 (같은 날이면 나중에 등록한 순)
  const visibleAnimals = useMemo(() => {
    const word = keyword.trim().toLowerCase();
    return animals
      .filter((animal) =>
        !word || [animal.breed, animal.rescueLocation, animal.noticeNo].some((text) => text?.toLowerCase().includes(word))
      )
      .slice()
      .sort((a, b) => (b.regDate ?? "").localeCompare(a.regDate ?? "") || b.id - a.id);
  }, [animals, keyword]);

  return (
    <>
      <S.AdoptSearch>
        <S.AdoptSearchIcon aria-hidden="true"/>
        <S.AdoptSearchInput
        type="search"
        aria-label="보호 동물 검색"
        placeholder="품종, 구조 지역, 공고번호"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}/>
      </S.AdoptSearch>

      <S.AdoptListHead>
        <span>전체 <strong>{visibleAnimals.length}마리</strong></span>
        <span>최신순</span>
      </S.AdoptListHead>

      {loading && animals.length === 0 ? (
        <S.AdoptEmpty>보호 동물을 불러오는 중이에요</S.AdoptEmpty>
      ) : error && animals.length === 0 ? (
        <S.AdoptEmpty>보호 동물을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.AdoptEmpty>
      ) : visibleAnimals.length === 0 ? (
        <S.AdoptEmpty>{keyword ? "찾는 조건에 맞는 친구가 없어요" : "지금 보호 중인 친구가 없어요"}</S.AdoptEmpty>
      ) : (
        <S.AdoptGrid>
          {visibleAnimals.map((animal) => {
            const liked = isLiked(animal.id);
            const imageUrl = toImageUrl(animal.imageUrl);
            return (
              <S.AdoptCard key={animal.id}>
                <S.AdoptCardLink as={Link} href={`/shelter/${animal.id}`}>
                  <S.AdoptPhotoWrap>
                    {imageUrl ? (
                      <S.AdoptPhoto src={imageUrl} alt={`${animal.breed} 사진`}/>
                    ) : (
                      <S.AdoptPhotoEmpty><EarMark/>사진 준비 중</S.AdoptPhotoEmpty>
                    )}
                    {animal.status === "COMPLETED" && <S.AdoptDoneBadge>입양 완료</S.AdoptDoneBadge>}
                  </S.AdoptPhotoWrap>
                  <S.AdoptCardTitle>{animal.breed} · {genderLabel[animal.gender] ?? animal.gender}</S.AdoptCardTitle>
                  <S.AdoptCardMeta>{animal.rescueLocation}에서 구조</S.AdoptCardMeta>
                  <S.AdoptCardMeta $muted>공고 {toMonthDay(animal.regDate)}</S.AdoptCardMeta>
                </S.AdoptCardLink>

                <S.AdoptHeartButton
                type="button"
                $liked={liked}
                aria-pressed={liked}
                aria-label={liked ? "관심 동물에서 빼기" : "관심 동물에 추가"}
                onClick={() => toggle(animal.id)}>
                  {liked ? <S.AdoptHeartFilledIcon/> : <S.AdoptHeartIcon/>}
                </S.AdoptHeartButton>
              </S.AdoptCard>
            );
          })}
        </S.AdoptGrid>
      )}
    </>
  );
};
