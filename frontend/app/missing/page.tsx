"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchMissingAnimals, type MissingAnimal } from "../redux/missingSlice";
import { setActiveTab } from "../redux/shelterSlice";
import { toImageUrl } from "../shelter/animalFormat";
import { missingBadge, timeAgo, formatWhen } from "./missingFormat";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";
import * as S from "@/assets/css/Style.styles";
import MissingRowLines from "./MissingRowLines";
import AreaSheet from "@/app/components/AreaSheet";
import { distanceKm, formatDistance, useMyArea } from "@/lib/myArea";

// 💡 글 종류 탭 (시안 기준: 전체 / 실종 / 목격)
const typeTabs = [
  {label: "전체", type: null},
  {label: "실종", type: "LOST"},
  {label: "목격", type: "FOUND"}
] as const;

export default function MissingReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {animalList, loading, loadingMore, hasMore, error} = useSelector((state: RootState) => state.missing);

  const [typeTab, setTypeTab] = useState<(typeof typeTabs)[number]["label"]>("전체");
  const [onlySearching, setOnlySearching] = useState(true); // 💡 시안 기준: 찾는 중인 글만 먼저

  // 💡 검색: 헤더 돋보기를 누르면 헤더 자리에 검색창. 입력을 멈추면(0.3초) 서버에서 다시 걸러 받음
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  // 💡 아래로 스크롤하면 헤더를 숨기고 둥근 버튼만, 글쓰기는 + 동그라미로 (검색 중에는 그대로)
  const collapsed = useScrollCollapse() && !searchOpen;

  // 💡 정렬: 최신순 / 가까운 순(내 동네 기준, 지도 장소가 없는 글은 뒤로)
  //    가까운 순도 서버가 전체 글을 거리순으로 정렬해서 10개씩 줌 (받아 둔 글 안에서만 정렬하면 더 가까운 글이 뒤로 밀림)
  const area = useMyArea();
  const [sortNear, setSortNear] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const nearBasis = sortNear && area ? {lat: area.lat, lng: area.lng} : null;
  const nearLat = nearBasis?.lat;
  const nearLng = nearBasis?.lng;

  // 탭·체크·검색어·정렬을 바꾸면 서버에서 다시 걸러서 받음 (글이 많아도 거른 결과로 10개씩)
  const pickedType = typeTabs.find((tab) => tab.label === typeTab)?.type ?? undefined;
  const query = {type: pickedType, status: onlySearching ? "MISSING" as const : undefined, keyword: keyword || undefined, lat: nearLat, lng: nearLng};

  useEffect(() => {
    dispatch(fetchMissingAnimals({type: pickedType, status: onlySearching ? "MISSING" : undefined, keyword: keyword || undefined, lat: nearLat, lng: nearLng}));
  }, [dispatch, pickedType, onlySearching, keyword, nearLat, nearLng]);

  const nearOf = (post: MissingAnimal) =>
    area && post.lat != null && post.lng != null ? distanceKm(area, {lat: post.lat, lng: post.lng}) : null;
  const posts = animalList;
  const lastId = animalList.length > 0 ? animalList[animalList.length - 1].id : undefined;

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
            aria-label="실종·제보 검색"
            placeholder="이름, 품종, 털색, 동네 (예: 망원동 푸들)"
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
        title="실종·제보"
        isTab
        hidden={collapsed}
        action={(
          <S.HeaderActionRow>
            <S.HeaderRoundButton type="button" aria-label="검색" onClick={() => setSearchOpen(true)}>
              <S.HeaderSearchIcon/>
            </S.HeaderRoundButton>
            {/* 💡 지도로 보기 (지도 화면 같은 자리에 "목록"이 있어서 목록 <-> 지도를 오감) */}
            <S.HeaderRoundButton as={Link} href="/map?view=missing" aria-label="지도로 보기">
              <S.MapPillIcon aria-hidden="true"/>
            </S.HeaderRoundButton>
          </S.HeaderActionRow>
        )}/>
      )}

      {/* 헤더가 숨었을 때 오른쪽 위 둥근 버튼 (검색, 지도) */}
      <S.FloatingHeaderActions $show={collapsed} aria-hidden={!collapsed}>
        <S.FloatingRoundButton type="button" aria-label="검색" tabIndex={collapsed ? 0 : -1} onClick={() => setSearchOpen(true)}>
          <S.HeaderSearchIcon/>
        </S.FloatingRoundButton>
        <S.FloatingRoundButton as={Link} href="/map?view=missing" aria-label="지도로 보기" tabIndex={collapsed ? 0 : -1}>
          <S.MapPillIcon/>
        </S.FloatingRoundButton>
      </S.FloatingHeaderActions>

      <S.Container>
        <S.HeaderOffset/>

        <S.AdoptSubTabs role="tablist" aria-label="글 종류">
          {typeTabs.map((tab) => (
            <S.AdoptSubTab
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={typeTab === tab.label}
            $active={typeTab === tab.label}
            onClick={() => setTypeTab(tab.label)}>
              {tab.label}
            </S.AdoptSubTab>
          ))}
        </S.AdoptSubTabs>

        <S.MissingToolbar>
          <S.MissingOnlyToggle>
            <input type="checkbox" checked={onlySearching} onChange={(e) => setOnlySearching(e.target.checked)}/>
            찾는 중인 글만
          </S.MissingOnlyToggle>
          <S.SortToggle role="group" aria-label="정렬">
            <button type="button" aria-pressed={!sortNear} onClick={() => setSortNear(false)}>최신순</button>
            <button
            type="button"
            aria-pressed={sortNear && Boolean(area)}
            onClick={() => {
              setSortNear(true);
              if (!area) setAreaOpen(true); // 내 동네가 없으면 먼저 고르게
            }}>
              가까운 순
            </button>
          </S.SortToggle>
        </S.MissingToolbar>

        {/* 내 동네 기준 (거리 표시·가까운 순) */}
        <S.AreaBasis>
          <S.AreaChip type="button" onClick={() => setAreaOpen(true)}>
            <S.AreaPinIcon aria-hidden="true"/>{area ? area.label : "내 동네 설정"}<S.AreaDownIcon aria-hidden="true"/>
          </S.AreaChip>
          {area ? "기준으로 거리를 보여줘요" : "동네를 고르면 거리와 가까운 순을 볼 수 있어요"}
        </S.AreaBasis>

        {pickedType !== "FOUND" && (
        <S.MissingShelterHint as={Link} href="/shelter" onClick={() => dispatch(setActiveTab("입양"))}>
          <S.MissingHintSearchIcon aria-hidden="true"/>
          <span><strong>잃어버린 아이가 보호소에 들어왔을 수도 있어요.</strong> 보호소 공고도 확인해 보세요.</span>
          <S.MissingHintChevron aria-hidden="true"/>
        </S.MissingShelterHint>
        )}

        <S.MissingRows>
          {loading && animalList.length === 0 ? (
            <S.MissingEmptyText>실종·제보 글을 불러오는 중이에요</S.MissingEmptyText>
          ) : error && animalList.length === 0 ? (
            <S.MissingEmptyText>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>
          ) : posts.length === 0 ? (
            <S.MissingEmptyText>
              {keyword
                ? `"${keyword}"에 맞는 글이 없어요`
                : onlySearching ? "지금 찾는 중인 글이 없어요" : pickedType === "FOUND" ? "올라온 목격 제보가 없어요" : "등록된 실종·제보 글이 없어요"}
            </S.MissingEmptyText>
          ) : (
            posts.map((post) => {
              const done = post.status === "COMPLETED";
              const photo = toImageUrl(post.mediaUrls?.[0]);
              // 목격 글은 둘째 줄에 동네가 있으니 본 때를, 실종 글은 장소를
              const near = nearOf(post);
              const meta = [near != null ? formatDistance(near) : "", post.type === "FOUND" ? formatWhen(post.occurredAt, post.occurredTime) : post.rescueLocation, timeAgo(post.createdAt), done ? "가족 품으로 돌아갔어요" : ""]
                .filter(Boolean)
                .join(" · ");
              return (
                <S.MissingRow key={post.id} as={Link} href={`/missing/detail/?id=${post.id}`} $done={done}>
                  {photo ? (
                    <S.MissingRowThumb src={photo} alt={`${post.breed || "실종 동물"} 사진`}/>
                  ) : (
                    <S.MissingRowThumbEmpty>사진 없음</S.MissingRowThumbEmpty>
                  )}
                  <S.MissingRowBody>
                    <S.MissingBadge $tone={missingBadge(post).tone}>{missingBadge(post).label}</S.MissingBadge>
                    <MissingRowLines post={post}/>
                    <S.MissingRowMeta>{meta}</S.MissingRowMeta>
                  </S.MissingRowBody>
                </S.MissingRow>
              );
            })
          )}

          {hasMore && (
            <S.MissingMoreButton
            type="button"
            disabled={loadingMore}
            onClick={() => dispatch(fetchMissingAnimals(nearLat != null ? {...query, offset: animalList.length} : {...query, cursorId: lastId}))}>
              {loadingMore ? "불러오는 중..." : "이전 글 더 보기"}
            </S.MissingMoreButton>
          )}
        </S.MissingRows>

        <S.MissingWriteFab
        as={Link}
        href={pickedType === "FOUND" ? "/missing/write?type=found" : "/missing/write"}
        $compact={collapsed}
        aria-label="글쓰기">
          <S.MissingWritePlus aria-hidden="true"/>
          <span>글쓰기</span>
        </S.MissingWriteFab>

        {areaOpen && <AreaSheet current={area} onClose={() => setAreaOpen(false)}/>}
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
