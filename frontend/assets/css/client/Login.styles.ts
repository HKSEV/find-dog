"use client";

import styled, { keyframes } from "styled-components";
import { colors } from "./theme";
import { FormControl } from "@/assets/css/common/Input.styles";

export const SignupPrompt = styled.div`
  && {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: ${colors.gray500};
  }
`;

export const SignupLink = styled.span`
  && {
    font-weight: bold;
    color: ${colors.brand};
    cursor: pointer;
    text-decoration: underline;
  }
`;

// ==========================================
// 💡 1. 애니메이션 Keyframes 정의
// ==========================================
export const loginSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const loginFadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const LoginAnimItem = styled.div<{$delay: number; $isSlideDown?: boolean}>`
  opacity: 0;
  animation: ${(props) => (props.$isSlideDown ? loginSlideDown : loginFadeUp)} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${(props) => props.$delay}s;
  width: 100%;
`;

// ==========================================
// 💡 2. 플로팅 라벨(애니메이션 인풋) 스타일 정의
// ==========================================
export const LoginInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const LoginFloatingLabel = styled.label<{$isActive: boolean}>`
  position: absolute;
  left: 12px;
  top: ${(props) => (props.$isActive ? "0" : "50%")};
  transform: translateY(-50%);
  background-color: ${colors.white};
  padding: 0 4px;
  font-size: ${(props) => (props.$isActive ? "12px" : "15px")};
  color: ${(props) => (props.$isActive ? colors.brand : colors.gray400)};
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  z-index: 2;
`;

export const LoginFloatingInput = styled(FormControl)<{$invalid?: boolean}>`
  width: 100%;
  padding: 14px 15px;
  background-color: transparent;
  ${({$invalid}) => ($invalid ? `border-color: ${colors.danger} !important;` : "")}

  &::placeholder {
    color: transparent;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid ${colors.brand} !important;
  }
`;

// 입력 칸 아래 오류 한 줄 (모달 대신)
export const LoginError = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${colors.danger};
`;
