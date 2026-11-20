"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FiExternalLink, FiRefreshCw } from "react-icons/fi";
import adminApi from "@/lib/adminApi";
import { withBasePath } from "@/lib/deploymentPath";
import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

interface AdminPostReport {
  id: number;
  postId: number;
  postTitle: string;
  postType: "LOST" | "FOUND" | "COMMUNITY"; // COMMUNITY = 이야기(커뮤니티) 글
  authorNickname: string;
  reporterNickname: string;
  reason: "SPAM" | "ABUSE" | "FAKE" | "PRIVACY" | "ETC";
  detail: string | null;
  status: ReportStatus;
  adminNote: string | null;
  createdAt: string;
  handledAt: string | null;
}

const reasonLabels: Record<AdminPostReport["reason"], string> = {
  FAKE: "거짓 글·사기 의심",
  SPAM: "광고·홍보",
  PRIVACY: "개인정보 노출",
  ABUSE: "욕설·혐오·부적절한 사진",
  ETC: "기타"
};
// 글 종류별 주소 (신고 처리·글 보기·글 삭제)
const isCommunity = (report: AdminPostReport) => report.postType === "COMMUNITY";
const kindLabel = (report: AdminPostReport) => (isCommunity(report) ? "이야기" : report.postType === "FOUND" ? "목격" : "실종");
const reportApi = (report: AdminPostReport) => `/api/admin/${isCommunity(report) ? "community-posts" : "missing-posts"}/reports/${report.id}`;
const postApi = (report: AdminPostReport) => `/api/admin/${isCommunity(report) ? "community-posts" : "missing-posts"}/${report.postId}`;
const postHref = (report: AdminPostReport) => (isCommunity(report) ? `/story/detail/?id=${report.postId}` : `/missing/detail/?id=${report.postId}`);
const rowKey = (report: AdminPostReport) => `${isCommunity(report) ? "c" : "m"}${report.id}`;

const statusLabels: Record<ReportStatus, string> = {PENDING: "처리 전", RESOLVED: "처리 완료", DISMISSED: "문제 없음"};

const dateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("ko-KR", {dateStyle: "short", timeStyle: "short"});
};

const errorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as {message?: string} | string | undefined;
  return (typeof data === "string" ? data : data?.message) || fallback;
};

// 💡 관리자 > 글 신고 (실종·제보 글 + 이야기 글)
//    신고 내용을 확인하고 처리 완료 / 문제 없음으로 기록, 문제가 있는 글은 삭제
export default function AdminPostReportsPage() {
  const {openAlertModal, openConfirmModal} = useAdminModal();
  const [reports, setReports] = useState<AdminPostReport[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // rowKey (실종 m1 / 이야기 c1)
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    Promise.all([
      adminApi.get<AdminPostReport[]>("/api/admin/missing-posts/reports"),
      adminApi.get<AdminPostReport[]>("/api/admin/community-posts/reports")
    ])
      .then(([missing, community]) => {
        const list = [...(Array.isArray(missing.data) ? missing.data : []), ...(Array.isArray(community.data) ? community.data : [])];
        // 처리 전이 먼저, 그다음 최신순
        list.sort((a, b) => Number(a.status !== "PENDING") - Number(b.status !== "PENDING") || b.createdAt.localeCompare(a.createdAt));
        setReports(list);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = reports?.find((report) => rowKey(report) === selectedId) ?? null;

  const handle = async (status: Exclude<ReportStatus, "PENDING">) => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const {data} = await adminApi.patch<AdminPostReport>(reportApi(selected), {status, note});
      setReports((prev) => prev?.map((report) => (rowKey(report) === rowKey(data) ? data : report)) ?? prev);
      openAlertModal(`${statusLabels[status]}(으)로 기록했습니다.`, undefined, {variant: "success"});
    } catch (error) {
      openAlertModal(errorMessage(error, "처리하지 못했습니다. 다시 시도해 주세요."), undefined, {variant: "error"});
    } finally {
      setBusy(false);
    };
  };

  // 글 삭제: 글과 그 글의 신고·채팅이 함께 지워짐
  const deletePost = () => {
    if (!selected || busy) return;
    const target = selected;
    openConfirmModal(`"${target.postTitle}" 글을 삭제할까요? 글과 그 글의 신고·채팅이 함께 지워지고 되돌릴 수 없습니다.`, () => {
      void removePost(target);
    });
  };

  const removePost = async (selected: AdminPostReport) => {
    setBusy(true);
    try {
      await adminApi.delete(postApi(selected));
      setReports((prev) => prev?.filter((report) => !(isCommunity(report) === isCommunity(selected) && report.postId === selected.postId)) ?? prev);
      setSelectedId(null);
      openAlertModal("글을 삭제했습니다.", undefined, {variant: "success"});
    } catch (error) {
      openAlertModal(errorMessage(error, "삭제하지 못했습니다. 다시 시도해 주세요."), undefined, {variant: "error"});
    } finally {
      setBusy(false);
    };
  };

  const pending = reports?.filter((report) => report.status === "PENDING").length ?? 0;

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / 실종·제보</S.AdminSettingCaption>
        <S.AdminSettingTitle>글 신고</S.AdminSettingTitle>
        <S.AdminSettingDescription>회원이 신고한 실종·제보 글과 이야기 글을 확인하세요. 문제가 있는 글은 삭제하고 처리 결과를 기록하세요.</S.AdminSettingDescription>
      </S.AdminSettingHeader>

      <S.AdminListPanel aria-labelledby="post-report-title" aria-busy={!reports && !failed}>
        <S.AdminListHeader>
          <div>
            <S.AdminSettingCardTitle id="post-report-title">신고 목록</S.AdminSettingCardTitle>
            <S.AdminListCount aria-live="polite">
              {reports ? `전체 ${reports.length}건 · 처리 전 ${pending}건` : failed ? "" : "불러오는 중입니다."}
            </S.AdminListCount>
          </div>
          <S.AdminListRefresh type="button" onClick={load}>
            <FiRefreshCw aria-hidden="true"/>
            새로고침
          </S.AdminListRefresh>
        </S.AdminListHeader>

        {failed ? (
          <S.AdminListError role="alert">신고 목록을 불러오지 못했습니다.</S.AdminListError>
        ) : (
          <S.AdminListTableScroll>
            <S.AdminListTable aria-label="글 신고 목록">
              <thead>
                <tr>
                  <th scope="col">상태</th>
                  <th scope="col">사유</th>
                  <th scope="col">글</th>
                  <th scope="col">글쓴이</th>
                  <th scope="col">신고한 회원</th>
                  <th scope="col">신고일</th>
                  <th scope="col">보기</th>
                </tr>
              </thead>
              <tbody>
                {!reports?.length ? (
                  <tr><S.AdminListEmpty colSpan={7}>{reports ? "아직 신고가 없습니다." : "불러오는 중입니다."}</S.AdminListEmpty></tr>
                ) : reports.map((report) => (
                  <S.AdminReportRow key={rowKey(report)} $selected={rowKey(report) === selectedId}>
                    <td><S.AdminReportStatus $status={report.status}>{statusLabels[report.status]}</S.AdminReportStatus></td>
                    <td>{reasonLabels[report.reason]}</td>
                    <td>[{kindLabel(report)}] {report.postTitle}</td>
                    <td>{report.authorNickname}</td>
                    <td>{report.reporterNickname}</td>
                    <td>{dateTime(report.createdAt)}</td>
                    <td>
                      <S.AdminListActionButton
                      type="button"
                      aria-pressed={rowKey(report) === selectedId}
                      onClick={() => {
                        setSelectedId(rowKey(report));
                        setNote(report.adminNote ?? "");
                      }}>
                        처리하기
                      </S.AdminListActionButton>
                    </td>
                  </S.AdminReportRow>
                ))}
              </tbody>
            </S.AdminListTable>
          </S.AdminListTableScroll>
        )}

        {selected && (
          <S.AdminReportDetail>
            <section aria-label="신고 내용">
              <S.AdminSettingCardTitle as="h3">신고 내용</S.AdminSettingCardTitle>
              <S.AdminReportInfo style={{marginTop: 10}}>
                <dt>글</dt><dd>[{kindLabel(selected)}] {selected.postTitle} ({selected.authorNickname})</dd>
                <dt>사유</dt><dd>{reasonLabels[selected.reason]}</dd>
                <dt>자세한 내용</dt><dd>{selected.detail || "—"}</dd>
                <dt>신고한 회원</dt><dd>{selected.reporterNickname} · {dateTime(selected.createdAt)}</dd>
                <dt>상태</dt><dd>{statusLabels[selected.status]}{selected.handledAt ? ` (${dateTime(selected.handledAt)})` : ""}</dd>
              </S.AdminReportInfo>
              <S.AdminListActionButton as="a" href={withBasePath(postHref(selected))} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden="true"/>
                글 보기 (새 창)
              </S.AdminListActionButton>
            </section>

            <section aria-label="신고 처리">
              <S.AdminSettingCardTitle as="h3">신고 처리</S.AdminSettingCardTitle>
              <S.AdminSettingField style={{marginTop: 10}}>
                <S.AdminSettingLabel htmlFor="post-report-note">처리 메모 (선택)</S.AdminSettingLabel>
                <S.AdminSettingTextarea
                id="post-report-note"
                maxLength={255}
                placeholder="예: 사례금 요구 확인, 글 삭제"
                value={note}
                onChange={(e) => setNote(e.target.value)}/>
              </S.AdminSettingField>
              <S.AdminReportActions>
                <S.AdminListActionButton type="button" disabled={busy} onClick={() => handle("RESOLVED")}>처리 완료</S.AdminListActionButton>
                <S.AdminListActionButton type="button" disabled={busy} onClick={() => handle("DISMISSED")}>문제 없음</S.AdminListActionButton>
                <S.AdminListActionButton type="button" $danger disabled={busy} onClick={deletePost}>글 삭제</S.AdminListActionButton>
              </S.AdminReportActions>
            </section>
          </S.AdminReportDetail>
        )}
      </S.AdminListPanel>
    </S.AdminSettingPage>
  );
};
