"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

// 💡 하위 탭을 주소에 남김 (/shelter?tab=volunteer): 새로고침·링크·뒤로 가기에도 보던 탭 그대로
const tabKeys: Record<string, string> = {입양: "adopt", 봉사: "volunteer", 이야기: "story"};
const tabOfKey = (key: string | null) => Object.keys(tabKeys).find((tab) => tabKeys[tab] === key);

// 검색창 안내 (탭마다 찾는 대상이 다름)
const searchPlaceholder: Record<string, string> = {
  입양: "이름, 품종, 구조 지역, 등록번호",
  봉사: "봉사 이름, 장소",
  이야기: "회원 이야기 제목, 내용"
};

export default function ShelterPage() {
  return (
    <Suspense fallback={null}>
      <Shelter/>
    </Suspense>
  );
};

function Shelter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {activeTab} = useSelector((state: RootState) => state.shelter);

  // 주소의 탭이 먼저, 없으면 다른 화면에서 고른 탭(예: 홈 "새 가족을 기다려요" -> 입양)
  // 예전 탭 이름: "함께해요"(도움 요청·캠페인)는 이야기로, 그 밖에 모르는 이름은 입양으로
  const urlTab = tabOfKey(searchParams.get("tab"));
  const storedTab = activeTab === "함께해요" ? "이야기" : subTabs.includes(activeTab) ? activeTab : "입양";
  const currentTab = urlTab ?? storedTab;

  useEffect(() => {
    if (urlTab && urlTab !== activeTab) dispatch(setActiveTab(urlTab)); // 다른 화면에서도 같은 탭으로 알게
  }, [urlTab, activeTab, dispatch]);

  // 주소만 바꾸면 위 effect 가 저장된 탭도 맞춤 (둘을 따로 바꾸면 잠깐 이전 탭으로 되돌아감)
  const changeTab = (tab: string) => router.replace(`/shelter?tab=${tabKeys[tab]}`, {scroll: false});

  // 💡 검색 (실종·제보와 같은 방식): 헤더 돋보기 -> 헤더가 검색창으로. 보고 있는 탭 안에서 찾음
  // 홈 검색의 "전체 보기"로 들어오면 (/shelter?tab=adopt&q=백설) 검색창을 열고 그 검색어로
  const initialQuery = searchParams.get("q")?.trim() ?? "";
  const [searchOpen, setSearchOpen] = useState(Boolean(initialQuery));
  const [searchText, setSearchText] = useState(initialQuery);
  const [keyword, setKeyword] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(searchText.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText("");
    setKeyword("");
  };

  const collapsed = useScrollCollapse() && !searchOpen; // 💡 아래로 스크롤하면 헤더 숨김 (검색 중에는 그대로)
  const showMap = currentTab !== "이야기"; // 이야기는 위치가 없어서 지도 버튼 없음

  return (
    <S.AppWrapper>
      {searchOpen ? (
        <S.SearchBar role="search">
          <S.SearchBackButton type="button" aria-label="검색 닫기" onClick={closeSearch}>
            <S.SearchBackIcon/>
          </S.SearchBackButton>
          <S.SearchField>
            <S.HeaderSearchIcon aria-hidden="true"/>
            <input
            ref={searchInputRef}
            type="search"
            enterKeyHint="search"
            aria-label={`${currentTab} 검색`}
            placeholder={searchPlaceholder[currentTab]}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}/>
            {searchText && (
              <S.SearchClearButton type="button" aria-label="검색어 지우기" onClick={() => setSearchText("")}>
                <S.SearchClearIcon/>
              </S.SearchClearButton>
            )}
          </S.SearchField>
        </S.SearchBar>
      ) : (
        <Header
        title="함께해요"
        isTab
        hidden={collapsed}
        action={(
          <S.HeaderActionRow>
            <S.HeaderRoundButton type="button" aria-label="검색" onClick={() => setSearchOpen(true)}>
              <S.HeaderSearchIcon/>
            </S.HeaderRoundButton>
            {/* 💡 입양·봉사: 보호 동물(구조 장소)과 봉사 장소를 지도로 (이야기는 위치가 없어서 숨김) */}
            {showMap && (
              <S.HeaderRoundButton as={Link} href="/map?view=shelter" aria-label="지도로 보기">
                <S.MapPillIcon aria-hidden="true"/>
              </S.HeaderRoundButton>
            )}
          </S.HeaderActionRow>
        )}/>
      )}

      <S.Container>
        <S.HeaderOffset/>

        <S.AdoptSubTabs aria-label="함께해요 메뉴">
          {subTabs.map((tab) => (
            <S.AdoptSubTab
            key={tab}
            type="button"
            $active={currentTab === tab}
            aria-current={currentTab === tab ? "page" : undefined}
            onClick={() => changeTab(tab)}>
              {tab}
            </S.AdoptSubTab>
          ))}
        </S.AdoptSubTabs>

        {currentTab === "입양" && <AdoptTab keyword={keyword}/>}
        {currentTab === "봉사" && <VolunteerTab keyword={keyword}/>}
        {currentTab === "이야기" && <StoryTab compact={collapsed} keyword={keyword}/>}

        {/* 헤더가 숨었을 때 오른쪽 위 둥근 버튼 (검색, 입양·봉사는 지도) */}
        <S.FloatingHeaderActions $show={collapsed} aria-hidden={!collapsed}>
          <S.FloatingRoundButton type="button" aria-label="검색" tabIndex={collapsed ? 0 : -1} onClick={() => setSearchOpen(true)}>
            <S.HeaderSearchIcon/>
          </S.FloatingRoundButton>
          {showMap && (
            <S.FloatingRoundButton as={Link} href="/map?view=shelter" aria-label="지도로 보기" tabIndex={collapsed ? 0 : -1}>
              <S.MapPillIcon/>
            </S.FloatingRoundButton>
          )}
        </S.FloatingHeaderActions>
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
