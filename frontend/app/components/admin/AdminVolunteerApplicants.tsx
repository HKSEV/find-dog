"use client";

import { useEffect, useState } from "react";
import adminApi from "@/lib/adminApi";
import * as S from "@/assets/css/Style.styles";

interface Applicant {
  id: number;
  applicantName: string;
  applicantPhone: string;
  message: string | null;
  status: "CONFIRMED" | "CANCELED";
}

export default function AdminVolunteerApplicants({postId}: {postId: number}) {
  const [rows, setRows] = useState<Applicant[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    adminApi.get<Applicant[]>(`/api/admin/volunteers/${postId}/applications`, {signal: controller.signal, timeout: 15000})
      .then(({data}) => {
        if (!Array.isArray(data)) throw new Error("신청자 응답이 올바르지 않습니다.");
        if (!controller.signal.aborted) setRows(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailed(true);
      });
    return () => controller.abort();
  }, [postId]);

  return (
    <S.AdminSettingFields>
      <S.AdminSettingCardTitle>봉사 신청자</S.AdminSettingCardTitle>
      {failed ? (
        <S.AdminListError role="alert">신청자 목록을 불러오지 못했습니다.</S.AdminListError>
      ) : !rows?.length ? (
        <S.AdminListCount role="status">{rows ? "아직 신청자가 없습니다." : "신청자를 불러오는 중입니다."}</S.AdminListCount>
      ) : (
        <S.AdminListTableScroll>
          <S.AdminListTable aria-label="봉사 신청자 목록">
            <thead>
              <tr><th scope="col">이름</th><th scope="col">연락처</th><th scope="col">신청 상태</th><th scope="col">한마디</th></tr>
            </thead>
            <tbody>
              {rows.map((applicant) => (
                <tr key={applicant.id}>
                  <td>{applicant.applicantName}</td>
                  <td>{applicant.applicantPhone}</td>
                  <td>{applicant.status === "CONFIRMED" ? "신청 확정" : "취소"}</td>
                  <td>{applicant.message || "—"}</td>
                </tr>
              ))}
            </tbody>
          </S.AdminListTable>
        </S.AdminListTableScroll>
      )}
    </S.AdminSettingFields>
  );
};
