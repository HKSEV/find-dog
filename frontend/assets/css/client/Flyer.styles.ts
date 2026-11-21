"use client";

import {
  PrintRounded as PrintIcon,
  DownloadRounded as DownloadIcon,
  ChevronRightRounded as ChevronIcon,
  DescriptionOutlined as FlyerIcon,
  ImageOutlined as PhotoIcon,
  RemoveRounded as MinusIcon,
  AddRounded as PlusIcon
} from "@mui/icons-material";
import styled, { createGlobalStyle } from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 실종 전단지 (A4 인쇄·PDF, 이미지 저장)
//    전단지는 A4 비율(794 x 1123px = 96dpi 기준 210 x 297mm)로 그리고 화면에서는 줄여서 보여줌

export const FLYER_WIDTH = 794;
export const FLYER_HEIGHT = 1123;

// 인쇄할 때는 전단지만 A4 한 장에 꽉 차게
export const FlyerPrintStyle = createGlobalStyle`
  @page {
    size: A4;
    margin: 0;
  }

  @media print {
    body * {
      visibility: hidden;
    }

    [data-flyer-scale] {
      transform: none !important;
    }

    [data-flyer],
    [data-flyer] * {
      visibility: visible;
    }

    [data-flyer] {
      position: fixed;
      top: 0;
      left: 0;
      width: 210mm;
      height: 297mm;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

// 아래 여백: 하단 버튼 줄(약 90px)에 크기 조절 줄이 가리지 않을 만큼만 (휴대폰 한 화면에 들어가게)
export const FlyerPage = styled.div`
  padding: 16px 20px 96px;
`;

export const FlyerGuide = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.6;
  color: ${colors.gray500};
`;

// 화면에서 줄여 보이는 틀 (실제 크기는 FLYER_WIDTH, 비율대로 높이를 잡음)
export const FlyerFrame = styled.div<{$height: number}>`
  position: relative;
  width: 100%;
  height: ${({$height}) => $height}px;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
`;

export const FlyerScale = styled.div`
  width: ${FLYER_WIDTH}px;
  transform-origin: top left;
`;

export const FlyerSheet = styled.div<{$found: boolean}>`
  display: flex;
  flex-direction: column;
  width: ${FLYER_WIDTH}px;
  height: ${FLYER_HEIGHT}px;
  box-sizing: border-box;
  background-color: ${colors.white};
  color: ${colors.gray900};
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  word-break: keep-all;

  --flyer-accent: ${({$found}) => ($found ? colors.brand : "#c62828")};
`;

// 머리: 제목만 (부제를 빼서 사진 칸을 크게)
export const FlyerHead = styled.header`
  padding: 28px 44px 24px;
  background-color: var(--flyer-accent);
  color: ${colors.white};
  text-align: center;

  h1 {
    margin: 0;
    font-size: 72px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1.1;
  }
`;

export const FlyerBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
  overflow: hidden; /* 내용이 길어도 아래 연락처 칸을 덮지 않게 */
  padding: 22px 44px 0;
`;

// 사진: 1:1 정사각 칸 (크기는 MissingFlyer가 정해서 width·height로 넣음)
//    기본 400px, 장소·특징이 두 줄로 길어지면 300px까지 줄어 아래 글이 잘리지 않게
//    (CSS aspect-ratio로 높이에서 너비를 구하면 Safari에서 칸 너비가 0이 되는 일이 있어서 직접 정함)
export const FLYER_PHOTO_MAX = 400;
export const FLYER_PHOTO_MIN = 300;

export const FlyerPhotoBox = styled.div`
  position: relative;
  flex: none;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
  background-color: ${colors.bgSubtle};
`;

export const FlyerPhotoEmpty = styled(FlyerPhotoBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 220px;
  font-size: 24px;
  color: ${colors.gray400};
`;

// 칸보다 크게 그린 사진을 위치만 옮겨 보여 줌 (전단지·맞추기 화면 같은 계산)
export const FlyerCropImg = styled.img`
  position: absolute;
  max-width: none;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
`;

// 이름이 있으면 이름을 가장 크게 (찾았을 때 부를 수 있게), 없으면(목격) 품종
export const FlyerName = styled.h2<{$hasName?: boolean}>`
  margin: 0;
  font-size: ${({$hasName}) => ($hasName ? "60px" : "44px")};
  color: ${({$hasName}) => ($hasName ? "var(--flyer-accent)" : colors.gray900)};
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1px;
`;

// 품종·성별·나이·몸무게·털색·때를 이름표 붙은 칸으로 (한 줄로 이어 쓰면 한눈에 안 읽혀서)
export const FlyerTraits = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 0;

  div {
    min-width: 0;
    padding: 8px 14px;
    border-radius: 10px;
    background-color: ${colors.bgSubtle};
  }

  dt {
    font-size: 17px;
    color: ${colors.gray500};
  }

  dd {
    margin: 0;
    overflow: hidden;
    font-size: 26px;
    font-weight: ${fontWeight.semibold};
    line-height: 1.25;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

// 장소·특징 (이름표는 테마색 없이 회색)
export const FlyerFacts = styled.dl`
  display: grid;
  grid-template-columns: 136px 1fr;
  gap: 8px 12px;
  margin: 0;
  font-size: 24px;
  line-height: 1.4;

  dt {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray500};
  }

  dd {
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

export const FlyerFoot = styled.footer`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: auto;
  padding: 16px 44px 20px;
  border-top: 4px solid var(--flyer-accent);
`;

export const FlyerContact = styled.div`
  flex: 1;
  min-width: 0;

  p {
    margin: 0;
    font-size: 24px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray800};
  }

  strong {
    display: block;
    margin-top: 4px;
    font-size: 58px;
    font-weight: 800;
    letter-spacing: -1px;
    color: var(--flyer-accent);
    white-space: nowrap;
  }

  small {
    display: block;
    margin-top: 8px;
    font-size: 16px;
    color: ${colors.gray500};
  }
`;

export const FlyerQr = styled.figure`
  flex: none;
  margin: 0;
  text-align: center;

  img {
    display: block;
    width: 120px;
    height: 120px;
  }

  figcaption {
    margin-top: 6px;
    font-size: 15px;
    color: ${colors.gray500};
  }
`;

// 💡 사진 맞추기: 미리보기 사진 위에 겹치는 층 (전단지 밖에 있어서 인쇄·이미지 저장에는 안 찍힘)
//    사진을 끌어 옮기고, 크기는 전단지 아래 조절 줄로
export const FlyerPhotoOverlay = styled.div`
  position: absolute;
  z-index: 1;
  cursor: grab;
  touch-action: none; /* 사진을 끄는 동안 화면이 같이 스크롤되지 않게 */
  border-radius: 8px;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid ${colors.brand};
    outline-offset: 2px;
  }
`;

// 사진 아래 크기 조절 줄 (전단지 미리보기 바로 아래, 인쇄·저장에는 안 찍힘): 사진 바꾸기 · − · 막대 · +
export const FlyerPhotoTools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: min(100%, 320px);
  margin: 12px auto 0;
  color: ${colors.gray500};

  button {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 8px;
    background: none;
    color: inherit;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.4;
    cursor: default;
  }

  svg {
    font-size: 22px;
  }

  input {
    flex: 1;
    min-width: 0;
    margin: 0 4px;
    accent-color: ${colors.brand};
    cursor: pointer;
  }
`;

export const FlyerPhotoSwapIcon = styled(PhotoIcon)``;
export const FlyerZoomOutIcon = styled(MinusIcon)``;
export const FlyerZoomInIcon = styled(PlusIcon)``;

// 전단지 화면 아래 버튼 (인쇄·PDF / 이미지 저장)
export const FlyerPrintIcon = styled(PrintIcon)`
  && {
    margin-right: 6px;
    font-size: 20px;
  }
`;

export const FlyerDownloadIcon = styled(DownloadIcon)`
  && {
    margin-right: 6px;
    font-size: 20px;
  }
`;

// 내 실종 글 상세의 "전단지 만들기" 안내
export const FlyerEntry = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background-color: ${colors.brandBg};
  color: ${colors.gray800};
  font-size: 14px;
  line-height: 1.5;
  text-decoration: none;

  strong {
    display: block;
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }

  span {
    flex: 1;
    min-width: 0;
  }
`;

export const FlyerEntryIcon = styled(FlyerIcon)`
  && {
    font-size: 28px;
    color: ${colors.brand};
  }
`;

export const FlyerEntryChevron = styled(ChevronIcon)`
  && {
    font-size: 22px;
    color: ${colors.gray400};
  }
`;
