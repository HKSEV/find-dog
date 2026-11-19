"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setActiveTab } from "../redux/shelterSlice";

import Header from "@/app/components/Header";
import Footer from "../components/Footer";
import AdoptTab from "./AdoptTab";
import VolunteerTab from "./VolunteerTab";
import StoryTab from "../story/StoryTab";
import * as S from "@/assets/css/Style.styles";

// 💡 함께해요 탭의 하위 메뉴: 입양 / 봉사 / 이야기(예전 커뮤니티 + 보호소 소식·도움 요청·캠페인·영상)
//    보호소는 데이터가 없어서 뺌 (공공 API로 다시 넣을 수 있음)
const subTabs = ["입양", "봉사", "이야기"];

export default function Shelter() {
  const dispatch = useDispatch<AppDispatch>();
  const {activeTab} = useSelector((state: RootState) => state.shelter);

  // 예전 탭 이름: "함께해요"(도움 요청·캠페인)는 이야기로, 그 밖에 모르는 이름은 입양으로
  const currentTab = activeTab === "함께해요" ? "이야기" : subTabs.includes(activeTab) ? activeTab : "입양";

  return (
    <S.AppWrapper>
      <Header title="함께해요" isTab/>

      <S.Container>
        <S.HeaderOffset/>

        <S.AdoptSubTabs aria-label="함께해요 메뉴">
          {subTabs.map((tab) => (
            <S.AdoptSubTab
            key={tab}
            type="button"
            $active={currentTab === tab}
            aria-current={currentTab === tab ? "page" : undefined}
            onClick={() => dispatch(setActiveTab(tab))}>
              {tab}
            </S.AdoptSubTab>
          ))}
        </S.AdoptSubTabs>

        {currentTab === "입양" && <AdoptTab/>}
        {currentTab === "봉사" && <VolunteerTab/>}
        {currentTab === "이야기" && <StoryTab/>}

        {/* 💡 지도로 보기: 보호 동물(구조 장소)과 봉사 장소를 사진 마커로 */}
        {currentTab !== "이야기" && (
          <S.MapFloatButton as={Link} href="/map?view=shelter" $align="center">
            <S.MapEntryIcon aria-hidden="true"/>지도로 보기
          </S.MapFloatButton>
        )}
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
