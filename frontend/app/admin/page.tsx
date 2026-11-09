"use client";

import React from "react";
import { Layout } from "../components/layout/Layout";
import * as A from "@/assets/css/style.styles";
import {
  ReportLink,
  ReportIcon,
  MonthlyMetricLabel,
  MetricValue,
  MetricIconBox,
  CalendarIcon,
  AnnualMetricLabel,
  MonthlyStatCard,
  AnnualStatCard
} from "@/assets/css/admin/Dashboard.styles";

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
          <MonthlyStatCard>
            <A.CardBody>
              <div>
                <MonthlyMetricLabel>Earnings (Monthly)</MonthlyMetricLabel>
                <MetricValue>$40,000</MetricValue>
                <MetricIconBox>
                  <CalendarIcon/>
                </MetricIconBox>
              </div>
            </A.CardBody>
          </MonthlyStatCard>
        </A.CardColumn>

        <A.CardColumn>
          <AnnualStatCard>
            <A.CardBody>
              <div>
                <AnnualMetricLabel>Earnings (Annual)</AnnualMetricLabel>
                <MetricValue>$215,000</MetricValue>
              </div>
            </A.CardBody>
          </AnnualStatCard>
        </A.CardColumn>
      </A.GridRow>
    </Layout>
  );
};
