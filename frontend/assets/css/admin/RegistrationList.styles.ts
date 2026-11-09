"use client";

import styled from "styled-components";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";

export const AdminListPanel = styled.section`
  min-width: 0;
  padding: 22px;
  margin-bottom: 26px;
  border: 1px solid ${coolGray[200]};
  border-radius: 12px;
  background-color: #FFFFFF;
  color: ${coolGray[800]};

  @media (max-width: 575px) {
    padding: 16px;
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

export const AdminListTitle = styled.h2`
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
`;

export const AdminListCount = styled.p`
  margin: 6px 0 0;
  color: ${coolGray[500]};
  font-size: 0.75rem;
`;

export const AdminListRefresh = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  color: ${coolGray[600]};
  font-size: 0.8125rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${coolGray[100]};
  }

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
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
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  background-color: ${coolGray[50]};

  > svg {
    width: 17px;
    height: 17px;
    flex-shrink: 0;
    color: ${coolGray[400]};
  }

  &:focus-within {
    border-color: ${adminColors.primary};
    box-shadow: 0 0 0 2px #EFF6FF;
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

export const AdminListFilter = styled.select`
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  color: ${coolGray[700]};
  font-size: 0.8125rem;

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }
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
  min-width: 640px;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;

  th {
    padding: 10px 14px;
    background-color: ${coolGray[100]};
    color: ${coolGray[600]};
    font-weight: 600;
    white-space: nowrap;
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

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: ${coolGray[50]};
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
