"use client";

import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 이용약관 · 개인정보처리방침 문서 화면, 데모 안내 띠, 마이 아래 저작권 표기

export const PolicyPage = styled.article`
  padding: 8px 20px 40px;
`;

export const PolicyLead = styled.p`
  margin: 12px 0 8px;
  padding: 12px 14px;
  border-radius: 10px;
  background-color: ${colors.bgLight};
  font-size: 13px;
  line-height: 1.6;
  color: ${colors.gray500};
`;

export const PolicySection = styled.section`
  padding: 16px 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }
`;

export const PolicyHeading = styled.h2`
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
`;

export const PolicyBody = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.gray800};
  white-space: pre-line;
  word-break: keep-all;
`;

// 홈·글쓰기 위에 보이는 "데모 사이트" 안내
export const DemoNotice = styled.p`
  margin: 0;
  padding: 10px 20px;
  background-color: ${colors.warningBg};
  font-size: 12px;
  line-height: 1.5;
  color: ${colors.warning};
  word-break: keep-all;

  a {
    color: inherit;
    font-weight: ${fontWeight.semibold};
  }
`;

// 마이 맨 아래 저작권·출처
export const MyCopyright = styled.footer`
  padding: 8px 20px 32px;
  font-size: 12px;
  line-height: 1.6;
  color: ${colors.gray400};
  white-space: pre-line;
`;
