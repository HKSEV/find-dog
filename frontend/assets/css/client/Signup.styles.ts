"use client";

import {
  CheckRounded as CheckIcon,
  PersonOutlineRounded as PersonIcon,
  PhotoCameraRounded as CameraIcon,
  CloseRounded as CloseIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight, fluid } from "./theme";

// 💡 회원가입 (시작 / 약관 동의 / 정보 입력). 개편 시안 2차 기준
//    입력 칸·선택 버튼·아래 고정 버튼은 MissingWrite.styles의 Write* 를 같이 씀

export const SignupBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 20px 64px; /* 아래 고정 버튼(약 111px)에 안 가리게. Container가 이미 70px를 둬서 합쳐 134px */
`;

// 진행 단계 (1 / 2 약관 동의)
export const SignupStep = styled.div`
  margin-bottom: -8px; /* 진행 막대와 붙여 보이게 */
  font-size: 12px;
  color: ${colors.gray500};

  b {
    font-weight: ${fontWeight.semibold};
    color: ${colors.brand};
  }
`;

export const SignupProgress = styled.div<{$percent: number}>`
  flex: none;
  height: 4px;
  margin-bottom: 4px;
  border-radius: 999px;
  background-color: ${colors.border};

  &::after {
    content: "";
    display: block;
    width: ${({$percent}) => $percent}%;
    height: 4px;
    border-radius: 999px;
    background-color: ${colors.brand};
    transition: width 0.3s;
  }
`;

export const SignupTitle = styled.h2`
  margin: 8px 0 4px;
  font-size: ${fluid(18, 20)};
  font-weight: ${fontWeight.bold};
  line-height: 1.4;
  letter-spacing: -0.4px;
  color: ${colors.gray900};
`;

// ==========================================
// 시작
// ==========================================

export const SignupIntro = styled.section`
  padding: 40px 20px 200px; /* 아래 고정 버튼 묶음 높이만큼 */

  h2 {
    margin-top: 20px;
  }
`;

export const SignupIntroList = styled.ul`
  display: grid;
  gap: 16px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    color: ${colors.gray800};
  }

  svg {
    font-size: 20px;
    color: ${colors.brand};
  }
`;

// 아래 고정 버튼 묶음 (시작 화면: 카카오 / 이메일 / 로그인 링크)
export const SignupBottom = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 100;
  display: grid;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 12px 20px 24px;
  background-color: ${colors.white};
  transform: translateX(-50%);
`;

export const SignupButton = styled.button<{$variant?: "kakao" | "primary"}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 52px;
  border: 0;
  border-radius: 12px;
  background-color: ${({$variant}) => ($variant === "kakao" ? colors.kakao : colors.brand)};
  color: ${({$variant}) => ($variant === "kakao" ? "rgba(0, 0, 0, 0.85)" : colors.white)};
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  cursor: pointer;

  &:disabled {
    background-color: ${colors.gray200};
    cursor: default;
  }
`;

export const SignupLoginLink = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${colors.gray400};
  text-align: center;

  a {
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;

// ==========================================
// 약관 동의
// ==========================================

export const SignupAgreeAll = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 54px;
  padding: 0 14px;
  border-radius: 12px;
  background-color: ${colors.brandBg};
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
  cursor: pointer;
`;

export const SignupAgreeList = styled.ul`
  margin: -8px 0 0;
  padding: 0 14px; /* "모두 동의해요" 칸의 안쪽 여백(14px)과 같게 해서 체크 상자가 한 줄로 서게 */
  list-style: none;
`;

export const SignupAgreeItem = styled.li`
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }
`;

export const SignupAgreeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 50px;

  label {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 12px;
    font-size: 15px;
    color: ${colors.gray900};
    cursor: pointer;
  }
`;

// 네모 체크 (진짜 checkbox는 숨기고 모양만 그림. 키보드 포커스는 그대로 받음)
export const SignupCheck = styled.span`
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
  }

  i {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
    border: 1.5px solid ${colors.gray200};
    border-radius: 6px;
    background-color: ${colors.white};
    color: transparent;
  }

  input:checked + i {
    border-color: ${colors.brand};
    background-color: ${colors.brand};
    color: ${colors.white};
  }

  input:focus-visible + i {
    outline: 2px solid ${colors.brand};
    outline-offset: 2px;
  }
`;

export const SignupCheckIcon = styled(CheckIcon)`
  && {
    font-size: 16px;
  }
`;

export const SignupViewButton = styled.button`
  flex: none;
  padding: 8px 0 8px 8px;
  border: 0;
  background: transparent;
  color: ${colors.gray500};
  font-size: 13px;
  cursor: pointer;
`;

export const SignupTermsText = styled.p`
  margin: 0 0 12px 32px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${colors.bgLight};
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.gray500};
  white-space: pre-line;
`;

// ==========================================
// 정보 입력
// ==========================================

// 계정 칸(이메일·비밀번호)과 연락처 칸(이름·휴대폰·주소) 사이: 제목 대신 간격 + 왜 묻는지 안내
export const SignupGroupHint = styled.p`
  margin: 12px 0 -6px;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray400};
`;

// 칸 + 버튼(중복 확인·주소 검색)을 같은 높이로 한 줄에
export const SignupInputRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const SignupSideButton = styled.button<{$done?: boolean}>`
  flex: none;
  height: 46px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background-color: ${({$done}) => ($done ? colors.brandBg : colors.bgSubtle)};
  color: ${({$done}) => ($done ? colors.brand : colors.gray800)};
  font-size: 13px;
  font-weight: ${fontWeight.medium};
  cursor: pointer;
`;

export const SignupHint = styled.p<{$ok?: boolean}>`
  margin: 0;
  font-size: 12px;
  color: ${({$ok}) => ($ok ? colors.success : colors.gray400)};
`;

// 프로필 사진 (3/3 프로필 화면 가운데 원 + 카메라 표시)
export const SignupAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${colors.gray400};
`;

export const SignupAvatarButton = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray400};
  cursor: pointer;

  img {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 999px;
  }

  input {
    display: none;
  }
`;

export const SignupAvatarIcon = styled(PersonIcon)`
  && {
    font-size: 44px;
  }
`;

export const SignupAvatarBadge = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 2px solid ${colors.white};
  border-radius: 999px;
  background-color: ${colors.brand};
  color: ${colors.white};
`;

export const SignupCameraIcon = styled(CameraIcon)`
  && {
    font-size: 16px;
  }
`;

export const SignupAvatarRemove = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.gray500};
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

// 주소 검색 창
export const SignupPostcode = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const SignupPostcodeSheet = styled.div`
  width: 100%;
  max-width: 480px;
  height: 80vh;
  border-radius: 16px 16px 0 0;
  background-color: ${colors.white};
  overflow: hidden;

  /* 다음 주소 검색 창이 시트 높이를 꽉 채우게 (기본 높이 400px을 덮어씀) */
  & > div:last-child {
    height: calc(100% - 52px) !important;
  }
`;

export const SignupPostcodeHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 8px 0 20px;
  font-size: 16px;
  font-weight: ${fontWeight.semibold};
  border-bottom: 1px solid ${colors.border};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: ${colors.gray900};
    cursor: pointer;
  }
`;

export const SignupCloseIcon = styled(CloseIcon)`
  && {
    font-size: 24px;
  }
`;
