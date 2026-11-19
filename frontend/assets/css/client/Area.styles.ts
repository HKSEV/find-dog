"use client";

import { PlaceOutlined as PinIcon, MyLocationRounded as LocateIcon, ExpandMoreRounded as DownIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 내 동네 설정 (아래에서 올라오는 검색 시트 + 동네 칩)

export const AreaChip = styled.button`
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 3px;
  height: 32px;
  padding: 0 10px 0 8px;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background-color: ${colors.white};
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
  cursor: pointer;

  svg {
    font-size: 18px;
  }
`;

export const AreaPinIcon = styled(PinIcon)``;
export const AreaDownIcon = styled(DownIcon)``;
export const AreaLocateIcon = styled(LocateIcon)``;

export const AreaOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000000; /* 하단 탭(999999)보다 위에 */
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const AreaSheet = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 480px;
  max-height: 80dvh;
  box-sizing: border-box;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
  border-radius: 18px 18px 0 0;
  background-color: ${colors.white};
`;

export const AreaHandle = styled.span`
  display: block;
  width: 40px;
  height: 4px;
  margin: 0 auto 14px;
  border-radius: 2px;
  background-color: ${colors.gray200};
`;

export const AreaTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
`;

export const AreaNote = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray500};
`;

export const AreaActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background-color: ${colors.white};
  font-size: 14px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }
`;

export const AreaResults = styled.ul`
  flex: 1;
  min-height: 0;
  margin: 8px 0 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
`;

export const AreaResult = styled.button`
  display: block;
  width: 100%;
  padding: 12px 2px;
  border: 0;
  border-bottom: 1px solid ${colors.border};
  background: transparent;
  text-align: left;
  cursor: pointer;

  strong {
    display: block;
    font-size: 15px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

export const AreaEmpty = styled.p`
  margin: 16px 0;
  font-size: 13px;
  color: ${colors.gray500};
  text-align: center;
`;

// 실종 목록의 "최신순 | 가까운 순"
export const SortToggle = styled.div`
  display: inline-flex;
  gap: 2px;
  font-size: 13px;

  button {
    padding: 4px 6px;
    border: 0;
    background: transparent;
    color: ${colors.gray400};
    cursor: pointer;
  }

  button[aria-pressed="true"] {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }
`;

export const AreaBasis = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 20px 4px;
  font-size: 12px;
  color: ${colors.gray500};
`;
