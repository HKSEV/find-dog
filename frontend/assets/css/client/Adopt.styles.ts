"use client";

import {
  ArrowBackIosNewRounded as BackIcon,
  FavoriteBorderRounded as HeartIcon,
  FavoriteRounded as HeartFilledIcon,
  SearchRounded as SearchIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors } from "./theme";

// 💡 입양·봉사 탭 > 입양 목록, 동물 상세 (디자인 개편 시안 기준)

// 입양 / 봉사·후원 / 보호소
export const AdoptSubTabs = styled.nav`
  display: flex;
  gap: 20px;
  margin: 0 20px 12px;
  border-bottom: 1px solid ${colors.border};
`;

export const AdoptSubTab = styled.button<{$active?: boolean}>`
  display: flex;
  align-items: center;
  height: 42px;
  margin-bottom: -1px;
  padding: 0;
  border: 0;
  border-bottom: 2px solid ${({$active}) => ($active ? colors.brand : "transparent")};
  background: transparent;
  color: ${({$active}) => ($active ? colors.gray900 : colors.gray500)};
  font-size: 15px;
  font-weight: ${({$active}) => ($active ? 800 : 500)};
  cursor: pointer;
`;

export const AdoptSearch = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  margin: 0 20px;
  padding: 0 16px;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray500};
`;

export const AdoptSearchIcon = styled(SearchIcon)`
  && {
    font-size: 20px;
  }
`;

export const AdoptSearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 14px;
  color: ${colors.gray900};
`;

// 보호 중 N마리 · 최신순
export const AdoptListHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-top: 8px;
  padding: 0 20px;
  font-size: 13px;
  color: ${colors.gray500};

  strong {
    color: ${colors.gray900};
  }
`;

export const AdoptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 10px;
  padding: 4px 20px 24px;
`;

export const AdoptCard = styled.div`
  position: relative;
  min-width: 0;
`;

export const AdoptCardLink = styled.a`
  display: block;
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900}; /* 전역 a:hover 파란색 대신 */
  }
`;

export const AdoptPhotoWrap = styled.span`
  position: relative;
  display: block;
`;

export const AdoptPhoto = styled.img`
  display: block;
  width: 100%;
  height: 222px;
  object-fit: cover;
  border-radius: 12px;
`;

export const AdoptPhotoEmpty = styled.span<{$height?: string; $square?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: ${({$height}) => $height ?? "222px"};
  border-radius: ${({$square}) => ($square ? 0 : "12px")};
  background-color: ${colors.bgSubtle};
  color: ${colors.gray500};
  font-size: 12px;
`;

// 입양 완료된 친구 표시 (사진 왼쪽 위)
export const AdoptDoneBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px 8px;
  border-radius: 6px;
  background-color: rgba(31, 27, 26, 0.72);
  color: ${colors.white};
  font-size: 11px;
  font-weight: 700;
`;

export const AdoptCardTitle = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const AdoptCardMeta = styled.span<{$muted?: boolean}>`
  display: block;
  overflow: hidden;
  margin-top: 2px;
  font-size: 12px;
  color: ${({$muted}) => ($muted ? colors.gray400 : colors.gray500)};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 관심 버튼 (목록: 사진 오른쪽 아래 동그라미)
export const AdoptHeartButton = styled.button<{$liked?: boolean}>`
  position: absolute;
  top: 174px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 2px 8px rgba(31, 27, 26, 0.15);
  color: ${({$liked}) => ($liked ? colors.danger : colors.gray800)};
  cursor: pointer;
`;

export const AdoptHeartIcon = styled(HeartIcon)`
  && {
    font-size: 20px;
  }
`;

export const AdoptHeartFilledIcon = styled(HeartFilledIcon)`
  && {
    font-size: 20px;
  }
`;

export const AdoptEmpty = styled.p`
  margin: 0;
  padding: 48px 20px;
  font-size: 14px;
  color: ${colors.gray500};
  text-align: center;
`;

// ==========================================
// 동물 상세
// ==========================================

export const DetailPage = styled.div`
  padding-bottom: 96px; /* 아래 고정 버튼 높이만큼 */
`;

export const DetailHero = styled.div`
  position: relative;
  height: 400px;
`;

export const DetailHeroImage = styled.img`
  display: block;
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

export const DetailBackButton = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  color: ${colors.gray900};
  cursor: pointer;
`;

export const DetailBackIcon = styled(BackIcon)`
  && {
    font-size: 18px;
  }
`;

export const DetailSection = styled.section`
  padding: 24px 20px 0;

  &:first-of-type {
    padding-top: 20px;
  }
`;

export const DetailKicker = styled.span<{$done?: boolean}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${({$done}) => ($done ? colors.bgSubtle : colors.brandBg)};
  color: ${({$done}) => ($done ? colors.gray800 : colors.brand)};
  font-size: 12px;
  font-weight: 700;
`;

export const DetailTitle = styled.h1`
  margin: 10px 0 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.6px;
  color: ${colors.gray900};

  span {
    margin-left: 4px;
    font-size: 16px;
    font-weight: 500;
    color: ${colors.gray500};
  }
`;

export const DetailNotice = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: ${colors.gray500};
`;

// 품종·성별·상태 / 공고일·구조 장소 (칸 사이 1px 선)
export const DetailFacts = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 18px 0 0;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background-color: ${colors.border};
`;

export const DetailFact = styled.div<{$span?: number}>`
  grid-column: ${({$span}) => ($span ? `span ${$span}` : "auto")};
  min-width: 0;
  padding: 12px;
  background-color: ${colors.white};

  dt {
    font-size: 12px;
    color: ${colors.gray500};
  }

  dd {
    margin: 2px 0 0;
    overflow-wrap: anywhere;
    font-size: 15px;
    font-weight: 700;
    color: ${colors.gray900};
  }
`;

export const DetailHeading = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: ${colors.gray900};
`;

export const DetailText = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.gray800};
  white-space: pre-line;
`;

export const DetailSteps = styled.ol`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  text-align: center;
`;

export const DetailStep = styled.li<{$first?: boolean}>`
  font-size: 12px;
  color: ${colors.gray800};

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin: 0 auto 6px;
    border-radius: 999px;
    background-color: ${({$first}) => ($first ? colors.brand : colors.bgSubtle)};
    color: ${({$first}) => ($first ? colors.white : colors.gray800)};
    font-weight: 700;
  }
`;

// 아래 고정: 관심 + 입양 신청하기
export const DetailActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 12px 20px 20px;
  border-top: 1px solid ${colors.border};
  background-color: ${colors.white};
  transform: translateX(-50%);
`;

export const DetailHeartButton = styled.button<{$liked?: boolean}>`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background-color: ${colors.white};
  color: ${({$liked}) => ($liked ? colors.danger : colors.gray800)};
  cursor: pointer;
`;

export const DetailApplyButton = styled.button`
  flex: 1;
  height: 52px;
  border: 0;
  border-radius: 12px;
  background-color: ${colors.brand};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;
