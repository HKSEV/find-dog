"use client";

import styled from "styled-components";
import { AdminSettingInput, AdminSettingSecondaryButton } from "@/assets/css/admin/AdminBase.styles";

export const PickInputGroup = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;
  min-width: 0;

  ${AdminSettingInput} {
    flex: 1;
    width: 0;
  }

  @media (max-width: 767px) {
    flex-direction: column;

    ${AdminSettingInput} {
      width: 100%;
    }
  }
`;

export const PickFetchButton = styled(AdminSettingSecondaryButton)`
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 100%;
  }
`;
