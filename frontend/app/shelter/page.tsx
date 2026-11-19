"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setActiveTab } from "../redux/shelterSlice";

import Header from "@/app/components/Header";
import Footer from "../components/Footer";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";
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
  const collapsed = useScrollCollapse(); // 💡 아래로 스크롤하면 헤더 숨김 (입양·봉사는 둥근 지도 버튼만, 이야기는 글쓰기 줄어듦)
  const showMap = currentTab !== "이야기"; // 이야기는 위치가 없어서 지도 버튼 없음

  return (
    <S.AppWrapper>
      <Header
      title="함께해요"
      isTab
      hidden={collapsed}
      action={showMap ? (
        // 💡 입양·봉사: 보호 동물(구조 장소)과 봉사 장소를 지도로 (이야기는 위치가 없어서 숨김)
        <S.HeaderRoundButton as={Link} href="/map?view=shelter" aria-label="지도로 보기">
          <S.MapPillIcon aria-hidden="true"/>
        </S.HeaderRoundButton>
      ) : undefined}/>

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
        {currentTab === "이야기" && <StoryTab compact={collapsed}/>}

        {/* 헤더가 숨었을 때 오른쪽 위 둥근 지도 버튼 (입양·봉사) */}
        {showMap && (
          <S.FloatingHeaderActions $show={collapsed} aria-hidden={!collapsed}>
            <S.FloatingRoundButton as={Link} href="/map?view=shelter" aria-label="지도로 보기" tabIndex={collapsed ? 0 : -1}>
              <S.MapPillIcon/>
            </S.FloatingRoundButton>
          </S.FloatingHeaderActions>
        )}

      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
