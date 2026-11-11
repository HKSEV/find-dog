"use client";

import {
  ChevronRightRounded as ChevronIcon,
  AddRounded as PlusIcon,
  SearchRounded as SearchIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 실종·제보 탭 목록 (디자인 개편 시안 기준)

// 찾는 중인 글만 · 최신순
export const MissingToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 20px;
  font-size: 13px;
  color: ${colors.gray800};
`;

export const MissingOnlyToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${colors.brand};
  }
`;

// 보호소 공고도 확인해 보세요
export const MissingShelterHint = styled.a<{$flush?: boolean}>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: ${({$flush}) => ($flush ? 0 : "4px 20px")};
  padding: 12px 14px;
  border-radius: 12px;
  background-color: ${colors.brandBg};
  color: ${colors.gray900};
  font-size: 13px;
  line-height: 1.5;
  text-decoration: none;

  &:hover {
    color: ${colors.gray900};
  }

  span {
    flex: 1;
  }
`;

export const MissingHintSearchIcon = styled(SearchIcon)`
  && {
    flex: none;
    font-size: 20px;
    color: ${colors.brand};
  }
`;

export const MissingHintChevron = styled(ChevronIcon)`
  && {
    flex: none;
    font-size: 20px;
    color: ${colors.gray400};
  }
`;

export const MissingRows = styled.div`
  padding: 0 20px 96px; /* 아래 글쓰기 버튼에 마지막 글이 가리지 않게 */
`;

export const MissingRow = styled.a<{$done?: boolean}>`
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;
  opacity: ${({$done}) => ($done ? 0.6 : 1)};

  &:hover {
    color: ${colors.gray900}; /* 전역 a:hover 파란색 대신 */
  }
`;

export const MissingRowThumb = styled.img`
  flex: none;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;

export const MissingRowThumbEmpty = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray500};
  font-size: 11px;
`;

export const MissingRowBody = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const badgeColors = {
  lost: {bg: colors.danger, fg: colors.white},
  found: {bg: colors.brandBg, fg: colors.brand},
  done: {bg: colors.bgMuted, fg: colors.gray800}
};

export const MissingBadge = styled.span<{$tone: "lost" | "found" | "done"}>`
  align-self: flex-start;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({$tone}) => badgeColors[$tone].bg};
  color: ${({$tone}) => badgeColors[$tone].fg};
  font-size: 11px;
  font-weight: ${fontWeight.semibold};
`;

export const MissingRowTitle = styled.span`
  overflow: hidden;
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MissingRowTraits = styled.span`
  overflow: hidden;
  font-size: 13px;
  color: ${colors.gray800};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MissingRowMeta = styled.span`
  overflow: hidden;
  margin-top: auto;
  font-size: 12px;
  color: ${colors.gray500};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MissingEmptyText = styled.p`
  margin: 0;
  padding: 48px 0;
  font-size: 14px;
  color: ${colors.gray500};
  text-align: center;

  a {
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;

export const MissingMoreButton = styled.button`
  display: block;
  width: 100%;
  height: 48px;
  margin-top: 16px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background-color: ${colors.white};
  color: ${colors.gray800};
  font-size: 14px;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    color: ${colors.gray400};
    cursor: default;
  }
`;

// 신고·제보하기 (하단 탭 위에 떠 있는 버튼, 화면 폭 480px 안쪽 오른쪽에 맞춤)
export const MissingWriteFab = styled.button`
  position: fixed;
  bottom: 76px;
  right: max(20px, calc(50% - 240px + 20px));
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 50px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background-color: ${colors.brand};
  box-shadow: 0 6px 16px rgba(94, 52, 50, 0.25);
  color: ${colors.white};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${colors.white};
  }
`;

export const MissingWritePlus = styled(PlusIcon)`
  && {
    font-size: 20px;
  }
`;
