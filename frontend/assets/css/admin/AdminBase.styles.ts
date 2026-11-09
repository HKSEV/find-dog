"use client";

import Image from "next/image";
import styled, { css } from "styled-components";

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

// 설정 페이지에서 공통으로 사용하는 레이아웃과 폼 요소
export const AdminSettingPage = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8px 8px 32px;
  color: ${coolGray[800]};

  @media (max-width: 767px) {
    padding: 0 0 24px;
  }
`;

export const AdminSettingHeader = styled.header`
  display: grid;
  gap: 8px;
`;

export const AdminSettingCaption = styled.p`
  margin: 0;
  color: ${coolGray[500]};
  font-size: 0.8125rem;
`;

export const AdminSettingTitle = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-weight: 750;
  letter-spacing: -0.05em;
  line-height: 1.3;

  @media (max-width: 575px) {
    font-size: 1.5rem;
  }
`;

export const AdminSettingDescription = styled.p`
  margin: 0;
  color: ${coolGray[600]};
  font-size: 0.875rem;
  line-height: 1.7;
`;

export const AdminSettingGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  align-items: start;
  gap: 24px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const AdminSettingCard = styled.section`
  ${adminCard}
  min-width: 0;
  border-radius: 12px;
`;

export const AdminSettingCardHeader = styled.header`
  padding: 18px 24px;
  border-bottom: 1px solid ${coolGray[200]};
  border-radius: 12px 12px 0 0;
  background-color: ${adminColors.header};

  @media (max-width: 575px) {
    padding: 16px 18px;
  }
`;

export const AdminSettingCardTitle = styled.h2`
  margin: 0;
  color: ${coolGray[800]};
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.5;
`;

export const AdminSettingCardBody = styled.div`
  padding: 24px;

  @media (max-width: 575px) {
    padding: 18px;
  }
`;

const adminSettingFields = css`
  display: grid;
  gap: 22px;
  min-width: 0;
`;

export const AdminSettingForm = styled.form`
  ${adminSettingFields}
`;

export const AdminSettingFields = styled.div`
  ${adminSettingFields}
`;

export const AdminSettingFieldGrid = styled.div<{$columns?: 2 | 3}>`
  display: grid;
  grid-template-columns: repeat(${({$columns}) => $columns || 2}, minmax(0, 1fr));
  gap: 20px;
  min-width: 0;

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const AdminSettingField = styled.div`
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
`;

export const AdminSettingLabel = styled.label`
  color: ${coolGray[700]};
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1.6;
`;

const adminSettingControl = css`
  ${adminInput}
  display: block;
  min-width: 0;
  min-height: 44px;
  border-color: ${coolGray[200]};
  border-radius: 8px;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.6;

  &:disabled {
    background-color: ${coolGray[50]};
    color: ${coolGray[500]};
    cursor: not-allowed;
  }
`;

export const AdminSettingInput = styled.input`
  ${adminSettingControl}

  &[type="file"] {
    padding: 8px 10px;
  }

  &::file-selector-button {
    padding: 5px 10px;
    margin-right: 10px;
    border: 0;
    border-radius: 5px;
    background-color: ${adminColors.primarySoft};
    color: ${adminColors.primaryText};
    font: inherit;
    cursor: pointer;
  }
`;

export const AdminSettingSelect = styled.select`
  ${adminSettingControl}
  cursor: pointer;
`;

export const AdminSettingTextarea = styled.textarea`
  ${adminSettingControl}
  min-height: 140px;
  resize: vertical;
`;

const adminSettingInset = css`
  min-width: 0;
  padding: 18px;
  margin: 0;
  border: 1px solid ${coolGray[200]};
  border-radius: 10px;
  background-color: ${coolGray[50]};

  @media (max-width: 575px) {
    padding: 14px;
  }
`;

export const AdminSettingInset = styled.div`
  ${adminSettingInset}
`;

export const AdminSettingChoiceField = styled.fieldset`
  ${adminSettingInset}
`;

export const AdminSettingLegend = styled.legend`
  padding: 0 6px;
  color: ${coolGray[700]};
  font-size: 0.875rem;
  font-weight: 650;
`;

export const AdminSettingOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const AdminSettingOption = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 8px;
  background-color: #FFFFFF;
  color: ${coolGray[600]};
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;

  &:hover {
    border-color: ${coolGray[400]};
  }

  &:has(input:checked) {
    border-color: ${adminColors.primary};
    background-color: ${adminColors.primarySoft};
    color: ${adminColors.primaryText};
  }

  &:focus-within {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }

  input[type="radio"] {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: ${adminColors.primary};
    cursor: inherit;
  }

  @media (max-width: 575px) {
    width: 100%;
  }
`;

export const AdminSettingHelp = styled.small`
  color: ${coolGray[500]};
  font-size: 0.8125rem;
  line-height: 1.7;
`;

export const AdminSettingSubmit = styled.button`
  ${adminPrimaryBtn}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 46px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  line-height: 1.6;

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }
`;

export const AdminSettingSecondaryButton = styled.button`
  ${adminOutlineBtn}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  border-color: ${coolGray[200]};
  border-radius: 8px;
  font-size: 0.8125rem;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AdminSettingPreview = styled.div`
  display: grid;
  place-items: center;
  min-width: 0;
  padding: 20px;
  border: 1px dashed ${coolGray[300]};
  border-radius: 10px;
  background-color: ${coolGray[50]};
`;

export const AdminSettingPreviewImage = styled(Image)`
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: 240px;
  border-radius: 8px;
  object-fit: contain;
`;

export const AdminSettingGuide = styled(AdminSettingCard).attrs({as: "aside"})``;

export const AdminSettingGuideBody = styled(AdminSettingCardBody)`
  color: ${coolGray[600]};
  font-size: 0.875rem;
  line-height: 1.8;
  overflow-wrap: anywhere;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 18px;
  }

  strong {
    color: ${coolGray[800]};
    font-weight: 650;
  }

  hr {
    margin: 18px 0;
    border: 0;
    border-top: 1px solid ${coolGray[200]};
  }
`;
