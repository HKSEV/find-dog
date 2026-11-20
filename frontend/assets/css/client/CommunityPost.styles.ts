"use client";

import {
  FavoriteBorderRounded as HeartIcon,
  FavoriteRounded as HeartFilledIcon,
  ChatBubbleOutlineRounded as CommentIcon
} from "@mui/icons-material";
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

  strong {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray800};
  }
`;

// 글쓴이 사진 + 닉네임 (누르면 프로필)
export const CommunityAuthorLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: inherit;
  text-decoration: none;
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
`;

// 💡 공감(하트)·댓글 수 (글 본문 아래)
export const CommunityReactBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid ${colors.border};
`;

export const CommunityLikeButton = styled.button<{$on: boolean}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid ${({$on}) => ($on ? colors.brand : colors.border)};
  border-radius: 999px;
  background-color: ${({$on}) => ($on ? colors.brandBg : colors.white)};
  color: ${({$on}) => ($on ? colors.brand : colors.gray800)};
  font-size: 14px;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const CommunityHeartIcon = styled(HeartIcon)`
  && {
    font-size: 20px;
  }
`;

export const CommunityHeartFilledIcon = styled(HeartFilledIcon)`
  && {
    font-size: 20px;
  }
`;

export const CommunityCommentCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 6px;
  font-size: 14px;
  color: ${colors.gray500};
`;

export const CommunityCommentIcon = styled(CommentIcon)`
  && {
    font-size: 19px;
  }
`;

// 💡 댓글 목록·쓰기
export const CommunityComments = styled.ul`
  margin: 12px 0 0;
  padding: 0;
  list-style: none;

  & > li {
    display: flex;
    gap: 10px;
    padding: 14px 0;
    border-bottom: 1px solid ${colors.border};
  }

  & > li:last-child {
    border-bottom: 0;
  }
`;

export const CommunityCommentBody = styled.div`
  flex: 1;
  min-width: 0;

  header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: ${colors.gray400};
  }

  header a,
  header strong {
    font-size: 13px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
    text-decoration: none;
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: ${colors.gray800};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const CommunityCommentDelete = styled.button`
  margin-left: auto;
  padding: 2px 4px;
  border: 0;
  background: none;
  font-size: 12px;
  color: ${colors.gray400};
  cursor: pointer;
`;

export const CommunityCommentForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: 12px;

  textarea {
    flex: 1;
    min-height: 44px;
    max-height: 140px;
    padding: 11px 14px;
    border: 1px solid ${colors.border};
    border-radius: 12px;
    font: inherit;
    font-size: 14px;
    line-height: 1.5;
    resize: none;
    box-sizing: border-box;
  }

  textarea:focus {
    outline: none;
    border-color: ${colors.brand};
  }

  button {
    flex: none;
    height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: 12px;
    background-color: ${colors.brand};
    color: ${colors.white};
    font-size: 14px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
  }

  button:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;

export const CommunityCommentLogin = styled.p`
  margin: 12px 0 0;
  padding: 14px;
  border-radius: 12px;
  background-color: ${colors.bgLight};
  font-size: 13px;
  color: ${colors.gray500};
  text-align: center;

  a {
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;
