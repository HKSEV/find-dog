"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiExternalLink, FiRefreshCw, FiSearch } from "react-icons/fi";
import adminApi from "@/lib/adminApi";
import { withBasePath } from "@/lib/deploymentPath";
import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

interface AdminMember {
  id: number;
  email: string | null;
  nickname: string;
  name: string;
  phone: string | null; // 가운데를 가린 번호
  userType: string;
  provider: string | null; // kakao 면 카카오 가입
  admin: boolean;
  missingPosts: number;
  communityPosts: number;
  reportsReceived: number; // 이 회원의 글·대화가 받은 신고 수
  suspended: boolean;
  suspendedReason: string | null;
  suspendedAt: string | null;
}

type Filter = "" | "reported" | "suspended";

const dateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("ko-KR", {dateStyle: "short", timeStyle: "short"});
};

const errorMessage = (error: unknown, fallback: string) =>
  axios.isAxiosError<{message?: string}>(error) ? error.response?.data?.message || fallback : fallback;

// 💡 관리자 > 회원 관리
//    회원 목록(쓴 글·받은 신고 수)을 보고, 문제가 있는 회원은 이용 정지 (정지되면 로그인 불가, 가지고 있던 로그인도 풀림)
export default function AdminMembersPage() {
  const {openAlertModal} = useAdminModal();
  const [members, setMembers] = useState<AdminMember[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    adminApi.get<AdminMember[]>("/api/admin/members")
      .then(({data}) => {
        setMembers(Array.isArray(data) ? data : []);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const rows = useMemo(() => {
    const words = query.trim().toLowerCase();
    return (members ?? []).filter((member) => {
      if (filter === "reported" && member.reportsReceived === 0) return false;
      if (filter === "suspended" && !member.suspended) return false;
      if (!words) return true;
      return [member.nickname, member.email, member.name].some((value) => value?.toLowerCase().includes(words));
    });
  }, [members, query, filter]);

  const selected = members?.find((member) => member.id === selectedId) ?? null;

  const changeSuspension = async (suspended: boolean) => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      const {data} = await adminApi.patch<AdminMember>(`/api/admin/members/${selected.id}/suspension`, {suspended, reason});
      setMembers((prev) => prev?.map((member) => (member.id === data.id ? data : member)) ?? prev);
      setReason(data.suspendedReason ?? "");
      openAlertModal(suspended ? `${data.nickname}님을 이용 정지했습니다.` : `${data.nickname}님의 이용 정지를 풀었습니다.`, undefined, {variant: "success"});
    } catch (error) {
      openAlertModal(errorMessage(error, "처리하지 못했습니다. 다시 시도해 주세요."), undefined, {variant: "error"});
    } finally {
      setBusy(false);
    };
  };

  const suspendedCount = members?.filter((member) => member.suspended).length ?? 0;

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / 회원</S.AdminSettingCaption>
        <S.AdminSettingTitle>회원 관리</S.AdminSettingTitle>
        <S.AdminSettingDescription>회원이 쓴 글과 받은 신고를 확인하고, 문제가 있는 회원은 이용을 정지하세요. 정지된 회원은 로그인할 수 없어요.</S.AdminSettingDescription>
      </S.AdminSettingHeader>

      <S.AdminListPanel aria-labelledby="member-list-title" aria-busy={!members && !failed}>
        <S.AdminListHeader>
          <div>
            <S.AdminSettingCardTitle id="member-list-title">회원 목록</S.AdminSettingCardTitle>
            <S.AdminListCount aria-live="polite">
              {members ? `전체 ${members.length}명 · 이용 정지 ${suspendedCount}명${rows.length !== members.length ? ` · 검색 결과 ${rows.length}명` : ""}` : failed ? "" : "불러오는 중입니다."}
            </S.AdminListCount>
          </div>
          <S.AdminListRefresh type="button" onClick={load}>
            <FiRefreshCw aria-hidden="true"/>
            새로고침
          </S.AdminListRefresh>
        </S.AdminListHeader>

        <S.AdminListToolbar>
          <S.AdminListSearch role="search" aria-label="회원 검색">
            <S.AdminListSearchLabel htmlFor="member-search">회원 검색</S.AdminListSearchLabel>
            <FiSearch aria-hidden="true"/>
            <S.AdminListInput
            id="member-search"
            type="search"
            placeholder="닉네임, 이메일, 이름으로 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}/>
          </S.AdminListSearch>
          <S.AdminListFilter aria-label="회원 상태" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
            <option value="">전체</option>
            <option value="reported">신고받은 회원</option>
            <option value="suspended">이용 정지</option>
          </S.AdminListFilter>
        </S.AdminListToolbar>

        {failed ? (
          <S.AdminListError role="alert">회원 목록을 불러오지 못했습니다.</S.AdminListError>
        ) : (
          <S.AdminListTableScroll>
            <S.AdminListTable aria-label="회원 목록">
              <thead>
                <tr>
                  <th scope="col">닉네임</th>
                  <th scope="col">이메일</th>
                  <th scope="col">가입</th>
                  <th scope="col">실종·제보 글</th>
                  <th scope="col">커뮤니티 글</th>
                  <th scope="col">받은 신고</th>
                  <th scope="col">상태</th>
                  <th scope="col">관리</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><S.AdminListEmpty colSpan={8}>{members ? "조건에 맞는 회원이 없습니다." : "불러오는 중입니다."}</S.AdminListEmpty></tr>
                ) : rows.map((member) => (
                  <S.AdminReportRow key={member.id} $selected={member.id === selectedId}>
                    <td>{member.nickname}{member.admin ? " · 관리자 계정" : ""}</td>
                    <td>{member.email || "—"}</td>
                    <td>{member.provider === "kakao" ? "카카오" : "이메일"}</td>
                    <td>{member.missingPosts}</td>
                    <td>{member.communityPosts}</td>
                    <td>{member.reportsReceived > 0 ? <strong>{member.reportsReceived}</strong> : 0}</td>
                    <td>
                      <S.AdminReportStatus $status={member.suspended ? "PENDING" : "DISMISSED"}>
                        {member.suspended ? "이용 정지" : "정상"}
                      </S.AdminReportStatus>
                    </td>
                    <td>
                      <S.AdminListActionButton
                      type="button"
                      aria-pressed={member.id === selectedId}
                      onClick={() => {
                        setSelectedId(member.id);
                        setReason(member.suspendedReason ?? "");
                      }}>
                        관리
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
            <section aria-label="회원 정보">
              <S.AdminSettingCardTitle as="h3">회원 정보</S.AdminSettingCardTitle>
              <S.AdminReportInfo style={{marginTop: 10}}>
                <dt>닉네임</dt><dd>{selected.nickname}</dd>
                <dt>이름</dt><dd>{selected.name}</dd>
                <dt>이메일</dt><dd>{selected.email || "—"}</dd>
                <dt>연락처</dt><dd>{selected.phone || "—"}</dd>
                <dt>쓴 글</dt><dd>실종·제보 {selected.missingPosts} · 커뮤니티 {selected.communityPosts}</dd>
                <dt>받은 신고</dt><dd>{selected.reportsReceived}건 (글 신고·채팅 신고 합계)</dd>
                <dt>상태</dt><dd>{selected.suspended ? `이용 정지 (${dateTime(selected.suspendedAt)})` : "정상"}</dd>
              </S.AdminReportInfo>
              <S.AdminListActionButton as="a" href={withBasePath(`/profile/?id=${selected.id}`)} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden="true"/>
                공개 프로필 보기 (새 창)
              </S.AdminListActionButton>
            </section>

            <section aria-label="이용 정지">
              <S.AdminSettingCardTitle as="h3">이용 정지</S.AdminSettingCardTitle>
              {selected.admin ? (
                <S.AdminListCount>관리자 계정은 정지할 수 없습니다.</S.AdminListCount>
              ) : (
                <>
                  <S.AdminSettingField style={{marginTop: 10}}>
                    <S.AdminSettingLabel htmlFor="member-suspend-reason">정지 사유 {selected.suspended ? "" : "(필수)"}</S.AdminSettingLabel>
                    <S.AdminSettingTextarea
                    id="member-suspend-reason"
                    maxLength={255}
                    placeholder="예: 사례금을 노린 거짓 제보 반복"
                    value={reason}
                    disabled={selected.suspended}
                    onChange={(e) => setReason(e.target.value)}/>
                    <S.AdminSettingHelp>사유는 회원이 로그인할 때 안내 문구로 보여요.</S.AdminSettingHelp>
                  </S.AdminSettingField>
                  <S.AdminReportActions>
                    {selected.suspended ? (
                      <S.AdminListActionButton type="button" disabled={busy} onClick={() => changeSuspension(false)}>이용 정지 풀기</S.AdminListActionButton>
                    ) : (
                      <S.AdminListActionButton type="button" $danger disabled={busy || !reason.trim()} onClick={() => changeSuspension(true)}>이용 정지</S.AdminListActionButton>
                    )}
                  </S.AdminReportActions>
                </>
              )}
            </section>
          </S.AdminReportDetail>
        )}
      </S.AdminListPanel>
    </S.AdminSettingPage>
  );
};
