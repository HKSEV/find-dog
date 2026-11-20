"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchCampaigns, fetchNeedHelps } from "./redux/homeSlice";
import { fetchMissingAnimals } from "./redux/missingSlice";
import { fetchShelterAnimals, setActiveTab } from "./redux/shelterSlice";
import { petNameOf, timeAgo } from "./missing/missingFormat";
import { animalTitle, toImageUrl } from "./shelter/animalFormat";
import { VolunteerPost, dateParts, fetchVolunteers } from "./volunteer/volunteerApi";

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
import { setCategory } from "./redux/storySlice";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";

// 💡 홈 노출 개수
const MISSING_COUNT = 2;
const ANIMAL_COUNT = 6;
const HELP_COUNT = 2;
const VOLUNTEER_COUNT = 2;

// 업로드 사진은 배포 경로를 붙여서 사용

// "2026-11-07" -> "11.07"
const toMonthDay = (date: string) => (date ? date.substring(5, 10).replace("-", ".") : "");

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
  const collapsed = useScrollCollapse(); // 💡 아래로 스크롤하면 헤더 숨김·지도보기 버튼 줄임

  // 서버와 첫 렌더에서는 본문을 표시하고, 접속한 세션에 따라 스플래시를 표시합니다.
  const showSplash = useSyncExternalStore(subscribeSplash, getSplashSnapshot, () => false);

  // Redux Store 상태 조회
  const {campaigns, needHelps} = useSelector((state: RootState) => state.home);
  const {animalList: missingList} = useSelector((state: RootState) => state.missing);
  const {animals: shelterAnimals} = useSelector((state: RootState) => state.shelter);

  // 컴포넌트 마운트 시 데이터 로드 (캠페인은 해시태그 없이 전체)
  // 함께 도와주세요에 보여줄 신청할 수 있는 봉사 (가까운 날짜 순)
  const [volunteers, setVolunteers] = useState<VolunteerPost[]>([]);
  useEffect(() => {
    let alive = true;
    fetchVolunteers()
      .then((list) => alive && setVolunteers(list.filter((post) => post.state === "OPEN").slice(0, VOLUNTEER_COUNT)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    dispatch(fetchMissingAnimals({status: "MISSING"})); // 찾는 중인 글만 서버에서 걸러 받음
    dispatch(fetchShelterAnimals());
    dispatch(fetchCampaigns(""));
    dispatch(fetchNeedHelps());
  }, [dispatch]);

  // 찾는 중인 실종·목격 글 최신순 (예전엔 최신 10개 안에서만 찾는 중을 앞으로 보내서, 최근 글이 대부분 "찾았어요"면 찾는 중인 글이 빠졌음)
  const recentMissing = missingList.filter((post) => post.status !== "COMPLETED").slice(0, MISSING_COUNT);

  // 보호 중인 동물을 공고 최신순으로
  const waitingAnimals = shelterAnimals
    .filter((animal) => animal.status === "ACTIVE")
    .sort((a, b) => (b.regDate || "").localeCompare(a.regDate || ""))
    .slice(0, ANIMAL_COUNT);

  const campaign = campaigns[0];
  const helps = needHelps.slice(0, HELP_COUNT);

  // 함께 도와주세요 → 입양·봉사 탭의 함께해요 화면으로
  // 도움 요청·캠페인은 함께해요 > 이야기 > 보호소 말머리에서 보임
  const openVolunteerTab = () => {
    dispatch(setActiveTab("이야기"));
    dispatch(setCategory("보호소"));
  };

  // 💡 showSplash가 true일 때는 스플래시 화면만 렌더링
  if (showSplash) {
    return <SplashScreen/>;
  };

  return (
    <S.AppWrapper>
      <Header isMain={true} hidden={collapsed}/>
      <S.Container>
        <S.HeaderOffset/>

        {/* 잃어버렸어요 / 발견했어요 */}
        <S.HomeEntryGrid>
          {/* 잃어버렸어요: 바로 실종 신고 글쓰기 / 발견했어요: 찾는 글이 있는지 목록부터 */}
          <S.HomeEntryButton as={Link} href="/missing/write" $primary>
            <strong>잃어버렸어요</strong>
            <small>신고하기 ›</small>
            <CampaignIcon aria-hidden="true"/>
          </S.HomeEntryButton>
          <S.HomeEntryButton as={Link} href="/missing">
            <strong>발견했어요</strong>
            <small>찾는 글 보기 ›</small>
            <SeenIcon aria-hidden="true"/>
          </S.HomeEntryButton>
        </S.HomeEntryGrid>

        <S.HomeBand/>

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
                <S.HomeListRow key={post.id} as={Link} href={`/missing/detail/?id=${post.id}`}>
                  {post.mediaUrls && post.mediaUrls.length > 0 ? (
                    <S.HomeListThumb src={toImageUrl(post.mediaUrls[0])} alt={`${post.breed} 사진`}/>
                  ) : (
                    <S.HomePhotoPlaceholder $size="68px">사진 없음</S.HomePhotoPlaceholder>
                  )}
                  <S.HomeListBody>
                    <S.HomeStatusBadge $done={post.status === "COMPLETED"}>
                      {post.status === "COMPLETED" ? "찾았어요" : "찾는 중"}
                    </S.HomeStatusBadge>
                    <S.HomeListTitle>{[petNameOf(post), post.breed, post.gender].filter(Boolean).join(" · ")}</S.HomeListTitle>
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
              <S.HomeAnimalCard key={animal.id} as={Link} href={`/shelter/detail/?id=${animal.id}`}>
                {animal.imageUrl ? (
                  <S.HomeAnimalImage src={toImageUrl(animal.imageUrl)} alt={`${animal.breed} 사진`}/>
                ) : (
                  <S.HomeAnimalPlaceholder>사진 준비 중</S.HomeAnimalPlaceholder>
                )}
                <S.HomeAnimalName>{animalTitle(animal)}</S.HomeAnimalName>
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

        {/* 함께 도와주세요: 봉사 모집 + 입양 캠페인 + 도움이 필요해요 */}
        {(volunteers.length > 0 || campaign || helps.length > 0) && (
          <S.HomeSection>
            <S.HomeSectionHead>
              <S.HomeSectionTitle><EarMark/>함께 도와주세요</S.HomeSectionTitle>
              <S.HomeMoreLink as={Link} href="/shelter" onClick={openVolunteerTab}>더보기</S.HomeMoreLink>
            </S.HomeSectionHead>
            <S.HomeList>
              {volunteers.map((post) => {
                const {month, day, weekday} = dateParts(post.activityDate);
                return (
                  <S.HomeListRow key={`v${post.id}`} as={Link} href={`/volunteer/detail/?id=${post.id}`}>
                    <S.HomeVolunteerDate aria-hidden="true">
                      <small>{month}</small>
                      <strong>{day}</strong>
                      <small>{weekday}</small>
                    </S.HomeVolunteerDate>
                    <S.HomeListBody>
                      <S.HomeKicker>봉사 모집 · {post.capacity - post.appliedCount}자리 남음</S.HomeKicker>
                      <S.HomeListTitle>{post.title}</S.HomeListTitle>
                      <S.HomeListMeta>{post.startTime}~{post.endTime} · {post.place}</S.HomeListMeta>
                    </S.HomeListBody>
                  </S.HomeListRow>
                );
              })}
              {campaign && (
                <S.HomeListRow as={Link} href="/shelter" onClick={openVolunteerTab}>
                  <S.HomeThumbWrap>
                    <S.HomeListThumb src={toImageUrl(campaign.thumbnailUrl)} alt=""/>
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
                <S.HomeListRow key={help.id} as={Link} href="/shelter" onClick={openVolunteerTab}>
                  <S.HomeListThumb src={toImageUrl(help.imageUrl)} alt=""/>
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

        {/* 💡 지도보기 (실종·목격, 보호 동물, 봉사를 사진 마커로). 아래로 스크롤하면 아이콘만 */}
        <S.HomeMapFab as={Link} href="/map" $compact={collapsed} aria-label="지도보기">
          <S.MapPillIcon aria-hidden="true"/>
          <span>지도보기</span>
        </S.HomeMapFab>

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
