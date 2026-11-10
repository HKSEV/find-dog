"use client";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import {
  communityTabs,
  fetchStoryContents,
  setActiveTab,
  setCategory,
  storyCategories,
  ShelterNews,
  StoryVideo
} from "../redux/storySlice";

import { PlayArrow as PlayIcon } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as S from "@/assets/css/Style.styles";

// 전체 보기에서 미리 보여줄 개수
const PREVIEW_NEWS_COUNT = 3;
const PREVIEW_VIDEO_COUNT = 4;

// 업로드 이미지는 백엔드 주소를 붙여서 사용
const toImageUrl = (url?: string) => (url && url.startsWith("/uploads/") ? `http://localhost:8080${url}` : url);

// "2026-11-10T09:30:00" -> "2026.11.10"
const toDate = (iso: string) => (iso ? iso.substring(0, 10).replaceAll("-", ".") : "");

const NewsList = ({items}: {items: ShelterNews[]}) => (
  <S.StoryNewsList>
    {items.map((news) => (
      <S.StoryNewsRow key={news.id}>
        <S.StoryNewsThumb src={toImageUrl(news.imageUrl)} alt=""/>
        <S.StoryNewsBody>
          <S.StoryNewsTitle>{news.title}</S.StoryNewsTitle>
          <S.StoryNewsSummary>{news.content}</S.StoryNewsSummary>
          <S.StoryNewsDate>{toDate(news.insertDt)}</S.StoryNewsDate>
        </S.StoryNewsBody>
      </S.StoryNewsRow>
    ))}
  </S.StoryNewsList>
);

const VideoGrid = ({items}: {items: StoryVideo[]}) => (
  <S.StoryVideoGrid>
    {items.map((video) => (
      <S.StoryVideoCard key={video.id} href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
        <S.StoryVideoThumbWrap>
          <S.StoryVideoThumb src={toImageUrl(video.thumbnailUrl)} alt=""/>
          <S.StoryVideoPlayBadge><PlayIcon/></S.StoryVideoPlayBadge>
        </S.StoryVideoThumbWrap>
        <S.StoryVideoTitle>{video.title}</S.StoryVideoTitle>
      </S.StoryVideoCard>
    ))}
  </S.StoryVideoGrid>
);

export default function StoryPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {activeTab, category, videos, news, loading, error} = useSelector((state: RootState) => state.story);

  useEffect(() => {
    dispatch(fetchStoryContents());
  }, [dispatch]);

  // 이야기 탭 본문: 분류에 따라 보호소 소식 / 영상 / 준비 중 안내를 보여줌
  const renderStories = () => {
    if (loading) return <S.StoryEmpty>이야기를 불러오는 중입니다...</S.StoryEmpty>;
    if (error) return <S.StoryEmpty>{error}</S.StoryEmpty>;

    if (category === "보호소 소식") {
      return news.length ? <NewsList items={news}/> : <S.StoryEmpty>등록된 보호소 소식이 없어요.</S.StoryEmpty>;
    };
    if (category === "영상") {
      return videos.length ? <VideoGrid items={videos}/> : <S.StoryEmpty>등록된 영상이 없어요.</S.StoryEmpty>;
    };
    if (category !== "전체") {
      // 💡 입양 후기 · 임시보호 일기 · 구조 이야기는 회원 글 백엔드(community_posts)가 생기면 연결
      return <S.StoryEmpty>{category}는 곧 나눌 수 있어요.</S.StoryEmpty>;
    };

    return (
      <>
        <S.StorySection>
          <S.StorySectionHead>
            <S.StorySectionTitle>보호소 소식</S.StorySectionTitle>
            {news.length > PREVIEW_NEWS_COUNT && (
              <S.StoryMoreButton onClick={() => dispatch(setCategory("보호소 소식"))}>더보기</S.StoryMoreButton>
            )}
          </S.StorySectionHead>
          {news.length ? (
            <NewsList items={news.slice(0, PREVIEW_NEWS_COUNT)}/>
          ) : (
            <S.StoryEmpty>등록된 보호소 소식이 없어요.</S.StoryEmpty>
          )}
        </S.StorySection>

        <S.StorySection>
          <S.StorySectionHead>
            <S.StorySectionTitle>영상</S.StorySectionTitle>
            {videos.length > PREVIEW_VIDEO_COUNT && (
              <S.StoryMoreButton onClick={() => dispatch(setCategory("영상"))}>더보기</S.StoryMoreButton>
            )}
          </S.StorySectionHead>
          {videos.length ? (
            <VideoGrid items={videos.slice(0, PREVIEW_VIDEO_COUNT)}/>
          ) : (
            <S.StoryEmpty>등록된 영상이 없어요.</S.StoryEmpty>
          )}
        </S.StorySection>
      </>
    );
  };

  return (
    <S.AppWrapper>
      {/* 상단 헤더 */}
      <Header title="커뮤니티" isTab/>

      <S.Container>
        <S.Mt70/>

        {/* 이야기 / 질문·정보 / 나눔 */}
        <S.CommunityTabs role="tablist" aria-label="커뮤니티 메뉴">
          {communityTabs.map((tab) => (
            <S.CommunityTab
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            $active={activeTab === tab}
            onClick={() => dispatch(setActiveTab(tab))}>
              {tab}
            </S.CommunityTab>
          ))}
        </S.CommunityTabs>

        {activeTab === "이야기" ? (
          <>
            <S.CategoryChips>
              {storyCategories.map((item) => (
                <S.CategoryChip
                key={item}
                aria-pressed={category === item}
                $active={category === item}
                onClick={() => dispatch(setCategory(item))}>
                  {item}
                </S.CategoryChip>
              ))}
            </S.CategoryChips>

            {renderStories()}
          </>
        ) : (
          // 💡 질문·정보, 나눔도 회원 글 백엔드가 생기면 연결
          <S.StoryEmpty>{activeTab} 게시판은 곧 열려요.</S.StoryEmpty>
        )}

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
