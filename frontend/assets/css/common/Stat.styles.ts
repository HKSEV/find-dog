"use client";

import styled from "styled-components";
import { BgWhite, FlexBetween } from "@/assets/css/common/CommonBase.styles";

export const StatBox = styled.div`
  ${FlexBetween};
  ${BgWhite};
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
`;
export const StatItem = styled.div`
  font-size: 13px;
`;
