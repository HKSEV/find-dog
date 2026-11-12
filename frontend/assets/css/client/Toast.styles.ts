"use client";

import styled, { keyframes } from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 토스트: 화면 아래 작은 알약, 아이콘 없이 문장만. 2초 뒤 사라짐

const toastIn = keyframes`
  from { opacity: 0; transform: translate(-50%, 8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`;

export const ToastBox = styled.div`
  position: fixed;
  bottom: 128px; /* 하단 탭(60px)과 아래 고정 버튼 묶음(약 112px) 위 */
  left: 50%;
  z-index: 10001;
  max-width: calc(min(100vw, 480px) - 40px);
  padding: 12px 18px;
  border-radius: 999px;
  background-color: rgba(34, 34, 34, 0.92);
  color: ${colors.white};
  font-size: 14px;
  font-weight: ${fontWeight.medium};
  line-height: 1.4;
  text-align: center;
  transform: translateX(-50%);
  animation: ${toastIn} 0.2s ease-out;
  pointer-events: none;
`;
