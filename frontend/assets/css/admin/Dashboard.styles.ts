"use client";

import Link from "next/link";
import styled, { css } from "styled-components";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";

type DashboardSeries = "posts" | "animals";

const dashboardFocus = css`
  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }
`;

export const DashboardPage = styled.main`
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 8px 8px 24px;
  color: ${coolGray[800]};

  @media (max-width: 767px) {
    padding: 0 0 24px;
  }
`;

export const DashboardBreadcrumb = styled.nav`
  margin-bottom: 8px;
  color: ${coolGray[500]};
  font-size: 0.8125rem;
`;

export const DashboardHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
`;

export const DashboardTitle = styled.h1`
  margin: 0 0 6px;
  font-size: 1.875rem;
  font-weight: 750;
  letter-spacing: -0.05em;
  line-height: 1.3;
`;

export const DashboardDescription = styled.p`
  margin: 0;
  color: ${coolGray[600]};
  font-size: 0.875rem;
`;

export const DashboardActions = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

export const DashboardDate = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  background-color: #FFFFFF;
  font-size: 0.8125rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  svg {
    width: 16px;
    height: 16px;
    color: ${coolGray[600]};
  }
`;

export const DashboardDownload = styled.button`
  ${dashboardFocus}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 14px;
  border: 1px solid ${adminColors.primary};
  border-radius: 7px;
  background-color: ${adminColors.primary};
  color: #FFFFFF;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: ${adminColors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const DashboardNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding: 14px 18px;
  border: 1px solid ${coolGray[200]};
  border-radius: 10px;
  background-color: ${coolGray[100]};
  color: ${coolGray[700]};
  font-size: 0.8125rem;
`;

export const DashboardRetry = styled.button`
  ${dashboardFocus}
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${adminColors.primary};
  font-weight: 600;
  cursor: pointer;
`;

export const DashboardMetrics = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;

  @media (max-width: 1199px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 575px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

export const DashboardMetricCard = styled.article`
  position: relative;
  min-width: 0;
  padding: 22px;
  border: 1px solid ${coolGray[200]};
  border-radius: 11px;
  background-color: #FFFFFF;
  box-shadow: ${adminColors.cardShadow};
`;

export const DashboardMetricLabel = styled.h2`
  margin: 0 42px 8px 0;
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.5;
`;

export const DashboardMetricIcon = styled.span<{$tone: "blue" | "green" | "gray"}>`
  position: absolute;
  top: 18px;
  right: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 9px;
  background-color: ${({$tone}) => ($tone === "blue" ? "#EFF6FF" : $tone === "green" ? "#ECFDF5" : coolGray[100])};
  color: ${({$tone}) => ($tone === "blue" ? adminColors.primary : $tone === "green" ? "#1A996A" : coolGray[500])};

  svg {
    width: 21px;
    height: 21px;
  }
`;

export const DashboardMetricValue = styled.div`
  margin-bottom: 5px;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.035em;
`;

export const DashboardMetricUnit = styled.span`
  margin-left: 7px;
  color: ${coolGray[600]};
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: normal;
`;

export const DashboardMetricDescription = styled.p`
  margin: 0;
  color: ${coolGray[500]};
  font-size: 0.75rem;
  line-height: 1.6;
`;

export const DashboardContentGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.75fr) minmax(280px, 1fr);
  align-items: stretch;
  gap: 22px;
  margin-bottom: 22px;

  @media (max-width: 1199px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const DashboardPanel = styled.section`
  min-width: 0;
  padding: 22px;
  border: 1px solid ${coolGray[200]};
  border-radius: 11px;
  background-color: #FFFFFF;
  box-shadow: ${adminColors.cardShadow};

  @media (max-width: 575px) {
    padding: 18px;
  }
`;

export const DashboardPanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
`;

export const DashboardPanelTitle = styled.h2`
  flex-shrink: 0;
  white-space: nowrap;
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  line-height: 1.5;
  letter-spacing: -0.035em;
`;

export const DashboardPanelDescription = styled.p`
  margin: 3px 0 0;
  color: ${coolGray[500]};
  font-size: 0.8125rem;
`;

export const DashboardPeriod = styled.select`
  ${dashboardFocus}
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid ${coolGray[200]};
  border-radius: 7px;
  background-color: #FFFFFF;
  color: ${coolGray[700]};
  font-size: 0.8125rem;
  cursor: pointer;
`;

export const DashboardChartScroll = styled.div`
  overflow-x: auto;
  overscroll-behavior-x: contain;
`;

export const DashboardChart = styled.svg`
  width: 100%;
  min-width: 460px;
  height: auto;
  overflow: visible;
`;

export const DashboardChartGrid = styled.line.attrs({
  stroke: coolGray[200],
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke"
})``;

export const DashboardAxisLabel = styled.text`
  fill: ${coolGray[500]};
  font-size: 12px;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
`;

export const DashboardChartLine = styled.polyline.attrs<{$series: DashboardSeries}>(({$series}) => ({
  fill: "none",
  stroke: $series === "posts" ? adminColors.primary : "#1CC88A",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  vectorEffect: "non-scaling-stroke"
}))``;

export const DashboardChartDot = styled.circle.attrs<{$series: DashboardSeries}>(({$series}) => ({
  fill: "#FFFFFF",
  stroke: $series === "posts" ? adminColors.primary : "#1CC88A",
  strokeWidth: 1.75,
  vectorEffect: "non-scaling-stroke"
}))``;

export const DashboardChartEmpty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 230px;
  color: ${coolGray[500]};
  text-align: center;
  font-size: 0.8125rem;

  svg {
    width: 28px;
    height: 28px;
    margin-bottom: 4px;
    color: ${coolGray[400]};
  }

  strong {
    color: ${coolGray[600]};
    font-weight: 500;
  }
`;

export const DashboardLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 8px;
`;

export const DashboardChartNote = styled.p`
  margin: 10px 0 0;
  color: ${coolGray[500]};
  font-size: 0.6875rem;
  text-align: center;
`;

export const DashboardLegendItem = styled.span<{$series: DashboardSeries}>`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${coolGray[600]};
  font-size: 0.75rem;
  white-space: nowrap;

  &::before {
    content: "";
    width: 15px;
    height: 3px;
    border-radius: 2px;
    background-color: ${({$series}) => ($series === "posts" ? adminColors.primary : "#1CC88A")};
  }
`;

export const DashboardQuickList = styled.ul`
  margin-top: 9px;

  li + li {
    border-top: 1px solid ${coolGray[200]};
  }
`;

export const DashboardQuickLink = styled(Link)`
  ${dashboardFocus}
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 69px;
  padding: 10px 4px;
  border-radius: 6px;
  color: ${coolGray[600]};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${coolGray[50]};
    color: ${coolGray[800]};
  }

  > svg {
    width: 21px;
    height: 21px;
    flex-shrink: 0;
  }

  > svg:last-child {
    width: 17px;
    height: 17px;
    margin-left: auto;
  }

  > div {
    flex: 1;
    min-width: 0;
  }

  strong {
    display: block;
    color: ${coolGray[800]};
    font-size: 0.875rem;
    font-weight: 650;
  }

  span {
    display: block;
    margin-top: 3px;
    color: ${coolGray[500]};
    font-size: 0.75rem;
  }
`;

export const DashboardMoreLink = styled(Link)`
  ${dashboardFocus}
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 0;
  color: ${adminColors.primary};
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
`;

export const DashboardTableScroll = styled.div`
  overflow-x: auto;
  overscroll-behavior-x: contain;
`;

export const DashboardTable = styled.table`
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.8125rem;

  th {
    padding: 10px 14px;
    background-color: ${coolGray[100]};
    font-weight: 600;
  }

  th:first-child {
    border-radius: 7px 0 0 7px;
  }

  th:last-child {
    border-radius: 0 7px 7px 0;
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid ${coolGray[200]};
  }

  td:first-child {
    width: 48%;
  }

  td:not(:first-child) {
    white-space: nowrap;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

export const DashboardPostTitle = styled.span`
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
  color: ${coolGray[800]};

`;

export const DashboardCategory = styled.span<{$green: boolean}>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  background-color: ${({$green}) => ($green ? "#ECFDF5" : "#EFF6FF")};
  color: ${({$green}) => ($green ? "#16724E" : "#365F9D")};
  font-size: 0.75rem;
`;

export const DashboardPostStatus = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: ${coolGray[600]};

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #1CC88A;
  }
`;

export const DashboardEmptyCell = styled.td`
  && {
    padding: 38px 14px;
    color: ${coolGray[500]};
    text-align: center;
  }
`;

export const DashboardFootnote = styled.p`
  margin: 12px 0 0;
  color: ${coolGray[500]};
  font-size: 0.75rem;
  line-height: 1.6;
`;
