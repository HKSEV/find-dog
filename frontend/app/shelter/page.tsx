"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setActiveTab } from "../redux/shelterSlice";

import Header from "@/app/components/Header";
import Footer from "../components/Footer";
import AdoptTab from "./AdoptTab";
import VolunteerTab from "./VolunteerTab";
import * as S from "@/assets/css/Style.styles";

// 💡 입양·봉사 탭의 하위 메뉴
const subTabs = ["입양", "함께해요"]; // 보호소는 데이터가 없어서 뺌 (공공 API로 다시 넣을 수 있음)

export default function Shelter() {
  const dispatch = useDispatch<AppDispatch>();
  const {activeTab} = useSelector((state: RootState) => state.shelter);

  // 예전 탭 이름이 남아 있으면 입양으로
  const currentTab = subTabs.includes(activeTab) ? activeTab : "입양";

  return (
    <S.AppWrapper>
      <Header title="입양·봉사" isTab/>

      <S.Container>
        <S.HeaderOffset/>

        <S.AdoptSubTabs aria-label="입양·봉사 메뉴">
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
        {currentTab === "함께해요" && <VolunteerTab/>}
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
