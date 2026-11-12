"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { genderLabel, toImageUrl } from "../../shelter/animalFormat";
import { timeAgo } from "../../missing/missingFormat";
import {
  AdoptionApplication,
  applicationStatusHint,
  applicationStatusText,
  applicationStepIndex,
  applicationSteps,
  cancelApplication,
  fetchMyApplications,
  isActiveApplication,
  toApplicationError
} from "../../shelter/adoptionApi";

import Header from "@/app/components/Header";
import { CustomAlert } from "@/app/components/CustomAlert";
import * as S from "@/assets/css/Style.styles";

// 💡 마이 > 입양 신청 내역 (최신순). 진행 중인 신청은 취소할 수 있음
export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "error">("loading");
  const [confirmId, setConfirmId] = useState<number | null>(null); // "정말 취소할까요?"를 띄운 신청
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setStatus("login");
      return;
    };
    try {
      setApplications(await fetchMyApplications());
      setStatus("ready");
    } catch (error) {
      setStatus(toApplicationError(error, "") === "UNAUTHORIZED" ? "login" : "error");
    };
  }, []);

  useEffect(() => {
    // 화면에 들어올 때 한 번 불러옴 (불러오기는 비동기라 바로 상태를 바꾸지 않음)
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const handleCancel = async (id: number) => {
    setConfirmId(null);
    setCancelingId(id);
    try {
      const updated = await cancelApplication(id);
      setApplications((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setNotice(toApplicationError(error, "취소하지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setCancelingId(null);
    };
  };

  const renderBody = () => {
    if (status === "loading") return <S.MissingEmptyText>신청 내역을 불러오는 중이에요</S.MissingEmptyText>;
    if (status === "login") {
      return <S.MissingEmptyText>로그인이 필요해요. <Link href="/login">로그인하기</Link></S.MissingEmptyText>;
    };
    if (status === "error") return <S.MissingEmptyText>신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    if (applications.length === 0) {
      return <S.MissingEmptyText>아직 보낸 입양 신청이 없어요. <Link href="/shelter">보호 중인 친구 보러 가기</Link></S.MissingEmptyText>;
    };

    return (
      <S.ApplicationList>
        {applications.map((item) => {
          const active = isActiveApplication(item.status);
          const step = applicationStepIndex(item.status);
          const stopped = item.status === "REJECTED" || item.status === "CANCELED";
          const imageUrl = toImageUrl(item.animalImageUrl);
          return (
            <S.ApplicationCard key={item.id} $muted={item.status === "CANCELED"}>
              <S.ApplicationHead as={Link} href={`/shelter/${item.animalId}`}>
                {imageUrl ? <S.ApplyThumb src={imageUrl} alt=""/> : <S.ApplyThumbEmpty/>}
                <S.ApplicationTitle>
                  <small>입양 신청</small>
                  <strong>{item.animalBreed}{item.animalGender ? ` · ${genderLabel[item.animalGender] ?? item.animalGender}` : ""}</strong>
                  <span>{[item.animalRescueLocation, `${timeAgo(item.createdAt)} 신청`].filter(Boolean).join(" · ")}</span>
                </S.ApplicationTitle>
              </S.ApplicationHead>

              {item.status !== "CANCELED" && (
                <>
                  <S.ApplicationBar aria-hidden="true">
                    {applicationSteps.map((label, index) => (
                      <S.ApplicationBarStep key={label} $on={index <= step} $tone={stopped && index === 2 ? "stop" : "done"}/>
                    ))}
                  </S.ApplicationBar>
                  <S.ApplicationBarLabels>
                    {applicationSteps.map((label, index) => (
                      <span key={label}>{index === step ? <b>{label}</b> : label}</span>
                    ))}
                  </S.ApplicationBarLabels>
                </>
              )}

              <S.ApplicationStatusBox>
                <strong>{applicationStatusText[item.status]}</strong>
                {applicationStatusHint[item.status]}
                {item.statusReason && <q>{item.statusReason}</q>}
                {item.status === "REJECTED" && <> <Link href="/shelter">다른 친구 보러 가기</Link></>}
              </S.ApplicationStatusBox>

              {active && confirmId !== item.id && (
                <S.ApplicationCancel type="button" disabled={cancelingId === item.id} onClick={() => setConfirmId(item.id)}>
                  {cancelingId === item.id ? "취소하는 중..." : "신청 취소"}
                </S.ApplicationCancel>
              )}
              {active && confirmId === item.id && (
                <S.ApplicationConfirm role="group" aria-label="신청 취소 확인">
                  <span>취소한 신청은 되돌릴 수 없어요. 취소할까요?</span>
                  <S.ApplicationCancel type="button" onClick={() => setConfirmId(null)}>아니요</S.ApplicationCancel>
                  <S.ApplicationCancel type="button" $danger onClick={() => handleCancel(item.id)}>취소할게요</S.ApplicationCancel>
                </S.ApplicationConfirm>
              )}
            </S.ApplicationCard>
          );
        })}
      </S.ApplicationList>
    );
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="입양 신청 내역"/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>

      <CustomAlert isOpen={notice !== ""} message={notice} type="error" onConfirm={() => setNotice("")}/>
    </S.AppWrapper>
  );
};
