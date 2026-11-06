"use client";

import React from "react";
import { Layout } from "../components/layout/Layout";
import * as A from "@/assets/css/style.styles";
import * as I from "@/assets/css/admin/AdminIcons.styles";
import styled from "styled-components";

const ReportLink = styled.a`
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
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  &:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
  }
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
`;

const ReportIcon = styled(I.Download)`
  font-size: 0.875em;
  color: rgba(255, 255, 255, 0.5) !important;
`;

const MonthlyMetricLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700 !important;
  color: #007bff !important;
  text-transform: uppercase !important;
  margin-bottom: 0.25rem !important;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  font-weight: 700 !important;
  color: #1e2939;
`;

const MetricIconBox = styled.div`
  position: relative;
  width: auto;
  max-width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  flex: 0 0 auto;
`;

const CalendarIcon = styled(I.Calendar)`
  font-size: 2em;
  color: #d1d5dc;
`;

const AnnualMetricLabel = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700 !important;
  color: #28a745 !important;
  text-transform: uppercase !important;
  margin-bottom: 0.25rem !important;
`;

export default function DashBoard() {
  return (
    <Layout>
      <A.PageHeader>
        <h1>Dashboard</h1>
        <ReportLink href="#">
          <ReportIcon/>
          Generate Report
        </ReportLink>
      </A.PageHeader>
      <A.GridRow>
        <A.CardColumn>
          <A.StatCard $borderColor="#4e73df">
            <A.CardBody>
              <div>
                <MonthlyMetricLabel>Earnings (Monthly)</MonthlyMetricLabel>
                <MetricValue>$40,000</MetricValue>
                <MetricIconBox>
                  <CalendarIcon/>
                </MetricIconBox>
              </div>
            </A.CardBody>
          </A.StatCard>
        </A.CardColumn>

        <A.CardColumn>
          <A.StatCard $borderColor="#1cc88a">
            <A.CardBody>
              <div>
                <AnnualMetricLabel>Earnings (Annual)</AnnualMetricLabel>
                <MetricValue>$215,000</MetricValue>
              </div>
            </A.CardBody>
          </A.StatCard>
        </A.CardColumn>
      </A.GridRow>
    </Layout>
  );
};
