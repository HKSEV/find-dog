"use client";

import styled from "styled-components";
import { StatCard } from "@/assets/css/common/Card.styles";
import { Download, Calendar } from "@/assets/css/admin/AdminIcons.styles";

export const MonthlyStatCard = styled(StatCard).attrs({$borderColor: "#4E73DF"})``;
export const AnnualStatCard = styled(StatCard).attrs({$borderColor: "#1CC88A"})``;

export const ReportLink = styled.a`
  display: none !important;
  @media (min-width: 576px) {
    display: inline-block !important;
  }
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  color: #FFF;
  background-color: #007BFF;
  border-color: #007BFF;
  &:hover {
    color: #FFF;
    background-color: #0069D9;
    border-color: #0062CC;
  }
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
`;

export const ReportIcon = styled(Download)`
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.5) !important;
`;

export const MonthlyMetricLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700 !important;
  color: #007BFF !important;
  text-transform: uppercase !important;
  margin-bottom: 0.25rem !important;
`;

export const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  font-weight: 700 !important;
  color: #1E2939;
`;

export const MetricIconBox = styled.div`
  position: relative;
  width: auto;
  max-width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  flex: 0 0 auto;
`;

export const CalendarIcon = styled(Calendar)`
  font-size: 2em;
  color: #D1D5DC;
`;

export const AnnualMetricLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700 !important;
  color: #28A745 !important;
  text-transform: uppercase !important;
  margin-bottom: 0.25rem !important;
`;
