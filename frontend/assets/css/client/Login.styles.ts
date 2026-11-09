import styled, { keyframes } from "styled-components";
import * as S from "@/assets/css/Style.styles";

export const SignupPrompt = styled.div`
  && {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
    color: #666;
  }
`;

export const SignupLink = styled.span`
  && {
    font-weight: bold;
    color: #8A4E4B;
    cursor: pointer;
    text-decoration: underline;
  }
`;

// ==========================================
// 💡 1. 애니메이션 Keyframes 정의
// ==========================================
export const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AnimItem = styled.div<{$delay: number; $isSlideDown?: boolean}>`
  opacity: 0;
  animation: ${(props) => (props.$isSlideDown ? slideDown : fadeUp)} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${(props) => props.$delay}s;
  width: 100%;
`;

// ==========================================
// 💡 2. 플로팅 라벨(애니메이션 인풋) 스타일 정의
// ==========================================
export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const FloatingLabel = styled.label<{$isActive: boolean}>`
  position: absolute;
  left: 12px;
  top: ${(props) => (props.$isActive ? "0" : "50%")};
  transform: translateY(-50%);
  background-color: #FFFFFF;
  padding: 0 4px;
  font-size: ${(props) => (props.$isActive ? "12px" : "15px")};
  color: ${(props) => (props.$isActive ? "#8A4E4B" : "#999")};
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  z-index: 2;
`;

export const FloatingInput = styled(S.FormControl)`
  width: 100%;
  padding: 14px 15px;
  background-color: transparent;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid #8A4E4B !important;
  }
`;
