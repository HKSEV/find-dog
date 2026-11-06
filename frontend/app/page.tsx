"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "./store/store";
import { fetchAnimals, fetchCampaigns, fetchHomeExtras, setActiveHashtag } from "./redux/homeSlice";

import SplashScreen from "./components/SplashScreen"; // 💡 스플래시 컴포넌트 임포트

import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";

import * as S from "@/assets/css/style.styles";
import { HomeGrid } from "@/assets/css/client/Home.styles";
import Header from "./components/Header";
import Footer from "./components/Footer";

import BannerCarousel from "./components/content/BannerCarousel";
import ConnectsCarousel from "./components/content/ConnectCarousel";

// 1. 필요한 MUI 아이콘들을 상단에 import 합니다.
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"; // 소개
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined"; // 입양 캠페인 (손 위에 하트)
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined"; // 포인기부 (저금통)
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined"; // 지원/혜택 (선물상자)
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import styled from "styled-components";

const IntroductionIcon = styled(InfoOutlinedIcon)`
  && {
    color: #b5a196;
  }
`;

const AdoptionIcon = styled(VolunteerActivismOutlinedIcon)`
  && {
    color: #b5a196;
  }
`;

const DonationIcon = styled(SavingsOutlinedIcon)`
  && {
    color: #b5a196;
  }
`;

const SupportIcon = styled(CardGiftcardOutlinedIcon)`
  && {
    color: #b5a196;
  }
`;

const StoreIcon = styled(StorefrontOutlinedIcon)`
  && {
    color: #b5a196;
  }
`;

const CampaignPlayIcon = styled(PlayArrowIcon)`
  && {
    font-size: 18px;
  }
`;
// 스토어 (상점)

// 2. 렌더링할 메뉴 데이터를 객체 배열로 분리하여 정의합니다.
const quickMenus = [
  {name: "소개", icon: <IntroductionIcon/>},
  {name: "입양 캠페인", icon: <AdoptionIcon/>},
  {name: "어서찾아주개 기부", icon: <DonationIcon/>},
  {name: "지원/혜택", icon: <SupportIcon/>},
  {name: "스토어", icon: <StoreIcon/>}
];

const campaignHashtags = ["#제주입양", "#임시보호", "#치료지원"];

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
  const {animals, isAnimalsLoading, campaigns, isCampaignsLoading, activeHashtag, youtubePosts, fellowNews, needHelps} =
    useSelector((state: RootState) => state.home);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    dispatch(fetchAnimals());
    dispatch(fetchHomeExtras());
  }, [dispatch]);

  // activeHashtag가 바뀔 때마다 캠페인 데이터 재조회
  useEffect(() => {
    dispatch(fetchCampaigns(activeHashtag));
  }, [dispatch, activeHashtag]);

  const handleHashtagClick = (tag: string) => {
    dispatch(setActiveHashtag(tag));
  };

  // 💡 showSplash가 true일 때는 스플래시 화면만 렌더링
  if (showSplash) {
    return <SplashScreen/>;
  };

  return (
    <S.AppWrapper>
      <Header isMain={true}/>
      <S.Container>
        <S.Mt70/>

        <BannerCarousel/>

        <S.QuickMenu>
          {quickMenus.map((menu, idx) => (
            <S.MenuIconWrapper key={idx}>
              <S.IconCircle>{menu.icon}</S.IconCircle>
              <S.MenuText>{menu.name}</S.MenuText>
            </S.MenuIconWrapper>
          ))}
        </S.QuickMenu>

        <S.Divider/>

        <ConnectsCarousel/>

        {/* 이달의 추천 입양 동물 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>이달의 추천 입양 동물</S.SectionTitle>
            <S.MoreButton>더보기 &gt;</S.MoreButton>
          </S.SectionHeader>

          <S.HorizontalScroll>
            {["강릉시", "양양군", "밀양시", "마포센터", "삼척시", "화성", "노원구", "도봉구"].map((region, idx) => (
              <S.RegionCircle key={idx}>
                <span>{region}</span>
              </S.RegionCircle>
            ))}
          </S.HorizontalScroll>

          <S.HorizontalScroll>
            {isAnimalsLoading ? (
              <S.StatusText>데이터를 불러오는 중입니다...</S.StatusText>
            ) : animals.length === 0 ? (
              <S.StatusText>추천 동물이 없습니다</S.StatusText>
            ) : (
              animals.map((animal) => (
                <S.AnimalCard key={animal.id}>
                  <S.CardImage
                  src={animal.imageUrl || "https://via.placeholder.com/160x160"}
                  alt={`dog-${animal.id}`}/>
                  <S.CardBody>
                    <S.CardTitle>
                      {animal.region}
                      {animal.noticeNo}
                    </S.CardTitle>
                    <S.CardDesc>
                      {animal.birthYear}/{animal.gender}/{animal.weight}Kg
                    </S.CardDesc>
                  </S.CardBody>
                </S.AnimalCard>
              ))
            )}
          </S.HorizontalScroll>
        </S.Section>

        <S.Divider/>

        {/* 입양 캠페인 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>입양 캠페인</S.SectionTitle>
            <S.MoreButton>{"더보기  >"}</S.MoreButton>
          </S.SectionHeader>

          <S.HashtagScroll>
            {campaignHashtags.map((tag, idx) => (
              <S.HashtagBtn key={idx} $active={activeHashtag === tag} onClick={() => handleHashtagClick(tag)}>
                {tag}
              </S.HashtagBtn>
            ))}
          </S.HashtagScroll>

          <S.HorizontalScroll>
            {isCampaignsLoading ? (
              <S.StatusText>캠페인을 불러오는 중입니다..</S.StatusText>
            ) : campaigns.length === 0 ? (
              <S.StatusText>해당 해시태그의 캠페인이 없습니다</S.StatusText>
            ) : (
              campaigns.map((item) => (
                <S.CampaignCard key={item.id}>
                  <S.CampaignMediaWrap>
                    <S.CampaignImg src={item.thumbnailUrl} alt={item.title}/>
                    {item.mediaType !== "IMAGE" && (
                      <S.PlayIconWrap>
                        <CampaignPlayIcon/>
                      </S.PlayIconWrap>
                    )}
                  </S.CampaignMediaWrap>
                  <S.CampaignTextWrap>
                    <S.CampaignCardTitle>{item.title}</S.CampaignCardTitle>
                    <S.CampaignCardDesc>{item.content}</S.CampaignCardDesc>
                  </S.CampaignTextWrap>
                </S.CampaignCard>
              ))
            )}
          </S.HorizontalScroll>
        </S.Section>

        <S.Divider/>

        {/* 유튜브 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>어서찾아주개 유튜브</S.SectionTitle>
          </S.SectionHeader>
          <HomeGrid $cols={2} $gap="1rem">
            {youtubePosts.map((video) => (
              <div key={video.id}>
                <S.Thumb>
                  <S.VideoThumb src={video.thumbnailUrl} alt={video.title}/>
                  <S.YoutubePlayIcon/>
                </S.Thumb>
                <p>{video.title}</p>
              </div>
            ))}
          </HomeGrid>
        </S.Section>

        <S.Divider/>

        {/* 펠로우 소식 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>펠로우 소식</S.SectionTitle>
            <S.MoreButton>더보기 &gt;</S.MoreButton>
          </S.SectionHeader>
          <HomeGrid $cols={3} $gap=".5rem">
            {fellowNews.map((news) => (
              <div key={news.id}>
                <S.Thumb>
                  <S.VideoThumb src={news.imageUrl} alt={news.title}/>
                </S.Thumb>
                <S.NewsTitle>{news.title}</S.NewsTitle>
              </div>
            ))}
          </HomeGrid>
        </S.Section>

        <S.Divider/>

        {/* 도움이 필요해요 */}
        <S.Section>
          <S.SectionHeader>
            <S.SectionTitle>도움이 필요해요</S.SectionTitle>
            <S.MoreButton>더보기 &gt;</S.MoreButton>
          </S.SectionHeader>
          <HomeGrid $cols={4} $gap=".25rem">
            {needHelps.map((help) => (
              <div key={help.id}>
                <S.Thumb>
                  <S.VideoThumb src={help.imageUrl} alt="도움이 필요해요"/>
                </S.Thumb>
              </div>
            ))}
          </HomeGrid>
        </S.Section>

        {/* 통계 */}
        <S.Section $bgLight>
          <S.SectionHeader>
            <S.SectionTitle>2026.유기동물통계</S.SectionTitle>
            <S.MoreButton>더보기 &gt;</S.MoreButton>
          </S.SectionHeader>
          <S.StatBox>
            <S.StatItem>
              <S.StatLabel $color="#198754">구조</S.StatLabel>6마리
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel $color="#0d6efd">입양률</S.StatLabel>25.2%
            </S.StatItem>
            <S.StatItem>
              <S.StatLabel $color="#dc3545">안락사율</S.StatLabel>11.9%
            </S.StatItem>
          </S.StatBox>
        </S.Section>

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
