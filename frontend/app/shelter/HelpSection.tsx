"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchNeedHelps } from "../redux/homeSlice";
import { toImageUrl } from "./animalFormat";
import * as S from "@/assets/css/Style.styles";

const HELP_COUNT = 3;

// 💡 함께해요 > 봉사 맨 위: 도움이 필요해요 (관리자가 올린 도움 요청, /api/need-help)
//    물품·임시 보호도 "돕는 방법"이라 봉사 모집과 같은 탭에 둠. 누르면 도움 요청 상세
export default function HelpSection() {
  const dispatch = useDispatch<AppDispatch>();
  const needHelps = useSelector((state: RootState) => state.home.needHelps);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchNeedHelps());
  }, [dispatch]);

  if (needHelps.length === 0) return null; // 올라온 요청이 없으면 봉사 모집만

  const visibleHelps = showAll ? needHelps : needHelps.slice(0, HELP_COUNT);

  return (
    <S.VolunteerSection $first>
      <S.VolunteerSectionHead>
        <S.VolunteerSectionTitle>도움이 필요해요</S.VolunteerSectionTitle>
        {needHelps.length > HELP_COUNT && (
          <S.VolunteerMoreButton type="button" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? "접기" : "전체보기"}
          </S.VolunteerMoreButton>
        )}
      </S.VolunteerSectionHead>
      <S.VolunteerList>
        {visibleHelps.map((help) => {
          const imageUrl = toImageUrl(help.imageUrl);
          return (
            <S.VolunteerHelpItem key={help.id}>
              <S.VolunteerHelpRow as={Link} href={`/shelter/help/?id=${help.id}`}>
                {imageUrl ? <S.VolunteerHelpThumb src={imageUrl} alt=""/> : <S.VolunteerThumbEmpty/>}
                <S.VolunteerHelpBody>
                  <S.VolunteerHelpTitle>{help.title}</S.VolunteerHelpTitle>
                  <S.VolunteerHelpSummary>{help.content}</S.VolunteerHelpSummary>
                </S.VolunteerHelpBody>
                <S.VolunteerHelpToggle>자세히</S.VolunteerHelpToggle>
              </S.VolunteerHelpRow>
            </S.VolunteerHelpItem>
          );
        })}
      </S.VolunteerList>
    </S.VolunteerSection>
  );
};
