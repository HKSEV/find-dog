"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchStoryContents, setCategory, storyCategories, ShelterNews, StoryVideo } from "../redux/storySlice";
import { CommunityPost, PAGE_SIZE, categoryValue, fetchCommunityPosts } from "./communityApi";
import PostList from "./PostList";
import { toImageUrl } from "../shelter/animalFormat";

import { PlayArrow as PlayIcon } from "@mui/icons-material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import * as S from "@/assets/css/Style.styles";

// 전체 보기에서 미리 보여줄 개수
const PREVIEW_POST_COUNT = 5;
const PREVIEW_NEWS_COUNT = 3;
const PREVIEW_VIDEO_COUNT = 4;

// "2026-11-10T09:30:00" -> "2026.11.10"
const toDate = (iso: string) => (iso ? iso.substring(0, 10).replaceAll("-", ".") : "");

const NewsList = ({items}: {items: ShelterNews[]}) => (
  <S.StoryNewsList>
    {items.map((news) => (
      <S.StoryNewsRow key={news.id} as={Link} href={`/story/news/${news.id}`}>
        {toImageUrl(news.imageUrl) ? <S.StoryNewsThumb src={toImageUrl(news.imageUrl)} alt=""/> : <S.StoryNewsThumbEmpty aria-hidden="true"/>}
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

// 💡 커뮤니티 탭: 분류 칩 하나로 모두 봄
//    전체 = 회원 글 최신 + 보호소 소식 + 보호소 영상 / 자유 이야기·입양 후기·구조 이야기·질문 = 회원 글 / 보호소 소식·영상 = 관리자 글
export default function StoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {category, videos, news, loading, error} = useSelector((state: RootState) => state.story);
  const memberCategory = categoryValue(category); // 회원 글 분류면 값, 아니면 undefined

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [postStatus, setPostStatus] = useState<"loading" | "ready" | "error">("loading");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchStoryContents());
  }, [dispatch]);

  // 전체나 회원 글 분류를 고르면 회원 글을 새로 받음
  useEffect(() => {
    if (category !== "전체" && !memberCategory) return;
    let alive = true;
    const size = category === "전체" ? PREVIEW_POST_COUNT : PAGE_SIZE;
    const timer = setTimeout(() => {
      setPostStatus("loading");
      fetchCommunityPosts(memberCategory, undefined, size)
        .then((list) => {
          if (!alive) return;
          setPosts(list);
          setHasMore(list.length === size);
          setPostStatus("ready");
        })
        .catch(() => alive && setPostStatus("error"));
    }, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [category, memberCategory]);

  const loadMore = async () => {
    if (!memberCategory || posts.length === 0) return;
    setLoadingMore(true);
    try {
      const next = await fetchCommunityPosts(memberCategory, posts[posts.length - 1].id);
      setPosts((prev) => [...prev, ...next]);
      setHasMore(next.length === PAGE_SIZE);
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    };
  };

  const writeHref = memberCategory ? `/story/write?category=${memberCategory}` : "/story/write";

  const renderPosts = () => {
    if (postStatus === "loading") return <S.StoryEmpty>글을 불러오는 중이에요</S.StoryEmpty>;
    if (postStatus === "error") return <S.StoryEmpty>글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</S.StoryEmpty>;
    if (posts.length === 0) {
      // "질문가"처럼 조사가 어색하지 않게 "○○ 글"로 씀
      return <S.StoryEmpty>{category === "전체" ? "아직 올라온 글이 없어요." : `아직 올라온 ${category} 글이 없어요.`} 첫 글을 남겨 주세요.</S.StoryEmpty>;
    };
    return <PostList items={posts} showCategory={category === "전체"}/>;
  };

  const renderBody = () => {
    if (memberCategory) {
      return (
        <S.StorySection>
          {renderPosts()}
          {hasMore && (
            <S.CommunityMoreButton type="button" disabled={loadingMore} onClick={loadMore}>
              {loadingMore ? "불러오는 중..." : "더 보기"}
            </S.CommunityMoreButton>
          )}
        </S.StorySection>
      );
    };

    if (loading) return <S.StoryEmpty>이야기를 불러오는 중입니다...</S.StoryEmpty>;
    if (error) return <S.StoryEmpty>{error}</S.StoryEmpty>;

    if (category === "보호소 소식") {
      return news.length ? <NewsList items={news}/> : <S.StoryEmpty>등록된 보호소 소식이 없어요.</S.StoryEmpty>;
    };
    if (category === "보호소 영상") {
      return videos.length ? <VideoGrid items={videos}/> : <S.StoryEmpty>등록된 영상이 없어요.</S.StoryEmpty>;
    };

    return (
      <>
        <S.StorySection>
          <S.StorySectionHead>
            <S.StorySectionTitle>최근 이야기</S.StorySectionTitle>
          </S.StorySectionHead>
          {renderPosts()}
        </S.StorySection>

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
            <S.StorySectionTitle>보호소 영상</S.StorySectionTitle>
            {videos.length > PREVIEW_VIDEO_COUNT && (
              <S.StoryMoreButton onClick={() => dispatch(setCategory("보호소 영상"))}>더보기</S.StoryMoreButton>
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
      <Header title="커뮤니티" isTab/>

      <S.Container>
        <S.HeaderOffset/>

        <S.CategoryChips role="tablist" aria-label="커뮤니티 분류">
          {storyCategories.map((item) => (
            <S.CategoryChip
            key={item}
            role="tab"
            aria-selected={category === item}
            $active={category === item}
            onClick={() => dispatch(setCategory(item))}>
              {item}
            </S.CategoryChip>
          ))}
        </S.CategoryChips>

        {renderBody()}

        {/* 💡 실종·제보의 글쓰기 버튼과 같은 모양 (보고 있는 회원 글 분류로 바로 씀) */}
        <S.MissingWriteFab as={Link} href={writeHref}>
          <S.MissingWritePlus aria-hidden="true"/>
          글쓰기
        </S.MissingWriteFab>

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
