"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 커뮤니티 회원 글 목록·상세 (입양 후기, 구조 이야기, 질문)

export const CommunityPostList = styled.ul`
  margin: 0;
  padding: 4px 20px 0;
  list-style: none;
`;

export const CommunityPostRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900}; /* 전역 a:hover 파란색 대신 */
  }
`;

export const CommunityPostBody = styled.span`
  flex: 1;
  min-width: 0;
`;

export const CommunityPostKind = styled.span`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.brand};
`;

export const CommunityPostTitle = styled.strong`
  display: block;
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  line-height: 1.4;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const CommunityPostSummary = styled.span`
  display: block;
  margin-top: 4px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  color: ${colors.gray500};
`;

export const CommunityPostMeta = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: ${colors.gray400};
`;

export const CommunityPostThumb = styled.img`
  flex: none;
  width: 68px;
  height: 68px;
  border-radius: 10px;
  object-fit: cover;
  background-color: ${colors.bgSubtle};
`;

export const CommunityMoreButton = styled.button`
  display: block;
  width: calc(100% - 40px);
  height: 44px;
  margin: 16px 20px 0;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background-color: ${colors.white};
  color: ${colors.gray800};
  font-size: 14px;
  font-weight: ${fontWeight.medium};
  cursor: pointer;

  &:disabled {
    color: ${colors.gray400};
    cursor: default;
  }
`;

// 상세: 글쓴이 줄 (작은 사진 + 닉네임 · 시간)
export const CommunityAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 13px;
  color: ${colors.gray500};

  img,
  > span:first-child {
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    object-fit: cover;
    background-color: ${colors.bgMuted};
  }

  strong {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray800};
  }
`;

// 상세 사진: 옆으로 넘기기 (여러 장일 때)
export const CommunityPhotos = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  img {
    flex: none;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    object-fit: cover;
    scroll-snap-align: start;
    background-color: ${colors.bgSubtle};
  }
`;

export const CommunityPhotoCount = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${colors.gray400};
`;

// 보호소 소식 상세: 영상·첨부 파일 링크
export const NewsLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;

  a {
    display: inline-flex;
    align-items: center;
    height: 40px;
    padding: 0 14px;
    border: 1px solid ${colors.border};
    border-radius: 10px;
    color: ${colors.gray800};
    font-size: 14px;
    font-weight: ${fontWeight.medium};
    text-decoration: none;
  }

  a:hover {
    color: ${colors.gray800};
  }
`;
