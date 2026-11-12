"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 카카오 지도: 작은 지도(보기만), 전체 화면 위치 고르기

export const MiniMapBox = styled.a`
  position: relative;
  display: block;
  height: 160px;
  overflow: hidden;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  color: inherit;
  text-decoration: none;
`;

export const DetailMapWrap = styled.div`
  margin-top: 10px;
`;

export const MiniMapCanvas = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none; /* 작은 지도는 보기만 (페이지 스크롤과 안 부딪히게) */
`;

export const MiniMapHint = styled.span`
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 2;
  padding: 4px 10px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.94);
  font-size: 12px;
  font-weight: ${fontWeight.medium};
  color: ${colors.gray800};
`;

export const MapMessage = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  font-size: 12px;
  color: ${colors.gray500};
  text-align: center;
`;

// ==========================================
// 전체 화면 위치 고르기
// ==========================================

export const PickerOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 10003;
  width: 100%;
  max-width: 480px;
  background-color: ${colors.bgSubtle};
  transform: translateX(-50%);
`;

export const PickerCanvas = styled.div`
  position: absolute;
  inset: 0;
`;

export const PickerTop = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  left: 12px;
  z-index: 3;
  display: flex;
  gap: 8px;
`;

export const PickerIconButton = styled.button`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background-color: ${colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  color: ${colors.gray900};
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;

export const PickerSearch = styled.form`
  position: relative;
  flex: 1;
  min-width: 0;

  input {
    width: 100%;
    height: 44px;
    box-sizing: border-box;
    padding: 0 12px;
    border: 0;
    border-radius: 12px;
    background-color: ${colors.white};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    font-family: inherit;
    font-size: 14px;
    outline: none;
  }
`;

export const PickerResults = styled.ul`
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  max-height: 260px;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  border-radius: 12px;
  background-color: ${colors.white};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  list-style: none;

  button {
    display: block;
    width: 100%;
    padding: 10px 14px;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }

  strong {
    display: block;
    font-size: 14px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  small {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

// 가운데 고정 핀 (지도를 움직여 맞춤). 핀 끝이 정확히 가운데에 오게 위로 올림
export const PickerPin = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  color: ${colors.brand};
  transform: translate(-50%, -100%);
  pointer-events: none;

  svg {
    display: block;
    font-size: 44px;
  }
`;

export const PickerLocate = styled(PickerIconButton)`
  position: absolute;
  right: 16px;
  bottom: 176px;
  z-index: 3;
  border-radius: 999px;
  color: ${colors.brand};
`;

export const PickerSheet = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
  padding: 18px 20px 20px;
  border-radius: 18px 18px 0 0;
  background-color: ${colors.white};

  strong {
    display: block;
    min-height: 22px;
    font-size: 16px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  small {
    display: block;
    margin: 4px 0 14px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;
