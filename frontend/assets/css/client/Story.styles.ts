"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 커뮤니티 탭 (디자인 개편 시안 기준)

export const CommunityTabs = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 20px;
  border-bottom: 1px solid ${colors.border};
`;

export const CommunityTab = styled.button<{$active: boolean}>`
  height: 44px;
  padding: 0;
  margin-bottom: -1px;
  border: 0;
  border-bottom: 2px solid ${({$active}) => ($active ? colors.brand : "transparent")};
  background: transparent;
  font-size: 15px;
  font-weight: ${({$active}) => ($active ? fontWeight.bold : fontWeight.medium)};
  color: ${({$active}) => ($active ? colors.gray900 : colors.gray500)};
  cursor: pointer;
`;

export const CategoryChips = styled.div`
  display: flex;
  gap: 6px;
  padding: 12px 20px 4px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryChip = styled.button<{$active: boolean}>`
  flex: none;
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background-color: ${({$active}) => ($active ? colors.brand : colors.bgSubtle)};
  color: ${({$active}) => ($active ? colors.white : colors.gray800)};
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
`;

// 섹션 (전체 보기에서 보호소 소식 / 영상을 나눠 보여줄 때)
export const StorySection = styled.section`
  padding: 20px 0 0;
`;

export const StorySectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

export const StorySectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: ${fontWeight.bold};
  color: ${colors.gray900};
`;

export const StoryMoreButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 13px;
  color: ${colors.gray500};
  cursor: pointer;
`;

export const StoryEmpty = styled.p`
  margin: 0;
  padding: 24px 20px 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${colors.gray500};
`;

// 보호소 소식 목록
export const StoryNewsList = styled.div`
  padding: 4px 20px 0;
`;

export const StoryNewsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }
`;

export const StoryNewsThumb = styled.img`
  flex: none;
  width: 76px;
  height: 76px;
  object-fit: cover;
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
`;

export const StoryNewsBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const StoryNewsTitle = styled.span`
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  line-height: 1.4;
  color: ${colors.gray900};
`;

export const StoryNewsSummary = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  color: ${colors.gray500};
`;

export const StoryNewsDate = styled.span`
  font-size: 12px;
  color: ${colors.gray500};
`;

// 영상 목록 (2열)
export const StoryVideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 10px;
  padding: 12px 20px 0;
`;

export const StoryVideoCard = styled.a`
  display: block;
  color: ${colors.gray900};
  text-decoration: none;
`;

export const StoryVideoThumbWrap = styled.span`
  position: relative;
  display: block;
`;

export const StoryVideoThumb = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
`;

export const StoryVideoPlayBadge = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background-color: rgba(31, 27, 26, 0.6);
  color: ${colors.white};
  transform: translate(-50%, -50%);

  svg {
    font-size: 20px;
  }
`;

export const StoryVideoTitle = styled.span`
  display: -webkit-box;
  margin-top: 8px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 14px;
  font-weight: ${fontWeight.semibold};
  line-height: 1.4;
`;
