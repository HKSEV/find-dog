"use client";

import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchStories, setActiveTab, setSubTab, toggleAlert, setDummyStories } from "../redux/storySlice";
import * as S from "@/assets/css/style.styles";

// MUI 아이콘
import { NotificationsOutlined as NotificationsIcon } from "@mui/icons-material";
import { MessageSquare, Share2, Eye } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  StorySubTabs,
  StorySubTab,
  StoryFilters,
  ViewOptions,
  GridViewIcon,
  StoryAlert,
  StoryList,
  LoadingMessage,
  StoryCard,
  FeaturedCard,
  FeaturedHeader,
  FeaturedBadge,
  FeaturedTime,
  FeaturedContent,
  FeaturedImage,
  FeaturedTitle,
  FeaturedDescription,
  FeaturedStats,
  StoryHeader,
  AuthorDetails,
  AuthorAvatar,
  AuthorName,
  AuthorTime,
  PostMenu,
  StoryTitle,
  StoryDescription,
  StoryImages,
  StoryImage,
  StoryActions,
  CommentCount,
  WriteIcon
} from "@/assets/css/client/Story.styles";

export default function StoryPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {activeTab, subTab, isAlertOn, storyList, loading} = useSelector((state: RootState) => state.story);

  useEffect(() => {
    const loadStories = async () => {
      const resultAction = await dispatch(fetchStories());
      if (fetchStories.rejected.match(resultAction)) {
        // API 요청 실패 시 더미 데이터 세팅
        dispatch(
          setDummyStories([
            {
              id: 1,
              category: "입양후기",
              author: "Crong",
              timeAgo: "2026.10.02",
              title: "우리집 막내 사랑이💕",
              content:
                "사랑이와 가족이 된지 100일이 지났어요. 그동안 적응하느라 사랑이도 가족들도 쉽지 않았지만 이제는 사랑...",
              images: ["https://placehold.co/140x140"],
              commentsCount: 0,
              sharesCount: 0,
              viewsCount: 0,
              isPick: true
            },
            {
              id: 2,
              category: "입양후기",
              author: "7번째난쟁이",
              timeAgo: "13분 전",
              title: "애기 데려온지 두달차❤️",
              content:
                "시간이 이렇게 빠르게 흘러 벌써 두달차된 초보 집사입니다😊 처음 봤을때 손바닥만했는데 이렇게 크다니.. 가면 갈수록 더 이뻐지는게 너무 신기하고 아주 이뻐 죽겠어용...",
              images: ["https://placehold.co/120x120", "https://placehold.co/120x120", "https://placehold.co/120x120"],
              commentsCount: 0,
              sharesCount: 3,
              viewsCount: 12,
              isPick: false
            }
          ])
        );
      };
    };

    loadStories();
  }, [dispatch]);

  return (
    <S.AppWrapper>
      {/* 상단 헤더 */}
      <Header title="스토리"/>

      <S.Container>
        {/* 1차 탭 메뉴 */}
        <S.TabContainer>
          {["입양이야기", "입양 / 임보", "봉사", "어서찾아주개 정보"].map((tab) => (
            <S.TabBtn key={tab} $active={activeTab === tab} onClick={() => dispatch(setActiveTab(tab))}>
              {tab}
            </S.TabBtn>
          ))}
        </S.TabContainer>

        {/* 2차 서브 탭 메뉴 */}
        <StorySubTabs>
          {["전체", "입양후기", "일상공유", "고민상담"].map((sub) => (
            <StorySubTab key={sub} onClick={() => dispatch(setSubTab(sub))} $active={subTab === sub}>
              {sub}
            </StorySubTab>
          ))}
        </StorySubTabs>

        {/* 필터 및 정렬 바 */}
        <StoryFilters>
          <S.FilterSelect defaultValue="allArea">
            <option value="allArea">모든 지역</option>
          </S.FilterSelect>

          <S.FilterSelect defaultValue="latest">
            <option value="latest">최신순</option>
          </S.FilterSelect>

          <ViewOptions>
            <GridViewIcon>🔲</GridViewIcon>
            <GridViewIcon>☰</GridViewIcon>
          </ViewOptions>
        </StoryFilters>

        {/* 실시간 알림 토글배너 */}
        <StoryAlert>
          <S.AlertInfo>
            <div className="icon-circle">
              <NotificationsIcon/>
            </div>
            <div className="text-group">
              <strong>이 카테고리 실시간 알림</strong>
              <span>새 글이 올라오면 알려드려요</span>
            </div>
          </S.AlertInfo>
          <S.ToggleBtn $isOn={isAlertOn} onClick={() => dispatch(toggleAlert())}>
            <div className="handle"/>
          </S.ToggleBtn>
        </StoryAlert>

        <S.Divider/>

        {/* 스토리 피드 리스트 */}
        <StoryList>
          {loading ? (
            <LoadingMessage>스토리를 불러오는 중입니다...</LoadingMessage>
          ) : storyList.length === 0 ? (
            <LoadingMessage>등록된 스토리가 없습니다.</LoadingMessage>
          ) : (
            storyList.map((post) => (
              <StoryCard key={post.id}>
                {post.isPick ? (
                  <FeaturedCard>
                    <FeaturedHeader>
                      <FeaturedBadge>어서찾아주개 Pick</FeaturedBadge>
                      <FeaturedTime>{post.timeAgo}</FeaturedTime>
                    </FeaturedHeader>

                    <FeaturedContent>
                      <FeaturedImage
                      src={post.images[0]}
                      alt="Pick"
                      width={70}
                      height={70}
                      unoptimized
                      loading="eager"/>
                      <div>
                        <FeaturedTitle>{post.title}</FeaturedTitle>
                        <FeaturedDescription>{post.content}</FeaturedDescription>
                        <FeaturedStats>👤 {post.author}</FeaturedStats>
                      </div>
                    </FeaturedContent>
                  </FeaturedCard>
                ) : (
                  <div>
                    <StoryHeader>
                      <AuthorDetails>
                        <AuthorAvatar>👤</AuthorAvatar>
                        <div>
                          <AuthorName>{post.author}</AuthorName>
                          <AuthorTime>사지말고 입양하세요.</AuthorTime>
                        </div>
                      </AuthorDetails>
                      <PostMenu>{post.timeAgo}</PostMenu>
                    </StoryHeader>

                    <StoryTitle>{post.title}</StoryTitle>
                    <StoryDescription>{post.content}</StoryDescription>

                    {post.images && post.images.length > 0 && (
                      <StoryImages>
                        {post.images.map((img, idx) => (
                          <StoryImage
                          key={idx}
                          src={img}
                          alt={`img-${idx}`}
                          width={90}
                          height={90}
                          unoptimized
                          loading="eager"/>
                        ))}
                      </StoryImages>
                    )}

                    <StoryActions>
                      <CommentCount>
                        <MessageSquare size={14}/> {post.commentsCount}
                      </CommentCount>
                      <CommentCount>
                        <Share2 size={14}/> {post.sharesCount}
                      </CommentCount>
                      <CommentCount>
                        <Eye size={14}/> {post.viewsCount}
                      </CommentCount>
                    </StoryActions>
                  </div>
                )}
              </StoryCard>
            ))
          )}
        </StoryList>

        {/* 글쓰기 플로팅 버튼 */}
        <S.FloatingWriteButton>
          <WriteIcon/>
          <span>글쓰기</span>
        </S.FloatingWriteButton>

        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
