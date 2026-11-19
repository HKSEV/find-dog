"use client";

import styled from "styled-components";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";

// 💡 관리자 > 채팅 신고 (신고 목록 + 선택한 신고의 대화 내용)

export const AdminReportStatus = styled.span<{$status: "PENDING" | "RESOLVED" | "DISMISSED"}>`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  background-color: ${({$status}) => ($status === "PENDING" ? adminColors.dangerSoft : coolGray[100])};
  color: ${({$status}) => ($status === "PENDING" ? adminColors.danger : coolGray[600])};
`;

export const AdminReportRow = styled.tr<{$selected: boolean}>`
  td {
    background-color: ${({$selected}) => ($selected ? adminColors.primarySoft : "transparent")};
  }
`;

export const AdminReportDetail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 1fr);
  gap: 20px;
  margin-top: 20px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
  }
`;

export const AdminReportMessages = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 420px;
  margin: 0;
  padding: 14px;
  overflow-y: auto;
  border: 1px solid ${coolGray[200]};
  border-radius: 10px;
  background-color: ${coolGray[50]};
  list-style: none;
`;

// 신고한 사람 말은 오른쪽(파랑), 신고된 사람 말은 왼쪽(흰색)
export const AdminReportMessage = styled.li<{$reporter: boolean}>`
  align-self: ${({$reporter}) => ($reporter ? "flex-end" : "flex-start")};
  max-width: 80%;

  small {
    display: block;
    margin-bottom: 3px;
    font-size: 0.6875rem;
    color: ${coolGray[500]};
    text-align: ${({$reporter}) => ($reporter ? "right" : "left")};
  }

  p {
    margin: 0;
    padding: 8px 12px;
    border: 1px solid ${({$reporter}) => ($reporter ? "transparent" : coolGray[200])};
    border-radius: 12px;
    background-color: ${({$reporter}) => ($reporter ? adminColors.primarySoft : "#fff")};
    font-size: 0.8125rem;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: ${coolGray[800]};
  }
`;

export const AdminReportInfo = styled.dl`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 8px 12px;
  margin: 0 0 16px;
  font-size: 0.8125rem;

  dt {
    color: ${coolGray[500]};
  }

  dd {
    margin: 0;
    color: ${coolGray[800]};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const AdminReportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;
