"use client";

import styled from "styled-components";
import { ExpandMore as ExpandIcon } from "@mui/icons-material";
import { colors, fontWeight } from "./theme";

// 💡 마이 > 자주 묻는 질문: 분류 제목 + 눌러서 펼치는 질문 (details/summary)

export const FaqGroup = styled.section`
  padding: 8px 20px 16px;
`;

export const FaqGroupTitle = styled.h2`
  margin: 16px 0 4px;
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray500};
`;

export const FaqChevron = styled(ExpandIcon)`
  && {
    flex: none;
    font-size: 22px;
    color: ${colors.gray400};
    transition: transform 0.2s;
  }
`;

export const FaqItem = styled.details`
  border-bottom: 1px solid ${colors.border};

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 0;
    font-size: 15px;
    font-weight: ${fontWeight.medium};
    color: ${colors.gray900};
    word-break: keep-all;
    list-style: none;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  &[open] ${FaqChevron} {
    transform: rotate(180deg);
  }

  p {
    margin: -4px 0 16px;
    padding: 14px 16px;
    border-radius: 12px;
    background-color: ${colors.bgLight};
    font-size: 14px;
    line-height: 1.6;
    color: ${colors.gray800};
    word-break: keep-all;
  }
`;
