"use client";

import { PrintRounded as PrintIcon, DownloadRounded as DownloadIcon, ChevronRightRounded as ChevronIcon, DescriptionOutlined as FlyerIcon } from "@mui/icons-material";
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

export const FlyerPage = styled.div`
  padding: 16px 20px 120px;
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

export const FlyerHead = styled.header`
  padding: 36px 44px 28px;
  background-color: var(--flyer-accent);
  color: ${colors.white};
  text-align: center;

  h1 {
    margin: 0;
    font-size: 76px;
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1.1;
  }

  p {
    margin: 12px 0 0;
    font-size: 24px;
    font-weight: ${fontWeight.semibold};
    opacity: 0.95;
  }
`;

export const FlyerBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  padding: 28px 44px 0;
`;

export const FlyerPhoto = styled.img`
  display: block;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  object-fit: cover;
  object-position: center 30%; /* 세로 사진은 얼굴이 위쪽에 있어서 가운데보다 조금 위를 보여줌 */
  background-color: ${colors.bgSubtle};
`;

export const FlyerPhotoEmpty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 220px;
  border-radius: 16px;
  background-color: ${colors.bgSubtle};
  font-size: 24px;
  color: ${colors.gray400};
`;

export const FlyerName = styled.h2`
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -1px;

  span {
    margin-left: 12px;
    font-size: 26px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray500};
  }
`;

export const FlyerFacts = styled.dl`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 10px 16px;
  margin: 0;
  font-size: 24px;
  line-height: 1.4;

  dt {
    font-weight: ${fontWeight.semibold};
    color: var(--flyer-accent);
  }

  dd {
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
`;

export const FlyerFoot = styled.footer`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: auto;
  padding: 24px 44px 32px;
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
    width: 150px;
    height: 150px;
  }

  figcaption {
    margin-top: 6px;
    font-size: 15px;
    color: ${colors.gray500};
  }
`;

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
