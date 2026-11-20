"use client";

import { MapOutlined as MapIcon, ChevronRightRounded as ChevronIcon, FormatListBulletedRounded as ListIcon, ArrowBackIosNewRounded as BackIcon, SearchRounded as SearchIcon, CloseRounded as CloseIcon } from "@mui/icons-material";
import styled, { createGlobalStyle } from "styled-components";
import { colors, fontWeight } from "./theme";
import { MissingWriteFab } from "./MissingBoard.styles";

// 💡 지도로 보기: 실종·목격 글, 보호 동물, 봉사 모집을 사진 마커로 표시

// 마커 종류별 테두리 색
export const MAP_PIN_COLORS = {
  lost: "#c62828",     // 실종
  found: colors.brand, // 목격
  animal: "#2e7d32",   // 보호 동물
  volunteer: "#b45309" // 봉사
} as const;

// 카카오 지도 위 사진 마커 (지도 SDK가 직접 그리는 DOM이라 전역 스타일로)
export const MapPinStyle = createGlobalStyle`
  .fd-pin {
    position: relative;
    display: block;
    width: 52px;
    height: 52px;
    padding: 0;
    border: 3px solid var(--pin-color);
    border-radius: 999px;
    background-color: ${colors.white};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transform: translateY(-8px);
  }

  /* 아래 꼬리 */
  .fd-pin::after {
    content: "";
    position: absolute;
    bottom: -9px;
    left: 50%;
    border: 6px solid transparent;
    border-top: 7px solid var(--pin-color);
    border-bottom: 0;
    transform: translateX(-50%);
  }

  .fd-pin img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    object-fit: cover;
  }

  .fd-pin-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border-radius: 999px;
    background-color: ${colors.bgSubtle};
    font-size: 10px;
    color: ${colors.gray500};
  }

  .fd-pin-tag {
    position: absolute;
    top: -8px;
    left: 50%;
    padding: 1px 6px;
    border-radius: 999px;
    background-color: var(--pin-color);
    font-size: 10px;
    font-weight: ${fontWeight.semibold};
    line-height: 1.5;
    color: ${colors.white};
    white-space: nowrap;
    transform: translateX(-50%);
  }

  /* 내 동네 (파란 점 + 이름) */
  .fd-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    pointer-events: none;
  }

  .fd-area-dot {
    width: 14px;
    height: 14px;
    border: 3px solid ${colors.white};
    border-radius: 999px;
    background-color: #1a73e8;
    box-shadow: 0 0 0 6px rgba(26, 115, 232, 0.2);
  }

  .fd-area-label {
    padding: 1px 6px;
    border-radius: 999px;
    background-color: rgba(255, 255, 255, 0.95);
    font-size: 11px;
    font-weight: ${fontWeight.semibold};
    color: #1a73e8;
    white-space: nowrap;
  }

  /* 검색한 장소 (브랜드 색) */
  .fd-search .fd-area-dot {
    background-color: ${colors.brand};
    box-shadow: 0 0 0 6px rgba(138, 78, 75, 0.2);
  }

  .fd-search .fd-area-label {
    color: ${colors.brand};
  }

  .fd-pin.is-selected {
    z-index: 2;
    width: 60px;
    height: 60px;
  }
`;

// 헤더 없이 화면 전체가 지도 (위에 뒤로 버튼 + 장소 검색창)
export const MapPage = styled.div`
  position: relative;
  height: 100dvh;
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.bgSubtle};
`;

export const MapFilters = styled.div`
  position: absolute;
  top: calc(66px + env(safe-area-inset-top));
  left: 12px;
  right: 12px;
  z-index: 3;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MapFilterChip = styled.button<{$active: boolean; $color?: string}>`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid ${({$active}) => ($active ? colors.gray900 : colors.border)};
  border-radius: 999px;
  background-color: ${({$active}) => ($active ? colors.gray900 : colors.white)};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  color: ${({$active}) => ($active ? colors.white : colors.gray800)};
  cursor: pointer;

  i {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background-color: ${({$color}) => $color ?? "transparent"};
  }
`;

export const MapStatus = styled.p`
  position: absolute;
  top: calc(112px + env(safe-area-inset-top));
  left: 50%;
  z-index: 3;
  margin: 0;
  padding: 6px 12px;
  border-radius: 999px;
  background-color: rgba(31, 27, 26, 0.75);
  font-size: 12px;
  color: ${colors.white};
  white-space: nowrap;
  transform: translateX(-50%);
`;

// 마커를 누르면 아래에 뜨는 카드
export const MapCard = styled.a`
  position: absolute;
  right: 12px;
  bottom: calc(16px + env(safe-area-inset-bottom));
  left: 12px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 16px;
  background-color: ${colors.white};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  color: ${colors.gray900};
  text-decoration: none;
`;

export const MapCardThumb = styled.img`
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  background-color: ${colors.bgSubtle};
`;

export const MapCardBody = styled.div`
  flex: 1;
  min-width: 0;

  small {
    display: inline-block;
    padding: 1px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.white};
  }

  strong {
    display: block;
    margin-top: 4px;
    overflow: hidden;
    font-size: 15px;
    font-weight: ${fontWeight.semibold};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    margin: 2px 0 0;
    overflow: hidden;
    font-size: 12px;
    color: ${colors.gray500};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const MapCardChevron = styled(ChevronIcon)`
  && {
    flex: none;
    font-size: 24px;
    color: ${colors.gray400};
  }
`;

// 헤더 둥근 버튼 안 아이콘 (크기는 HeaderRoundButton 이 정함)
export const ListEntryIcon = styled(ListIcon)``;
export const MapPillIcon = styled(MapIcon)``;

// 헤더·홈의 "지도로 보기" 아이콘
export const MapEntryIcon = styled(MapIcon)`
  && {
    font-size: 22px;
  }
`;



// 홈 우하단 "지도보기" (글쓰기 버튼과 같은 자리·동작, 흰 바탕으로 구분)
//    $compact: 아래로 스크롤하면 글자를 숨기고 아이콘 동그라미로
export const HomeMapFab = styled(MissingWriteFab)`
  border: 1px solid ${colors.gray200};
  background-color: ${colors.white};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.14);
  color: ${colors.gray900};

  svg {
    font-size: 24px;
  }
`;

// ---- 위: 뒤로 버튼 + 장소 검색 ----
export const MapTopBar = styled.div`
  position: absolute;
  top: calc(12px + env(safe-area-inset-top));
  left: 12px;
  right: 12px;
  z-index: 4;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const floating = `
  border: 0;
  background-color: ${colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.16);
`;

export const MapBackButton = styled.button`
  ${floating}
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 999px;
  color: ${colors.gray900};
  cursor: pointer;

  svg {
    font-size: 20px;
  }
`;

export const MapSearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

export const MapSearchForm = styled.form`
  ${floating}
  display: flex;
  align-items: center;
  gap: 4px;
  height: 44px;
  padding: 0 6px 0 14px;
  border-radius: 999px;

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: 15px;
    color: ${colors.gray900};
  }

  input::placeholder {
    color: ${colors.gray400};
  }

  button {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: none;
    color: ${colors.gray500};
    cursor: pointer;
  }

  svg {
    font-size: 22px;
  }
`;

export const MapSearchIcon = styled(SearchIcon)``;
export const MapSearchClearIcon = styled(CloseIcon)``;
export const MapBackIcon = styled(BackIcon)``;

// 검색 결과 (검색창 바로 아래)
export const MapSearchResults = styled.div`
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  max-height: min(360px, 55dvh);
  overflow-y: auto;
  padding: 4px 14px;
  border-radius: 16px;
  background-color: ${colors.white};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.16);

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li:last-child button {
    border-bottom: 0;
  }

  p {
    margin: 12px 0;
    font-size: 13px;
    color: ${colors.gray500};
    text-align: center;
  }
`;
