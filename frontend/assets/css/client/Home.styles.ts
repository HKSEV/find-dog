"use client";

import styled from "styled-components";
import { colors } from "./theme";

// 💡 홈 화면 (디자인 개편 시안 기준)

// 잃어버렸어요 / 발견했어요
export const HomeEntryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 20px 0;
`;

export const HomeEntryButton = styled.a<{$primary?: boolean}>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 14px;
  background-color: ${({$primary}) => ($primary ? colors.brand : colors.brandBg)};
  color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  font-size: 16px;
  font-weight: 800;
  text-decoration: none;

  svg {
    font-size: 24px;
  }
`;

// 섹션 공통
export const HomeSection = styled.section`
  padding: 26px 0 0;
`;

export const HomeSectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

export const HomeSectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: ${colors.gray900};
`;

export const HomeMoreLink = styled.a`
  font-size: 13px;
  color: ${colors.gray500};
  text-decoration: none;
`;

export const HomeBand = styled.div`
  height: 8px;
  margin-top: 24px;
  background-color: ${colors.bgSubtle};
`;

export const HomeEmpty = styled.p`
  margin: 0;
  padding: 16px 20px 0;
  font-size: 13px;
  color: ${colors.gray500};
`;

// 사진이 없을 때 자리
export const HomePhotoPlaceholder = styled.span<{$size: string}>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({$size}) => $size};
  height: ${({$size}) => $size};
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray400};
  font-size: 11px;
`;

// 목록형 한 줄 (실종 신고, 함께 도와주세요)
export const HomeList = styled.div`
  padding: 6px 20px 0;
`;

export const HomeListRow = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${colors.border};
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900}; /* 전역 a:hover 파란색 대신 */
  }

  &:last-child {
    border-bottom: 0;
  }
`;

export const HomeListThumb = styled.img`
  flex: none;
  width: 68px;
  height: 68px;
  object-fit: cover;
  border-radius: 8px;
`;

export const HomeListBody = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const HomeListTitle = styled.span`
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const HomeListMeta = styled.span`
  overflow: hidden;
  font-size: 12px;
  color: ${colors.gray500};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const HomeKicker = styled.span<{$tone?: "brand" | "danger"}>`
  font-size: 11px;
  font-weight: 700;
  color: ${({$tone}) => ($tone === "danger" ? colors.danger : colors.brand)};
`;

export const HomeStatusBadge = styled.span<{$done?: boolean}>`
  align-self: flex-start;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({$done}) => ($done ? colors.bgSubtle : colors.danger)};
  color: ${({$done}) => ($done ? colors.gray800 : colors.white)};
  font-size: 11px;
  font-weight: 800;
`;

// 새 가족을 기다려요 (가로 사진 줄)
export const HomeStrip = styled.div`
  display: flex;
  gap: 12px;
  padding: 14px 20px 4px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const HomeAnimalCard = styled.a`
  flex: none;
  width: 156px;
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900};
  }
`;

export const HomeAnimalImage = styled.img`
  display: block;
  width: 156px;
  height: 196px;
  object-fit: cover;
  border-radius: 12px;
`;

export const HomeAnimalPlaceholder = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 156px;
  height: 196px;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray400};
  font-size: 12px;
`;

export const HomeAnimalName = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const HomeAnimalMeta = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 2px;
  font-size: 12px;
  color: ${colors.gray500};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const HomeSeeAllTile = styled.a`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 156px;
  height: 196px;
  border-radius: 12px;
  background-color: ${colors.brandBg};
  color: ${colors.gray900};
  font-size: 15px;
  font-weight: 800;
  line-height: 1.4;
  text-align: center;
  text-decoration: none;
`;

export const HomeSeeAllArrow = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background-color: ${colors.brand};
  color: ${colors.white};

  svg {
    font-size: 18px;
  }
`;

export const HomeThumbWrap = styled.span`
  position: relative;
  flex: none;
  display: block;
`;

export const HomePlayBadge = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: -13px 0 0 -13px;
  border-radius: 999px;
  background-color: rgba(31, 27, 26, 0.6);
  color: ${colors.white};

  svg {
    font-size: 16px;
  }
`;
