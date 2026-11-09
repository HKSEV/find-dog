"use client";

import styled from "styled-components";
import { FlexColumn, TextCenterMixin as TextCenter } from "@/assets/css/common/CommonBase.styles";

export const DivKey = styled.div`
  border: 1px solid #DDD;
  padding: 10px;
  ${TextCenter};
`;
export const BlogKey = styled.div`
  ${FlexColumn};
  gap: 10px;
`;
