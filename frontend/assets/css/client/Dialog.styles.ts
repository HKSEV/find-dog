"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 확인 창: 아이콘 없이 제목·설명·버튼 2개 (되돌릴 수 없는 일을 한 번 더 물을 때)

export const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const DialogBox = styled.div`
  width: 100%;
  max-width: 340px;
  padding: 22px 20px 16px;
  border-radius: 16px;
  background-color: ${colors.white};
`;

export const DialogTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: ${fontWeight.bold};
  color: ${colors.gray900};
`;

export const DialogText = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.gray500};
`;

export const DialogButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
`;

export const DialogButton = styled.button<{$variant?: "primary" | "danger"}>`
  height: 48px;
  border: 0;
  border-radius: 12px;
  background-color: ${({$variant}) =>
    $variant === "danger" ? colors.danger : $variant === "primary" ? colors.brand : colors.bgSubtle};
  color: ${({$variant}) => ($variant ? colors.white : colors.gray800)};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
