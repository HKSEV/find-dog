'use client';

import styled, { css } from "styled-components";

const loginColors = {
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  textStrong: '#0F172A',
  textBody: '#334155',
  textMuted: '#64748B',
  textDisabled: '#94A3B8',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  accentSubtle: '#EFF6FF',
  accentText: '#1E40AF',
  onAccent: '#FFFFFF'
};

const loginShadows = {
  authCard: '0 24px 64px rgba(59, 130, 246, 0.09), 0 4px 16px rgba(15, 23, 42, 0.025)',
  accent: '0 4px 12px rgba(37, 99, 235, 0.16)'
};

// ERP에서 사용하는 Pretendard 글꼴
// const fontVariants = [
//   {weight: 100, name: "Thin"},
//   {weight: 200, name: "ExtraLight"},
//   {weight: 300, name: "Light"},
//   {weight: 400, name: "Regular"},
//   {weight: 500, name: "Medium"},
//   {weight: 600, name: "SemiBold"},
//   {weight: 700, name: "Bold"},
//   {weight: 800, name: "ExtraBold"},
//   {weight: 900, name: "Black"}
// ] as const;

// export const AdminLoginFonts = createGlobalStyle`
//   ${fontVariants.map(({weight, name}) => css`
//     @font-face {
//       font-family: "AdminLoginPretendard";
//       src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/pretendard@1.0/Pretendard-${name}.woff2") format("woff2");
//       font-style: normal;
//       font-weight: ${weight};
//       font-display: swap;
//     }
//   `)}
// `;

// 공통 배치
const FlexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FlexColumn = css`
  display: flex;
  flex-direction: column;
`;

// 공통 버튼
const ButtonBase = css`
  ${FlexCenter}
  width: 100%;
  min-height: 3rem;
  padding: 0.75rem 1rem;
  gap: 0.625rem;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 650;
  line-height: 1.4;
  cursor: pointer;

  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus-visible {
    outline: 2px solid ${loginColors.accent};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

// 전체 배경
export const MemberContainer = styled.div`
  ${FlexCenter}
  width: 100%;
  min-height: 100dvh;
  padding: 3rem 1.25rem;
  background:
    radial-gradient(
      ellipse at 50% 35%,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0) 65%
    ),
    linear-gradient(
      135deg,
      #DEEFFF 0%,
      #C4E1FB 50%,
      #A8CBEE 100%
    );
  color: ${loginColors.textStrong};
  font-family: "AdminLoginPretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;

  &,
  & * {
    box-sizing: border-box;
  }

  button,
  input {
    font: inherit;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

// 로그인 카드
export const MemberCard = styled.section`
  width: 100%;
  max-width: 800px;
  padding: 2.25rem 2rem 1.75rem;
  background-color: ${loginColors.surface};
  border: 1px solid ${loginColors.border};
  border-radius: 1.5rem;
  box-shadow: ${loginShadows.authCard};

  @media (max-width: 480px) {
    padding: 2rem 1.5rem 1.5rem;
    border-radius: 1.25rem;
  }
`;

// 상단 안내
export const MemberHeader = styled.header`
  margin: 0 0 2rem;
  text-align: center;
`;

export const MemberIcon = styled.div`
  ${FlexCenter}
  width: 3.25rem;
  height: 3.25rem;
  margin: 0 auto 1.25rem;
  color: ${loginColors.onAccent};
  background: linear-gradient(135deg, #3498FF, #2463EB);
  border-radius: 0.9375rem;
  box-shadow: ${loginShadows.accent};

  svg {
    width: 1.625rem;
    height: 1.625rem;
  }
`;

export const MemberTitle = styled.h1`
  margin: 0;
  font-size: 1.6875rem;
  font-weight: 750;
  line-height: 1.4;
  letter-spacing: -0.8px;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const MemberDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${loginColors.textMuted};
  font-size: 0.875rem;
  line-height: 1.6;
  letter-spacing: -0.3px;
`;

// 입력 폼
export const MemberForm = styled.form`
  ${FlexColumn}
  gap: 1.25rem;
`;

export const MemberField = styled.div`
  ${FlexColumn}
  gap: 0.5rem;
`;

export const MemberInputLabel = styled.label`
  margin: 0;
  color: ${loginColors.textBody};
  font-size: 0.875rem;
  font-weight: 650;
`;

export const MemberInputWrapper = styled.div<{$disabled?: boolean}>`
  ${FlexCenter}
  min-height: 3rem;
  padding: 0 0.875rem;
  gap: 0.75rem;
  background-color: ${({$disabled}) => ($disabled ? loginColors.surfaceSubtle : loginColors.surface)};
  border: 0.0625rem solid ${loginColors.borderStrong};
  border-radius: 0.625rem;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  > svg {
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    color: ${loginColors.textMuted};
  }

  ${({$disabled}) =>
    !$disabled &&
    css`
    &:hover {
      border-color: ${loginColors.textDisabled};
    }

    &:focus-within {
      border-color: ${loginColors.accent};
      box-shadow: 0 0 0 3px ${loginColors.accentSubtle};
    }
  `}
`;

export const MemberInput = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 2.875rem;
  padding: 0.75rem 0;
  color: ${loginColors.textStrong};
  background-color: transparent;
  border: 0;
  outline: none;
  font-size: 0.875rem;
  line-height: 1.5;

  &::placeholder {
    color: ${loginColors.textDisabled};
  }
`;

// 비밀번호 표시 전환
export const MemberPasswordToggle = styled.button`
  ${FlexCenter}
  width: 2rem;
  height: 2rem;
  padding: 0;
  flex-shrink: 0;
  color: ${loginColors.textMuted};
  background: transparent;
  border: 0;
  border-radius: 0.375rem;
  cursor: pointer;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:hover {
    color: ${loginColors.accent};
    background: ${loginColors.accentSubtle};
  }

  &:focus-visible {
    outline: 2px solid ${loginColors.accent};
    outline-offset: 2px;
  }
`;

// 로그인 버튼
export const MemberButton = styled.button`
  ${ButtonBase}
  color: ${loginColors.onAccent};
  background-color: ${loginColors.accent};
  border: 1px solid ${loginColors.accent};

  &:not(:disabled):hover {
    background-color: ${loginColors.accentHover};
    border-color: ${loginColors.accentHover};
    box-shadow: ${loginShadows.accent};
  }

  &:not(:disabled):active {
    background-color: ${loginColors.accentText};
  }
`;
