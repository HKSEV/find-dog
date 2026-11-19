"use client";

import { MapOutlined as MapIcon, ChevronRightRounded as ChevronIcon } from "@mui/icons-material";
import styled, { createGlobalStyle } from "styled-components";
import { colors, fontWeight } from "./theme";

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

  .fd-pin.is-selected {
    z-index: 2;
    width: 60px;
    height: 60px;
  }
`;

export const MapPage = styled.div`
  position: relative;
  height: calc(100dvh - 56px);
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${colors.bgSubtle};
`;

export const MapFilters = styled.div`
  position: absolute;
  top: 12px;
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
  top: 56px;
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

// 헤더·홈의 "지도로 보기" 아이콘
export const MapEntryIcon = styled(MapIcon)`
  && {
    font-size: 22px;
  }
`;

// 홈의 "지도로 보기" 줄
export const HomeMapEntry = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 20px 0;
  padding: 12px 14px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background-color: ${colors.white};
  color: ${colors.gray800};
  font-size: 14px;
  text-decoration: none;

  span {
    flex: 1;
    min-width: 0;
  }

  strong {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }
`;

// 목록 아래 떠 있는 "지도" 버튼 (실종·제보: 왼쪽, 오른쪽엔 글쓰기 버튼 / 입양·봉사: 가운데)
export const MapFloatButton = styled.a<{$align: "left" | "center"}>`
  position: fixed;
  bottom: 76px;
  ${({$align}) => ($align === "left"
    ? "left: max(20px, calc(50% - 240px + 20px));"
    : "left: 50%; transform: translateX(-50%);")}
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 50px;
  padding: 0 18px;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background-color: ${colors.white};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  color: ${colors.gray900};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  text-decoration: none;
`;
