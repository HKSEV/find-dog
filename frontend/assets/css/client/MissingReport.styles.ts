"use client";

import styled from "styled-components";
import { colors } from "./theme";
import {
  BgWhite,
  BorderNone,
  BoxShadow,
  FlexBetween,
  FlexCenter,
  Fw600,
  Nowrap,
  Pointer
} from "@/assets/css/common/CommonBase.styles";

export const BellIconWrapper = styled.div`
  cursor: pointer;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.border};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterButton = styled.button`
  ${FlexCenter}
  gap:0.25rem;
  background-color: ${colors.bgSubtle};
  ${BorderNone}
  border-radius:1.25rem;
  font-size: 0.8125rem;
  padding: 0.375rem 0.75rem;
  color: ${colors.gray800};
  ${Nowrap}
  ${Pointer}
`;

export const AlertBanner = styled.div`
  ${FlexBetween}
  ${BgWhite}
margin: 0.75rem 1rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  ${BoxShadow}
`;

export const AlertTitle = styled.div`
  font-size: 0.875rem;
  ${Fw600}
  color:${colors.gray800};
`;

export const AlertSub = styled.div`
  font-size: 0.6875rem;
  color: ${colors.gray400};
  margin-top: 0.125rem;
`;
