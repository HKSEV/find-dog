"use client";

import styled from "styled-components";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";

export const TopbarContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  padding: 0 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid ${coolGray[200]};
  background-color: ${adminColors.header};

  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;
