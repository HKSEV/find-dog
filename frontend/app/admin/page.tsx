"use client";

import React from "react";
import { Layout } from "../components/layout/Layout";
import * as S from "@/assets/css/Style.styles";

export default function DashBoard() {
  return (
    <Layout>
      <S.PageHeader>
        <h1>Dashboard</h1>
        <S.ReportLink href="#">
          <S.ReportIcon/>
          Generate Report
        </S.ReportLink>
      </S.PageHeader>
      <S.GridRow>
        <S.CardColumn>
          <S.MonthlyStatCard>
            <S.CardBody>
              <div>
                <S.MonthlyMetricLabel>Earnings (Monthly)</S.MonthlyMetricLabel>
                <S.MetricValue>$40,000</S.MetricValue>
                <S.MetricIconBox>
                  <S.CalendarIcon/>
                </S.MetricIconBox>
              </div>
            </S.CardBody>
          </S.MonthlyStatCard>
        </S.CardColumn>

        <S.CardColumn>
          <S.AnnualStatCard>
            <S.CardBody>
              <div>
                <S.AnnualMetricLabel>Earnings (Annual)</S.AnnualMetricLabel>
                <S.MetricValue>$215,000</S.MetricValue>
              </div>
            </S.CardBody>
          </S.AnnualStatCard>
        </S.CardColumn>
      </S.GridRow>
    </Layout>
  );
};
