"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 입양·봉사 탭 > 봉사: 날짜 칸 + 제목·시간·장소 + 모집 배지 (선착순)

export const VolunteerIntro = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${colors.gray500};
`;

export const VolunteerPostList = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
`;

export const VolunteerPostRow = styled.div<{$done?: boolean}>`
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;
  opacity: ${({$done}) => ($done ? 0.55 : 1)};
`;

// 달력 한 칸처럼: 월 / 일 / 요일
export const VolunteerDate = styled.span`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 60px;
  border-radius: 12px;
  background-color: ${colors.brandBg};
  color: ${colors.brand};
  line-height: 1.15;

  && small {
    margin: 0;
    font-size: 11px;
    color: ${colors.brand};
  }

  && strong {
    display: block;
    font-size: 20px;
    font-weight: ${fontWeight.bold};
    color: ${colors.brand};
  }
`;

export const VolunteerPostBody = styled.span`
  flex: 1;
  min-width: 0;
`;

export const VolunteerPostTitle = styled.strong`
  display: block;
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  line-height: 1.4;
  word-break: keep-all;
`;

export const VolunteerPostMeta = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 13px;
  color: ${colors.gray500};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const VolunteerPostFoot = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: ${colors.gray500};
`;

const badgeColors = {
  open: {color: colors.brand, background: colors.brandBg},
  soon: {color: colors.warning, background: colors.warningBg},
  done: {color: colors.gray500, background: colors.bgSubtle}
} as const;

export const VolunteerBadge = styled.span<{$tone: keyof typeof badgeColors}>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${({$tone}) => badgeColors[$tone].background};
  color: ${({$tone}) => badgeColors[$tone].color};
  font-size: 12px;
  font-weight: ${fontWeight.semibold};
`;

// 상세 위 사진 (있을 때만)
export const VolunteerHeroImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;
