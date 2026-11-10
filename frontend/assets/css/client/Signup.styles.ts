"use client";

import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { colors } from "./theme";
import { BaseBtn } from "@/assets/css/common/Button.styles";
import { PhotoUploadBottomText } from "@/assets/css/common/Title.styles";
import { AlignItemsCenter } from "@/assets/css/layout/LayoutBase.styles";
import { FormControl } from "@/assets/css/common/Input.styles";

export const AuxiliaryButton = styled(BaseBtn).attrs({$variant: "primary", $mainColor: colors.gray200, $width: "80px"})``;

export const ProfilePreview = styled(Image)`
  && {
    width: auto;
    height: auto;
  }
`;

export const PhotoHint = styled(PhotoUploadBottomText)`
  margin-top: 1rem !important;
`;

export const HiddenFileInput = styled.input`
  && {
    display: none;
  }
`;

export const SignupSectionHeading = styled(AlignItemsCenter)`
  margin-top: 3rem !important;
  margin-bottom: 1.5rem !important;
`;

export const PhoneFieldRow = styled(AlignItemsCenter)`
  && {
    gap: 8px;
  }
`;

// 💡 커스텀 알럿 임포트

// ==========================================
// 💡 1. 애니메이션 Keyframes 및 래퍼 정의
// ==========================================
export const signupSlideDown = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const signupFadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SignupAnimItem = styled.div<{$delay: number; $isSlideDown?: boolean}>`
  opacity: 0;
  animation: ${(props) => (props.$isSlideDown ? signupSlideDown : signupFadeUp)} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: ${(props) => props.$delay}s;
  width: 100%;
`;

export const SignupField = styled(SignupAnimItem)`
  margin-bottom: 1.5rem !important;
`;

export const FinalSignupField = styled(SignupAnimItem)`
  margin-bottom: 3rem !important;
`;

// ==========================================
// 💡 2. 플로팅 라벨(애니메이션 인풋) 스타일 정의
// ==========================================
export const SignupInputWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
`;

export const SignupFloatingLabel = styled.label<{$isActive: boolean}>`
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

export const SignupFloatingInput = styled(FormControl)`
  width: 100%;
  padding: 14px 15px;
  background-color: transparent;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
    border: 1px solid ${colors.brand} !important;
  }
`;
