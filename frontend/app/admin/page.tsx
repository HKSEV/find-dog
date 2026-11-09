"use client";

import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPaw } from "react-icons/fa";
import { FiCalendar, FiChevronRight, FiDownload, FiFileText, FiHome, FiRefreshCw, FiSpeaker } from "react-icons/fi";
import { AppDispatch, RootState } from "../store/store";
import { fetchDashboard } from "../redux/dashboardAdminSlice";
import { Layout } from "../components/layout/Layout";
import {
  createDashboardReport,
  DashboardPeriod,
  dashboardPostSources,
  dashboardSources,
  getDashboardDate,
  getDashboardMetrics,
  getDashboardPosts,
  getDashboardTrend
} from "@/lib/adminDashboard";
import * as S from "@/assets/css/Style.styles";

const quickLinks = [
  {href: "/admin/pick", title: "추천 동물 설정", description: "홈에 노출할 동물을 관리하세요.", icon: FaPaw},
  {href: "/admin/campaign", title: "캠페인 관리", description: "등록된 캠페인을 확인하세요.", icon: FiSpeaker},
  {href: "/admin/intergrate", title: "통합 게시물 관리", description: "등록할 게시물을 관리하세요.", icon: FiFileText},
  {href: "/admin/sheltersetting", title: "보호소 설정", description: "보호 동물 정보를 관리하세요.", icon: FiHome}
];

const metricIcons = [FaPaw, FiSpeaker, FiFileText, FiHome];

export default function DashBoard() {
  const dispatch = useDispatch<AppDispatch>();
  const {data, status, failedSources, updatedAt} = useSelector((state: RootState) => state.dashboardAdmin);
  const [period, setPeriod] = useState<DashboardPeriod>(30);
  const isLoading = status === "idle" || status === "loading";
  const metrics = getDashboardMetrics(data, failedSources);
  const recentPosts = useMemo(() => getDashboardPosts(data).slice(0, 4), [data]);
  const trend = useMemo(() => getDashboardTrend(data, period, updatedAt || ""), [data, period, updatedAt]);
  const chartUnavailable = [...dashboardPostSources, "shelterAnimals" as const].some((source) =>
    failedSources.includes(source)
  );
  const chartHasData = trend.some(({posts, animals}) => posts || animals);
  const chartStep = Math.max(
    1,
    Math.ceil(trend.reduce((maximum, {posts, animals}) => Math.max(maximum, posts, animals), 0) / 4)
  );
  const chartMax = chartStep * 4;
  const chartLabelStep = Math.max(1, Math.ceil((trend.length - 1) / 6));
  const failedLabels = dashboardSources
    .filter(({key}) => failedSources.includes(key))
    .map(({label}) => label)
    .join(", ");
  const date = getDashboardDate(updatedAt);

  const getX = (index: number) => (trend.length === 1 ? 372 : 48 + index * (648 / Math.max(1, trend.length - 1)));
  const getY = (count: number) => 202 - (count / chartMax) * 174;

  const handleDownload = () => {
    if (!updatedAt) return;
    const csv = createDashboardReport(data, failedSources, updatedAt, period);
    const url = URL.createObjectURL(new Blob([csv], {type: "text/csv;charset=utf-8;"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = `어서찾아주개_운영현황_${date.replaceAll("-", "")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <Layout>
      <S.DashboardPage>
        <S.DashboardBreadcrumb aria-label="현재 위치">관리자 / Dashboard</S.DashboardBreadcrumb>
        <S.DashboardHeader>
          <div>
            <S.DashboardTitle>대시보드</S.DashboardTitle>
            <S.DashboardDescription>서비스 운영 현황을 한눈에 확인하세요.</S.DashboardDescription>
          </div>
          <S.DashboardActions>
            <S.DashboardDate>
              <FiCalendar aria-hidden="true"/>
              {date ? date.replaceAll("-", ".") : isLoading ? "조회 중" : "조회 실패"}
            </S.DashboardDate>
            <S.DashboardDownload
            type="button"
            onClick={handleDownload}
            disabled={isLoading || !updatedAt || failedSources.length === dashboardSources.length}>
              <FiDownload aria-hidden="true"/>
              보고서 다운로드
            </S.DashboardDownload>
          </S.DashboardActions>
        </S.DashboardHeader>

        {!isLoading && failedSources.length > 0 && (
          <S.DashboardNotice role="alert">
            <span>{failedLabels} 데이터를 불러오지 못했습니다.</span>
            <S.DashboardRetry type="button" onClick={() => dispatch(fetchDashboard())}>
              <FiRefreshCw aria-hidden="true"/>
              다시 불러오기
            </S.DashboardRetry>
          </S.DashboardNotice>
        )}

        <S.DashboardMetrics aria-label="등록 현황" aria-busy={isLoading}>
          {metrics.map(({label, value, unit, description}, index) => {
            const Icon = metricIcons[index];
            return (
              <S.DashboardMetricCard key={label}>
                <S.DashboardMetricLabel>{label}</S.DashboardMetricLabel>
                <S.DashboardMetricIcon $tone={index === 0 ? "blue" : index === 1 ? "green" : "gray"}>
                  <Icon aria-hidden="true"/>
                </S.DashboardMetricIcon>
                <S.DashboardMetricValue>
                  {isLoading ? "…" : value === null ? "—" : value.toLocaleString("ko-KR")}
                  <S.DashboardMetricUnit>{unit}</S.DashboardMetricUnit>
                </S.DashboardMetricValue>
                <S.DashboardMetricDescription>
                  {!isLoading && value === null ? "데이터를 불러오지 못했습니다." : description}
                </S.DashboardMetricDescription>
              </S.DashboardMetricCard>
            );
          })}
        </S.DashboardMetrics>

        <S.DashboardContentGrid>
          <S.DashboardPanel aria-labelledby="registration-title" aria-busy={isLoading}>
            <S.DashboardPanelHeader>
              <div>
                <S.DashboardPanelTitle id="registration-title">등록 현황</S.DashboardPanelTitle>
                <S.DashboardPanelDescription>
                  {period === "all"
                    ? "전체 기간의 월별 게시물·보호 동물 등록 추이"
                    : `최근 ${period}일간의 게시물·보호 동물 등록 추이`}
                </S.DashboardPanelDescription>
              </div>
              <S.DashboardPeriod
              aria-label="등록 현황 조회 기간"
              value={period}
              onChange={(e) => setPeriod(e.target.value === "all" ? "all" : Number(e.target.value) === 7 ? 7 : 30)}>
                <option value={7}>최근 7일</option>
                <option value={30}>최근 30일</option>
                <option value="all">전체 기간</option>
              </S.DashboardPeriod>
            </S.DashboardPanelHeader>
            {isLoading || chartUnavailable || !chartHasData ? (
              <S.DashboardChartEmpty role="status">
                <FiFileText aria-hidden="true"/>
                <strong>
                  {isLoading
                    ? "등록 현황을 불러오는 중입니다."
                    : chartUnavailable
                      ? "등록 현황을 불러오지 못했습니다."
                      : "선택한 기간에 등록된 데이터가 없습니다."}
                </strong>
                <span>
                  {isLoading
                    ? "잠시만 기다려 주세요."
                    : chartUnavailable
                      ? "다시 불러오기를 눌러 확인해 주세요."
                      : "새로운 데이터가 등록되면 이곳에서 확인할 수 있습니다."}
                </span>
              </S.DashboardChartEmpty>
            ) : (
              <S.DashboardChartScroll>
                <S.DashboardChart
                viewBox="0 0 720 244"
                role="img"
                aria-labelledby="registration-chart-title registration-chart-description">
                  <title id="registration-chart-title">
                    {period === "all" ? "전체 기간 등록 현황" : `최근 ${period}일 등록 현황`}
                  </title>
                  <desc id="registration-chart-description">
                    {`파랑은 게시물, 초록은 보호 동물의 ${period === "all" ? "월별" : "일별"} 등록 수입니다. 상세 수치는 보고서에서 확인할 수 있습니다.`}
                  </desc>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <g key={index}>
                      <S.DashboardChartGrid
                      x1={48}
                      x2={696}
                      y1={getY(index * chartStep)}
                      y2={getY(index * chartStep)}/>
                      <S.DashboardAxisLabel x={34} y={getY(index * chartStep) + 4} textAnchor="end">
                        {index * chartStep}
                      </S.DashboardAxisLabel>
                    </g>
                  ))}
                  <S.DashboardChartLine
                  $series="posts"
                  points={trend.map(({posts}, index) => `${getX(index)},${getY(posts)}`).join(" ")}/>
                  <S.DashboardChartLine
                  $series="animals"
                  points={trend.map(({animals}, index) => `${getX(index)},${getY(animals)}`).join(" ")}/>
                  {trend.map((point, index) => (
                    <g key={point.date}>
                      <S.DashboardChartDot $series="posts" cx={getX(index)} cy={getY(point.posts)} r={2.75}>
                        <title>{`${point.date} 게시물 ${point.posts}건`}</title>
                      </S.DashboardChartDot>
                      <S.DashboardChartDot $series="animals" cx={getX(index)} cy={getY(point.animals)} r={2.75}>
                        <title>{`${point.date} 보호 동물 ${point.animals}마리`}</title>
                      </S.DashboardChartDot>
                      {(index % chartLabelStep === 0 || index === trend.length - 1) && (
                        <S.DashboardAxisLabel x={getX(index)} y={229} textAnchor="middle">
                          {period === "all" ? point.date.replace("-", ".") : point.date.slice(5).replace("-", ".")}
                        </S.DashboardAxisLabel>
                      )}
                    </g>
                  ))}
                </S.DashboardChart>
              </S.DashboardChartScroll>
            )}
            <S.DashboardLegend aria-label="차트 범례">
              <S.DashboardLegendItem $series="posts">게시물</S.DashboardLegendItem>
              <S.DashboardLegendItem $series="animals">보호 동물</S.DashboardLegendItem>
            </S.DashboardLegend>
            <S.DashboardChartNote>등록일 기준 집계 · 등록일이 없는 항목은 추이에서 제외됩니다.</S.DashboardChartNote>
          </S.DashboardPanel>

          <S.DashboardPanel aria-labelledby="quick-title">
            <S.DashboardPanelTitle id="quick-title">빠른 관리</S.DashboardPanelTitle>
            <S.DashboardQuickList>
              {quickLinks.map(({href, title, description, icon: Icon}) => (
                <li key={href}>
                  <S.DashboardQuickLink href={href}>
                    <Icon aria-hidden="true"/>
                    <div>
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </div>
                    <FiChevronRight aria-hidden="true"/>
                  </S.DashboardQuickLink>
                </li>
              ))}
            </S.DashboardQuickList>
          </S.DashboardPanel>
        </S.DashboardContentGrid>

        <S.DashboardPanel aria-labelledby="recent-posts-title" aria-busy={isLoading}>
          <S.DashboardPanelHeader>
            <S.DashboardPanelTitle id="recent-posts-title">최근 등록 게시물</S.DashboardPanelTitle>
            <S.DashboardMoreLink href="/admin/intergrate">
              게시물 관리 <FiChevronRight aria-hidden="true"/>
            </S.DashboardMoreLink>
          </S.DashboardPanelHeader>
          <S.DashboardTableScroll>
            <S.DashboardTable>
              <thead>
                <tr>
                  <th scope="col">제목</th>
                  <th scope="col">구분</th>
                  <th scope="col">등록일</th>
                  <th scope="col">상태</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || !recentPosts.length ? (
                  <tr>
                    <S.DashboardEmptyCell colSpan={4}>
                      {isLoading
                        ? "게시물을 불러오는 중입니다."
                        : failedSources.some(
                              (source) => source === "campaigns" || dashboardPostSources.includes(source)
                            )
                          ? "게시물을 불러오지 못했습니다. 다시 불러오기를 눌러 주세요."
                          : "아직 등록된 게시물이 없습니다."}
                    </S.DashboardEmptyCell>
                  </tr>
                ) : (
                  recentPosts.map(({key, title, category, date: postDate}) => (
                    <tr key={key}>
                      <td>
                        <S.DashboardPostTitle>{title || "제목 없음"}</S.DashboardPostTitle>
                      </td>
                      <td>
                        <S.DashboardCategory $green={category === "캠페인" || category === "도움 요청"}>
                          {category}
                        </S.DashboardCategory>
                      </td>
                      <td>{postDate ? postDate.replaceAll("-", ".") : "날짜 없음"}</td>
                      <td>
                        <S.DashboardPostStatus>등록됨</S.DashboardPostStatus>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </S.DashboardTable>
          </S.DashboardTableScroll>
        </S.DashboardPanel>
        <S.DashboardFootnote>
          {isLoading
            ? "등록 데이터를 불러오고 있습니다."
            : failedSources.length
              ? "조회된 데이터만 표시하며, 조회에 실패한 수치는 —로 표시합니다."
              : "기존에 등록된 데이터를 기준으로 표시합니다. 게시물은 유튜브·펠로우 소식·도움 요청을 집계합니다."}
        </S.DashboardFootnote>
      </S.DashboardPage>
    </Layout>
  );
};
