"use client";

import { css } from "styled-components";

// 1. 관리자 화면에서 공통으로 사용하는 블루그레이 팔레트
export const coolGray = {
  50: "#F3F8FF", // 앱 배경색
  100: "#EAF2FC", // 호버 배경색, 테이블 헤더
  200: "#D6E4F5", // 구분선, 기본 테두리
  300: "#B7CDE6", // 비활성화 요소, 인풋 테두리
  400: "#7F9CBE", // 플레이스홀더, 보조 아이콘
  500: "#5B7596", // 보조 텍스트
  600: "#425F84", // 기본 텍스트
  700: "#2E4C74", // 강조 텍스트, 네비게이션 텍스트
  800: "#213E65", // 제목
  900: "#183456" // 최상위 강조
};

export const adminColors = {
  primary: "#356FBC",
  primaryHover: "#295E9F",
  primarySoft: "#EAF3FF",
  primaryText: "#2E67AF",
  onPrimary: "#FFFFFF",
  header: "#F8FBFF",
  sidebar: "#245181",
  sidebarActive: "#3A6EA7",
  sidebarText: "#D5E6FA",
  cardShadow: "0 4px 16px rgba(39, 81, 133, 0.06)",
  focusRing: "0 0 0 3px rgba(53, 111, 188, 0.14)"
};

// 2. 어드민 공통 믹스인 정의

// 페이지 최상단 래퍼 스타일 (배경 & 기본 텍스트)
export const adminBaseStyle = css`
  background-color: ${coolGray[50]};
  color: ${coolGray[700]};
  font-family: "Pretendard", sans-serif;
  min-height: 100vh;
`;

// 대시보드 카드/패널 스타일
export const adminCard = css`
  background-color: #FFFFFF;
  border: 1px solid ${coolGray[200]};
  border-radius: 8px;
  box-shadow: ${adminColors.cardShadow};
`;

// 메인 액션 버튼
export const adminPrimaryBtn = css`
  background-color: ${adminColors.primary};
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${adminColors.primaryHover};
  }

  &:disabled {
    background-color: ${coolGray[300]};
    cursor: not-allowed;
  }
`;

// 보조 액션 버튼 (아웃라인)
export const adminOutlineBtn = css`
  background-color: #FFFFFF;
  color: ${coolGray[700]};
  border: 1px solid ${coolGray[300]};
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${coolGray[50]};
    border-color: ${coolGray[400]};
  }
`;

// 입력창(Input, Select 등) 공통 스타일
export const adminInput = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${coolGray[300]};
  border-radius: 6px;
  color: ${coolGray[800]};
  background-color: #FFFFFF;
  font-size: 14px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${coolGray[400]};
  }

  &:focus {
    outline: none;
    border-color: ${adminColors.primary};
    box-shadow: ${adminColors.focusRing};
  }
`;

// 테이블 공통 스타일
export const adminTable = css`
  width: 100%;
  border-collapse: collapse;

  th {
    background-color: ${coolGray[100]};
    color: ${coolGray[600]};
    font-weight: 600;
    text-align: left;
    padding: 12px 16px;
    border-bottom: 1px solid ${coolGray[200]};
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${coolGray[200]};
    color: ${coolGray[700]};
  }

  tbody tr:hover {
    background-color: ${coolGray[50]};
  }
`;
