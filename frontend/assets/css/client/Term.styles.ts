"use client";

import styled from "styled-components";
import { colors } from "./theme";

export const Terms = styled.div<{$expanded: boolean}>`
  max-height: ${({$expanded}) => ($expanded ? "150px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: ${colors.bgLight};
  border-radius: 4px;
`;
export const Privacy = styled.div<{$expanded: boolean}>`
  max-height: ${({$expanded}) => ($expanded ? "150px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: ${colors.bgLight};
  border-radius: 4px;
`;

export const TermsInner = styled.div`
  margin: 10px 0px;
  padding: 10px;
  font-size: 12px;
  color: ${colors.gray500};
`;

export const UpAndDown = styled.span`
  cursor: pointer;
  font-size: 12px;
  color: ${colors.gray400};
`;
