"use client";

import styled from "styled-components";
import { coolGray, adminColors, AdminSettingCard, AdminSettingSecondaryButton, AdminSettingSelect } from "@/assets/css/admin/AdminBase.styles";

export const AdminListPanel = styled(AdminSettingCard)`
  padding: 24px;

  @media (max-width: 575px) {
    padding: 18px;
  }
`;

export const AdminListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

export const AdminListCount = styled.p`
  margin: 6px 0 0;
  color: ${coolGray[500]};
  font-size: 0.75rem;
`;

export const AdminListRefresh = styled(AdminSettingSecondaryButton)`
  min-height: 36px;
  padding: 7px 12px;
  color: ${coolGray[600]};

  &:hover:not(:disabled) {
    background-color: ${coolGray[100]};
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const AdminListToolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;
`;

export const AdminListSearch = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 260px;
  max-width: 480px;
  gap: 10px;
  min-height: 44px;
  padding: 8px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 8px;
  background-color: ${coolGray[50]};

  > svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: ${coolGray[400]};
  }

  &:focus-within {
    border-color: ${adminColors.primary};
    box-shadow: ${adminColors.focusRing};
  }
`;

export const AdminListSearchLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

export const AdminListInput = styled.input`
  flex: 1;
  width: 100%;
  min-width: 0;
  outline: none;
  color: ${coolGray[700]};
  font-size: 0.8125rem;

  &::placeholder {
    color: ${coolGray[400]};
  }
`;

export const AdminListFilter = styled(AdminSettingSelect)`
  width: auto;
  padding: 8px 12px;
  font-size: 0.8125rem;
`;

export const AdminListClear = styled(AdminListRefresh)`
  border-color: transparent;
  color: ${coolGray[500]};
`;

export const AdminListError = styled.p`
  padding: 10px 12px;
  margin: 0 0 14px;
  border-radius: 7px;
  background-color: ${coolGray[100]};
  color: ${coolGray[600]};
  font-size: 0.8125rem;
  line-height: 1.6;
`;

export const AdminListTableScroll = styled.div`
  overflow-x: auto;
  overscroll-behavior-x: contain;
`;

export const AdminListTable = styled.table`
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  border: 1px solid ${coolGray[200]};
  text-align: left;
  font-size: 0.8125rem;

  th {
    padding: 10px 14px;
    background-color: ${coolGray[100]};
    color: ${coolGray[600]};
    font-weight: 600;
    white-space: nowrap;
  }

  th, td {
    border: 1px solid ${coolGray[200]};
    vertical-align: middle;
  }

  th:nth-last-child(-n + 2), td:nth-last-child(-n + 2) {
    text-align: center;
  }

  td {
    padding: 13px 14px;
    border-bottom: 1px solid ${coolGray[200]};
    overflow-wrap: anywhere;
  }

  td:first-child {
    min-width: 160px;
    font-weight: 500;
  }

  tbody tr:hover {
    background-color: ${coolGray[50]};
  }
`;

export const AdminListPrimaryColumn = styled.col`
  width: 26%;
`;

export const AdminListDetailColumn = styled.col`
  width: auto;
`;

export const AdminListActionColumn = styled.col`
  width: 100px;
`;

export const AdminListDetails = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 18px;
  margin: 0;
`;

export const AdminListDetail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  min-width: 0;

  dt {
    color: ${coolGray[500]};
    font-weight: 400;
  }

  dd {
    margin: 0;
    color: ${coolGray[700]};
  }
`;

export const AdminListEmpty = styled.td`
  && {
    padding: 42px 16px;
    color: ${coolGray[500]};
    text-align: center;
    font-weight: 400;
  }
`;

export const AdminListPagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  color: ${coolGray[500]};
  font-size: 0.8125rem;
`;

export const AdminListPageButton = styled(AdminListRefresh)`
  width: 34px;
  padding: 6px;
`;

export const AdminListActionButton = styled(AdminSettingSecondaryButton)<{$danger?: boolean}>`
  min-height: 34px;
  padding: 6px 10px;
  color: ${({$danger}) => ($danger ? adminColors.danger : adminColors.primaryText)};

  &:hover:not(:disabled) {
    background-color: ${({$danger}) => ($danger ? adminColors.dangerSoft : adminColors.primarySoft)};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
