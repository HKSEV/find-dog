"use client";

import styled from "styled-components";
import { BrandText, SidebarDivider } from "@/assets/css/admin/Sidebar.styles";

export const SidebarContentBrandText = styled(BrandText)`
  margin-left: 12px;
  margin-right: 0;
  min-width: 0;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.5;
  letter-spacing: -0.02em;

  span {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

export const BrandDivider = styled(SidebarDivider)`
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;
