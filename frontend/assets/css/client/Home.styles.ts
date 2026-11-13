"use client";

import styled from "styled-components";
import { colors, fontWeight, fluid } from "./theme";

// 💡 홈 화면 (디자인 개편 시안 기준)

// 잃어버렸어요 / 발견했어요
export const HomeEntryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 8px 20px 0;
`;

// 제목(위) + 짧은 꼬리말(아래), 오른쪽 아래로 잘려 나가는 큰 흐린 아이콘 (시안 C4)
export const HomeEntryButton = styled.a<{$primary?: boolean}>`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 14px;
  background-color: ${({$primary}) => ($primary ? colors.brand : colors.brandBg)};
  color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  text-decoration: none;

  &:hover {
    color: ${({$primary}) => ($primary ? colors.white : colors.gray900)}; /* 전역 a:hover 파란색 대신 */
  }

  strong {
    position: relative;
    font-size: 16px;
    font-weight: ${fontWeight.semibold};
    letter-spacing: -0.3px;
  }

  small {
    position: relative;
    font-size: 12px;
    color: ${({$primary}) => ($primary ? "rgba(255, 255, 255, 0.85)" : colors.brand)};
  }

  /* 장식 아이콘 */
  svg {
    position: absolute;
    right: -10px;
    bottom: -12px;
    font-size: 64px;
    color: ${({$primary}) => ($primary ? "rgba(255, 255, 255, 0.18)" : "rgba(138, 78, 75, 0.15)")};
  }
`;

// 섹션 공통
export const HomeSection = styled.section`
  padding: 24px 0 0;
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
  font-size: ${fluid(17, 19)};
  font-weight: ${fontWeight.bold};
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
// 섹션 제목과 첫 줄 사이: 10px + 줄 안쪽 여백 12px
export const HomeList = styled.div`
  padding: 10px 20px 0;
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

// 함께 도와주세요의 봉사 모집: 사진 자리에 날짜 칸 (봉사 탭 목록과 같은 모양, 크기는 사진과 같게)
export const HomeVolunteerDate = styled.span`
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  border-radius: 8px;
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
    font-size: 22px;
    font-weight: ${fontWeight.bold};
    color: ${colors.brand};
  }
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
  font-weight: ${fontWeight.semibold};
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
  font-weight: ${fontWeight.semibold};
  color: ${({$tone}) => ($tone === "danger" ? colors.danger : colors.brand)};
`;

export const HomeStatusBadge = styled.span<{$done?: boolean}>`
  align-self: flex-start;
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${({$done}) => ($done ? colors.bgSubtle : colors.danger)};
  color: ${({$done}) => ($done ? colors.gray800 : colors.white)};
  font-size: 11px;
  font-weight: ${fontWeight.semibold};
`;

// 새 가족을 기다려요 (가로 사진 줄)
export const HomeStrip = styled.div`
  display: flex;
  gap: 12px;
  padding: 22px 20px 4px; /* 섹션 제목과 사진 사이를 목록형 섹션과 같게 */
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
  font-weight: ${fontWeight.semibold};
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
  font-weight: ${fontWeight.semibold};
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
