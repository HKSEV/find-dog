"use client";

import styled from "styled-components";
import { FlexCenter, FlexColumn } from "@/assets/css/common/CommonBase.styles";

export const AlertInfo = styled.div`
  ${FlexCenter};
  gap: 12px;

  .icon-circle {
    background-color: #E9ECEF;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    ${FlexCenter};
  }
  .text-group {
    ${FlexColumn};
    strong {
      font-size: 0.95rem;
      color: #111;
    }
    span {
      font-size: 0.8rem;
      color: #888;
      margin-top: 3px;
    }
  }
`;
