"use client";

import { MoreVertRounded as MoreIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 더보기(⋮) 메뉴: 아래에서 올라오는 버튼 목록 (ShareSheet 틀 재사용)

export const MoreMenuIcon = styled(MoreIcon)`
  && {
    font-size: 22px;
  }
`;

export const ActionSheetList = styled.div`
  overflow: hidden;
  border-radius: 14px;
  background-color: ${colors.bgLight};
`;

export const ActionSheetItem = styled.button<{$danger?: boolean}>`
  display: block;
  width: 100%;
  height: 52px;
  border: 0;
  border-bottom: 1px solid ${colors.border};
  background: none;
  font-size: 16px;
  font-weight: ${fontWeight.medium};
  color: ${({$danger}) => ($danger ? colors.danger : colors.gray900)};
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }
`;
