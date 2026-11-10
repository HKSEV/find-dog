"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchCampaigns, fetchHomeExtras } from "./redux/homeSlice";
import { fetchMissingAnimals } from "./redux/missingSlice";
import { fetchShelterAnimals } from "./redux/shelterSlice";

import {
  Campaign as CampaignIcon,
  VisibilityOutlined as SeenIcon,
  ArrowForward as ArrowIcon,
  PlayArrow as PlayIcon
} from "@mui/icons-material";

import SplashScreen from "./components/SplashScreen"; // 💡 스플래시 컴포넌트 임포트

import Header from "./components/Header";
import Footer from "./components/Footer";
import * as S from "@/assets/css/Style.styles";

// 💡 홈 노출 개수
const MISSING_COUNT = 2;
const ANIMAL_COUNT = 6;
const HELP_COUNT = 2;

const genderLabel: Record<string, string> = {MALE: "남", FEMALE: "여", UNKNOWN: "성별 모름"};

// 백엔드에 올린 이미지(/uploads/...)는 백엔드 주소를 붙여서 사용
const toImageUrl = (url?: string) => (url && url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url);

// "2026-11-07" -> "11.07"
const toMonthDay = (date: string) => (date ? date.substring(5, 10).replace("-", ".") : "");

// 작성 시각 -> "N분 전", "N시간 전", "N일 전"
const timeAgo = (iso: string) => {
  if (!iso) return "";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}분 전`;
  if (minutes < 60 * 24) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / (60 * 24))}일 전`;
};

// 로고의 처진 귀 모양을 섹션 제목 표시로 사용
const EarMark = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
    <ellipse cx="5" cy="7" rx="3.4" ry="6" transform="rotate(-25 5 7)" fill="#c17f4a"/>
    <ellipse cx="15" cy="7" rx="3.4" ry="6" transform="rotate(25 15 7)" fill="#c17f4a"/>
  </svg>
);

// 세션의 스플래시 완료 여부를 구독합니다. 타이머는 언마운트 시 정리합니다.
const subscribeSplash = (onChange: () => void) => {
  if (sessionStorage.getItem("hasSeenSplash")) return () => {};

  const timer = setTimeout(() => {
    sessionStorage.setItem("hasSeenSplash", "true");
    onChange();
  }, 2000);

  return () => clearTimeout(timer);
};

const getSplashSnapshot = () => !sessionStorage.getItem("hasSeenSplash");

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  // 서버와 첫 렌더에서는 본문을 표시하고, 접속한 세션에 따라 스플래시를 표시합니다.
  const showSplash = useSyncExternalStore(subscribeSplash, getSplashSnapshot, () => false);

  // Redux Store 상태 조회
  const {campaigns, needHelps} = useSelector((state: RootState) => state.home);
  const {animalList: missingList} = useSelector((state: RootState) => state.missing);
  const {animals: shelterAnimals} = useSelector((state: RootState) => state.shelter);

  // 컴포넌트 마운트 시 데이터 로드 (캠페인은 해시태그 없이 전체)
  useEffect(() => {
    dispatch(fetchMissingAnimals());
    dispatch(fetchShelterAnimals());
    dispatch(fetchCampaigns(""));
    dispatch(fetchHomeExtras());
  }, [dispatch]);

  // 찾는 중인 실종 신고를 먼저 보여줌
  const recentMissing = [...missingList]
    .sort((a, b) => Number(a.status === "COMPLETED") - Number(b.status === "COMPLETED"))
    .slice(0, MISSING_COUNT);

  // 보호 중인 동물을 공고 최신순으로
  const waitingAnimals = shelterAnimals
    .filter((animal) => animal.status === "ACTIVE")
    .sort((a, b) => (b.regDate || "").localeCompare(a.regDate || ""))
    .slice(0, ANIMAL_COUNT);

  const campaign = campaigns[0];
  const helps = needHelps.slice(0, HELP_COUNT);

  // 💡 showSplash가 true일 때는 스플래시 화면만 렌더링
  if (showSplash) {
    return <SplashScreen/>;
  };

  return (
    <S.AppWrapper>
      <Header isMain={true}/>
      <S.Container>
        <S.Mt70/>

        {/* 잃어버렸어요 / 발견했어요 */}
        <S.HomeEntryGrid>
          <S.HomeEntryButton as={Link} href="/missing" $primary>
            <CampaignIcon/>
            잃어버렸어요
          </S.HomeEntryButton>
          <S.HomeEntryButton as={Link} href="/missing">
            <SeenIcon/>
            발견했어요
          </S.HomeEntryButton>
        </S.HomeEntryGrid>

        {/* 최근 실종 신고 */}
        <S.HomeSection>
          <S.HomeSectionHead>
            <S.HomeSectionTitle><EarMark/>최근 실종 신고</S.HomeSectionTitle>
            <S.HomeMoreLink as={Link} href="/missing">더보기</S.HomeMoreLink>
          </S.HomeSectionHead>
          {recentMissing.length === 0 ? (
            <S.HomeEmpty>등록된 실종 신고가 없어요.</S.HomeEmpty>
          ) : (
            <S.HomeList>
              {recentMissing.map((post) => (
                <S.HomeListRow key={post.id} as={Link} href="/missing">
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <S.HomeListThumb src={toImageUrl(post.mediaUrls[0])} alt={`${post.breed} 사진`}/>
                  ) : (
                    <S.HomePhotoPlaceholder $size="68px">사진 없음</S.HomePhotoPlaceholder>
                  )}
                  <S.HomeListBody>
                    <S.HomeStatusBadge $done={post.status === "COMPLETED"}>
                      {post.status === "COMPLETED" ? "찾았어요" : "찾는 중"}
                    </S.HomeStatusBadge>
                    <S.HomeListTitle>{post.breed}{post.gender ? ` · ${post.gender}` : ""}</S.HomeListTitle>
                    <S.HomeListMeta>{[post.rescueLocation, timeAgo(post.createdAt)].filter(Boolean).join(" · ")}</S.HomeListMeta>
                  </S.HomeListBody>
                </S.HomeListRow>
              ))}
            </S.HomeList>
          )}
        </S.HomeSection>

        <S.HomeBand/>

        {/* 새 가족을 기다려요 */}
        <S.HomeSection>
          <S.HomeSectionHead>
            <S.HomeSectionTitle><EarMark/>새 가족을 기다려요</S.HomeSectionTitle>
            <S.HomeMoreLink as={Link} href="/shelter">더보기</S.HomeMoreLink>
          </S.HomeSectionHead>
          <S.HomeStrip>
            {waitingAnimals.map((animal) => (
              <S.HomeAnimalCard key={animal.id} as={Link} href="/shelter">
                {animal.imageUrl ? (
                  <S.HomeAnimalImage src={toImageUrl(animal.imageUrl)} alt={`${animal.breed} 사진`}/>
                ) : (
                  <S.HomeAnimalPlaceholder>사진 준비 중</S.HomeAnimalPlaceholder>
                )}
                <S.HomeAnimalName>{animal.breed} · {genderLabel[animal.gender] ?? animal.gender}</S.HomeAnimalName>
                <S.HomeAnimalMeta>{animal.rescueLocation} · 공고 {toMonthDay(animal.regDate)}</S.HomeAnimalMeta>
              </S.HomeAnimalCard>
            ))}
            <S.HomeSeeAllTile as={Link} href="/shelter">
              <svg width="40" height="28" viewBox="0 0 20 14" aria-hidden="true">
                <ellipse cx="5" cy="7" rx="3.4" ry="6" transform="rotate(-25 5 7)" fill="#c17f4a"/>
                <ellipse cx="15" cy="7" rx="3.4" ry="6" transform="rotate(25 15 7)" fill="#c17f4a"/>
              </svg>
              <span>보호 중인 친구<br/>모두 만나기</span>
              <S.HomeSeeAllArrow><ArrowIcon/></S.HomeSeeAllArrow>
            </S.HomeSeeAllTile>
          </S.HomeStrip>
        </S.HomeSection>

        <S.HomeBand/>

        {/* 함께 도와주세요: 입양 캠페인 + 도움이 필요해요 */}
        {(campaign || helps.length > 0) && (
          <S.HomeSection>
            <S.HomeSectionHead>
              <S.HomeSectionTitle>함께 도와주세요</S.HomeSectionTitle>
            </S.HomeSectionHead>
            <S.HomeList>
              {campaign && (
                <S.HomeListRow as="div">
                  <S.HomeThumbWrap>
                    <S.HomeListThumb src={campaign.thumbnailUrl} alt=""/>
                    {campaign.mediaType !== "IMAGE" && (
                      <S.HomePlayBadge><PlayIcon/></S.HomePlayBadge>
                    )}
                  </S.HomeThumbWrap>
                  <S.HomeListBody>
                    <S.HomeKicker>입양 캠페인</S.HomeKicker>
                    <S.HomeListTitle>{campaign.title}</S.HomeListTitle>
                  </S.HomeListBody>
                </S.HomeListRow>
              )}
              {helps.map((help) => (
                <S.HomeListRow key={help.id} as="div">
                  <S.HomeListThumb src={help.imageUrl} alt=""/>
                  <S.HomeListBody>
                    <S.HomeKicker $tone="danger">도움이 필요해요</S.HomeKicker>
                    <S.HomeListTitle>{help.title}</S.HomeListTitle>
                    <S.HomeListMeta>{help.content}</S.HomeListMeta>
                  </S.HomeListBody>
                </S.HomeListRow>
              ))}
            </S.HomeList>
          </S.HomeSection>
        )}

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
