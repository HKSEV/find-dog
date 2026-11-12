"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 알림 화면: 한 줄에 종류 · 내용 · 시간. 이번에 새로 온 알림은 연한 배경

export const NoticeList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const NoticeRow = styled.div<{$unread?: boolean}>`
  display: block;
  padding: 16px 20px;
  border-bottom: 1px solid ${colors.border};
  background-color: ${({$unread}) => ($unread ? colors.brandBg : colors.white)};
  color: inherit;
  text-decoration: none;

  &:hover {
    color: inherit; /* 링크로 쓸 때 전역 a:hover 파란색 대신 */
  }
`;

export const NoticeKind = styled.span`
  display: block;
  font-size: 12px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.brand};
`;

export const NoticeMessage = styled.p`
  margin: 4px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: ${colors.gray900};
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const NoticeTime = styled.span`
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: ${colors.gray400};
`;
