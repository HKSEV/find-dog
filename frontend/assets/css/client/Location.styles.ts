"use client";

import styled from "styled-components";
import { colors } from "./theme";
import { FlexStart, WebkitBox, Ohidden } from "@/assets/css/common/CommonBase.styles";

export const LocationRow = styled.div`
  ${FlexStart}
  gap: 0.25rem;
  margin-bottom: 0.25rem;
`;

export const LocationText = styled.span`
  font-size: 0.6875rem;
  color: ${colors.gray500};
  line-height: 1.2;
  ${WebkitBox}${Ohidden}
`;
