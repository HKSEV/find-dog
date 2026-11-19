"use client";

import { PersonRounded as PersonIcon, ChevronRightRounded as ChevronIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 프로필 사진 (없으면 사람 아이콘)
export const ProfileAvatar = styled.span<{$size: number}>`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: ${({$size}) => $size}px;
  height: ${({$size}) => $size}px;
  overflow: hidden;
  border-radius: 999px;
  background-color: ${colors.bgMuted};
  color: ${colors.white};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    font-size: ${({$size}) => Math.round($size * 0.6)}px;
  }
`;

export const ProfileAvatarIcon = styled(PersonIcon)``;

// ---- 회원 프로필 페이지 ----
export const MemberProfileHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 24px 20px 20px;
  border-bottom: 8px solid ${colors.bgLight};

  strong {
    font-size: 18px;
    font-weight: ${fontWeight.bold};
    color: ${colors.gray900};
  }

  p {
    margin: 0;
    font-size: 13px;
    color: ${colors.gray500};
  }
`;

export const MemberProfileSection = styled.section`
  padding: 20px 20px 4px;

  h2 {
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  h2 span {
    margin-left: 4px;
    color: ${colors.brand};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  & > p {
    margin: 12px 0 16px;
    font-size: 14px;
    color: ${colors.gray400};
  }

  &:last-of-type {
    padding-bottom: 40px;
  }
`;

export const MemberProfilePost = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    overflow: hidden;
    font-size: 15px;
    font-weight: ${fontWeight.medium};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  small {
    font-size: 12px;
    color: ${colors.gray400};
  }
`;

// 💡 글 상세: 글쓴이 (누르면 프로필)
export const DetailAuthor = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;

  div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    overflow: hidden;
    font-size: 16px;
    font-weight: ${fontWeight.semibold};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  small {
    font-size: 13px;
    color: ${colors.gray500};
  }
`;

export const DetailAuthorChevron = styled(ChevronIcon)`
  && {
    flex: none;
    font-size: 22px;
    color: ${colors.gray400};
  }
`;
