"use client";

import styled, { keyframes } from "styled-components";
import { adminColors, coolGray } from "@/assets/css/admin/AdminBase.styles";

const adminPageSpin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const AdminPageLoadingPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  min-height: 0;
  padding: 32px 16px;
  background-color: ${coolGray[50]};
  color: ${coolGray[600]};
  text-align: center;
`;

export const AdminPageSpinner = styled.span`
  width: 36px;
  height: 36px;
  border: 3px solid ${coolGray[200]};
  border-top-color: ${adminColors.primary};
  border-radius: 50%;
  animation: ${adminPageSpin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const AdminPageLoadingText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.7;
`;
