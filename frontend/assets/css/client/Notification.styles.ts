"use client";

import styled from "styled-components";
import { Pets as PawIcon } from "@mui/icons-material";
import { colors, fontWeight } from "./theme";

// 💡 알림 화면: 왼쪽 동물 사진, 오른쪽에 상태 라벨 · 시간 · 내용. 이번에 새로 온 알림은 연한 배경

export const NoticeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const NoticeRow = styled.div<{$unread?: boolean}>`
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.border};
  background-color: ${({$unread}) => ($unread ? colors.brandBgSoft : colors.white)};
  color: inherit;
  text-decoration: none;
`;

export const NoticeThumb = styled.img`
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  background-color: ${colors.bgMuted};
`;

export const NoticeThumbEmpty = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray200};
`;

export const NoticePawIcon = styled(PawIcon)`
  && {
    font-size: 24px;
  }
`;

export const NoticeBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NoticeHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const badgeColors = {
  brand: {color: colors.brand, background: colors.brandBg},
  success: {color: colors.successText, background: colors.successBg},
  muted: {color: colors.gray500, background: colors.bgSubtle}
} as const;

export const NoticeBadge = styled.span<{$tone: keyof typeof badgeColors}>`
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${({$tone}) => badgeColors[$tone].background};
  color: ${({$tone}) => badgeColors[$tone].color};
  font-size: 12px;
  font-weight: ${fontWeight.semibold};
  white-space: nowrap;
`;

export const NoticeTime = styled.span`
  flex: none;
  font-size: 12px;
  color: ${colors.gray400};
`;

export const NoticeMessage = styled.p`
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.gray900};
  word-break: keep-all;
  overflow-wrap: anywhere;
`;
