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

// ==========================================
// 💡 로그인 화면 배치 (입력 칸 → 로그인 버튼 → "또는" → 간편 로그인 → 회원가입)
//    버튼을 화면 아래에 고정하지 않아서, 높이가 낮은 화면에서도 입력 칸과 겹치지 않음
// ==========================================

export const LoginBody = styled.div`
  padding: 28px 20px 32px;
`;

export const LoginTitle = styled.h2`
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.4px;
  color: ${colors.gray900};
`;

export const LoginFields = styled.div`
  display: grid;
  gap: 12px;
`;

export const LoginSubmit = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 20px;
  border: 0;
  border-radius: 12px;
  background-color: ${colors.brand};
  color: ${colors.white};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;

export const LoginDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 16px;
  font-size: 12px;
  color: ${colors.gray400};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: ${colors.border};
  }
`;

export const LoginSocial = styled.div`
  display: grid;
  gap: 8px;
`;

export const LoginSocialButton = styled.button<{$variant: "kakao" | "apple"}>`
  width: 100%;
  height: 48px;
  border: 1px solid ${({$variant}) => ($variant === "kakao" ? "#FEE500" : colors.gray200)};
  border-radius: 12px;
  background-color: ${({$variant}) => ($variant === "kakao" ? "#FEE500" : colors.white)}; /* 카카오 규정 노란색 */
  color: ${({$variant}) => ($variant === "kakao" ? "rgba(0, 0, 0, 0.85)" : colors.gray900)};
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;
