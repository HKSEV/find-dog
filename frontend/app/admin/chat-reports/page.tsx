"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiRefreshCw } from "react-icons/fi";
import adminApi from "@/lib/adminApi";
import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

interface AdminChatReport {
  id: number;
  roomId: number;
  reason: "SPAM" | "ABUSE" | "FAKE" | "PRIVACY" | "ETC";
  detail: string | null;
  status: ReportStatus;
  adminNote: string | null;
  reporterNickname: string;
  reportedNickname: string;
  postTitle: string;
  roomBlocked: boolean;
  createdAt: string;
  handledAt: string | null;
}

interface AdminChatMessage {
  id: number;
  senderNickname: string;
  fromReporter: boolean;
  type: "TEXT" | "LOCATION";
  content: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
}

const reasonLabels: Record<AdminChatReport["reason"], string> = {
  SPAM: "광고·스팸",
  ABUSE: "욕설·비하·위협",
  FAKE: "사례금 요구·거짓 정보",
  PRIVACY: "개인정보 요구·유출",
  ETC: "기타"
};
const statusLabels: Record<ReportStatus, string> = {PENDING: "처리 전", RESOLVED: "처리 완료", DISMISSED: "문제 없음"};

const dateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("ko-KR", {dateStyle: "short", timeStyle: "short"});
};

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{message?: string}>(error) ? error.response?.data?.message || fallback : fallback;

// 💡 관리자 > 채팅 신고
//    회원이 신고한 대화방만 내용을 볼 수 있음 (신고되지 않은 대화는 관리자도 볼 수 없음)
//    처리 완료 / 문제 없음으로 기록하고, 필요하면 대화를 종료(더 이상 메시지 못 보냄)
export default function AdminChatReportsPage() {
  const {openAlertModal} = useAdminModal();
  const [reports, setReports] = useState<AdminChatReport[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<AdminChatMessage[] | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const selectedRef = useRef<number | null>(null); // 마지막으로 고른 신고 (늦게 온 이전 응답이 덮어쓰지 않게)

  const load = useCallback(() => {
    adminApi.get<AdminChatReport[]>("/api/admin/chats/reports")
      .then(({data}) => {
        setReports(Array.isArray(data) ? data : []);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selected = reports?.find((report) => report.id === selectedId) ?? null;

  const select = (report: AdminChatReport) => {
    setSelectedId(report.id);
    selectedRef.current = report.id;
    setNote(report.adminNote ?? "");
    setMessages(null);
    adminApi.get<AdminChatMessage[]>(`/api/admin/chats/reports/${report.id}/messages`)
      .then(({data}) => selectedRef.current === report.id && setMessages(Array.isArray(data) ? data : []))
      .catch(() => selectedRef.current === report.id && setMessages([]));
  };

  const handle = async (status: Exclude<ReportStatus, "PENDING">, closeRoom: boolean) => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const {data} = await adminApi.patch<AdminChatReport>(`/api/admin/chats/reports/${selected.id}`, {status, closeRoom, note});
      setReports((prev) => prev?.map((report) => {
        if (report.id === data.id) return data;
        // 같은 대화방의 다른 신고도 종료 상태를 맞춤
        return closeRoom && report.roomId === data.roomId ? {...report, roomBlocked: true} : report;
      }) ?? prev);
      openAlertModal(closeRoom ? "처리하고 대화를 종료했습니다." : `${statusLabels[status]}(으)로 기록했습니다.`, undefined, {variant: "success"});
    } catch (error) {
      openAlertModal(errorMessage(error, "처리하지 못했습니다. 다시 시도해 주세요."), undefined, {variant: "error"});
    } finally {
      setBusy(false);
    };
  };

  const pending = reports?.filter((report) => report.status === "PENDING").length ?? 0;

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / 실종·제보</S.AdminSettingCaption>
        <S.AdminSettingTitle>채팅 신고</S.AdminSettingTitle>
        <S.AdminSettingDescription>회원이 신고한 대화만 내용을 확인할 수 있어요. 확인 후 처리 결과를 기록하고, 필요하면 대화를 종료하세요.</S.AdminSettingDescription>
      </S.AdminSettingHeader>

      <S.AdminListPanel aria-labelledby="chat-report-title" aria-busy={!reports && !failed}>
        <S.AdminListHeader>
          <div>
            <S.AdminSettingCardTitle id="chat-report-title">신고 목록</S.AdminSettingCardTitle>
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
            <S.AdminListTable aria-label="채팅 신고 목록">
              <thead>
                <tr>
                  <th scope="col">상태</th>
                  <th scope="col">사유</th>
                  <th scope="col">신고한 회원</th>
                  <th scope="col">신고된 회원</th>
                  <th scope="col">글</th>
                  <th scope="col">신고일</th>
                  <th scope="col">대화</th>
                  <th scope="col">보기</th>
                </tr>
              </thead>
              <tbody>
                {!reports?.length ? (
                  <tr><S.AdminListEmpty colSpan={8}>{reports ? "아직 신고가 없습니다." : "불러오는 중입니다."}</S.AdminListEmpty></tr>
                ) : reports.map((report) => (
                  <S.AdminReportRow key={report.id} $selected={report.id === selectedId}>
                    <td><S.AdminReportStatus $status={report.status}>{statusLabels[report.status]}</S.AdminReportStatus></td>
                    <td>{reasonLabels[report.reason]}</td>
                    <td>{report.reporterNickname}</td>
                    <td>{report.reportedNickname}</td>
                    <td>{report.postTitle}</td>
                    <td>{dateTime(report.createdAt)}</td>
                    <td>{report.roomBlocked ? "종료됨" : "진행 중"}</td>
                    <td>
                      <S.AdminListActionButton type="button" onClick={() => select(report)} aria-pressed={report.id === selectedId}>
                        내용 보기
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
            <section aria-label="신고된 대화 내용">
              <S.AdminSettingCardTitle as="h3">대화 내용</S.AdminSettingCardTitle>
              <S.AdminListCount>오른쪽(파란색)이 신고한 회원, 왼쪽이 신고된 회원의 메시지입니다.</S.AdminListCount>
              <S.AdminReportMessages style={{marginTop: 10}}>
                {!messages ? (
                  <li>불러오는 중입니다.</li>
                ) : messages.length === 0 ? (
                  <li>주고받은 메시지가 없습니다.</li>
                ) : messages.map((message) => (
                  <S.AdminReportMessage key={message.id} $reporter={message.fromReporter}>
                    <small>{message.senderNickname} · {dateTime(message.createdAt)}</small>
                    <p>{message.type === "LOCATION" ? `📍 위치: ${message.content || "알려준 위치"}` : message.content}</p>
                  </S.AdminReportMessage>
                ))}
              </S.AdminReportMessages>
            </section>

            <section aria-label="신고 처리">
              <S.AdminSettingCardTitle as="h3">신고 처리</S.AdminSettingCardTitle>
              <S.AdminReportInfo style={{marginTop: 10}}>
                <dt>상태</dt><dd>{statusLabels[selected.status]}{selected.handledAt ? ` (${dateTime(selected.handledAt)})` : ""}</dd>
                <dt>사유</dt><dd>{reasonLabels[selected.reason]}</dd>
                <dt>신고 내용</dt><dd>{selected.detail || "—"}</dd>
                <dt>대화</dt><dd>{selected.roomBlocked ? "종료됨 (메시지를 보낼 수 없음)" : "진행 중"}</dd>
              </S.AdminReportInfo>
              <S.AdminSettingField>
                <S.AdminSettingLabel htmlFor="chat-report-note">처리 메모 (선택)</S.AdminSettingLabel>
                <S.AdminSettingTextarea
                id="chat-report-note"
                maxLength={255}
                placeholder="예: 욕설 확인, 대화 종료"
                value={note}
                onChange={(e) => setNote(e.target.value)}/>
              </S.AdminSettingField>
              <S.AdminReportActions>
                <S.AdminListActionButton type="button" disabled={busy} onClick={() => handle("RESOLVED", false)}>처리 완료</S.AdminListActionButton>
                <S.AdminListActionButton type="button" disabled={busy} onClick={() => handle("DISMISSED", false)}>문제 없음</S.AdminListActionButton>
                <S.AdminListActionButton type="button" $danger disabled={busy || selected.roomBlocked} onClick={() => handle("RESOLVED", true)}>
                  처리 완료 + 대화 종료
                </S.AdminListActionButton>
              </S.AdminReportActions>
            </section>
          </S.AdminReportDetail>
        )}
      </S.AdminListPanel>
    </S.AdminSettingPage>
  );
};
