"use client";

import styled from "styled-components";
import { adminCard, coolGray, AdminSettingCardHeader, AdminSettingField, AdminSettingFieldGrid } from "@/assets/css/admin/AdminBase.styles";

export const RegistrationEditDialog = styled.dialog`
  ${adminCard}
  position: fixed;
  inset: 0;
  width: calc(100% - 32px);
  max-width: 800px;
  max-height: calc(100dvh - 32px);
  margin: auto;
  padding: 0;
  border-radius: 14px;
  color: ${coolGray[800]};
  box-shadow: 0 24px 64px rgba(39, 81, 133, 0.18);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  font: inherit;

  &::backdrop {
    background-color: rgba(24, 52, 86, 0.32);
    backdrop-filter: blur(4px);
  }
`;

export const RegistrationEditHeader = styled(AdminSettingCardHeader)`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 16px;

  p {
    margin: 8px 0 0;
    color: ${coolGray[500]};
    font-size: 0.8125rem;
    line-height: 1.7;
  }

`;

export const RegistrationEditFields = styled(AdminSettingFieldGrid)`
  align-items: start;
`;

export const RegistrationEditField = styled(AdminSettingField)<{$wide?: boolean}>`
  grid-column: ${({$wide}) => ($wide ? "1 / -1" : "auto")};
`;

export const RegistrationEditActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid ${coolGray[200]};
`;
