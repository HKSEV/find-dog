"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  VolunteerApplication,
  cancelVolunteerApplication,
  fetchMyVolunteerApplications,
  formatVolunteerWhen,
  toVolunteerError
} from "../../volunteer/volunteerApi";
import { toImageUrl } from "../../shelter/animalFormat";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import { CustomAlert } from "@/app/components/CustomAlert";
import * as S from "@/assets/css/Style.styles";

// 상태 문구: 확정(다가오는 봉사) / 다녀온 봉사 / 취소
const statusText = (item: VolunteerApplication) => {
  if (item.status === "CANCELED") return {title: "취소한 신청이에요", hint: ""};
  if (item.cancelable) return {title: "신청이 확정됐어요", hint: " 시간에 맞춰 봉사 장소로 와 주세요."};
  return {title: "봉사를 다녀왔어요", hint: " 함께해 주셔서 고마워요."};
};

// 💡 마이 > 봉사 신청 내역 (최신순). 봉사 날까지 취소할 수 있음
export default function MyVolunteersPage() {
  const [items, setItems] = useState<VolunteerApplication[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "error">("loading");
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!localStorage.getItem("token")) {
        setStatus("login");
        return;
      };
      try {
        const list = await fetchMyVolunteerApplications();
        if (!alive) return;
        setItems(list);
        setStatus("ready");
      } catch (error) {
        if (alive) setStatus(toVolunteerError(error, "") === "UNAUTHORIZED" ? "login" : "error");
      };
    };
    const timer = setTimeout(load, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const handleCancel = async (id: number) => {
    setConfirmId(null);
    setCancelingId(id);
    try {
      const updated = await cancelVolunteerApplication(id);
      setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      setNotice(toVolunteerError(error, "취소하지 못했어요. 잠시 후 다시 시도해 주세요."));
    } finally {
      setCancelingId(null);
    };
  };

  const renderBody = () => {
    if (status === "loading") return <S.MissingEmptyText>신청 내역을 불러오는 중이에요</S.MissingEmptyText>;
    if (status === "login") {
      return <S.MissingEmptyText>로그인이 필요해요. <Link href={loginHref("/mypage/volunteers")}>로그인하기</Link></S.MissingEmptyText>;
    };
    if (status === "error") return <S.MissingEmptyText>신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    if (items.length === 0) {
      return <S.MissingEmptyText>아직 신청한 봉사가 없어요. <Link href="/shelter">봉사 모집 보러 가기</Link></S.MissingEmptyText>;
    };

    return (
      <S.ApplicationList>
        {items.map((item) => {
          const imageUrl = toImageUrl(item.imageUrl);
          const text = statusText(item);
          return (
            <S.ApplicationCard key={item.id} $muted={item.status === "CANCELED"}>
              <S.ApplicationHead as={Link} href={`/volunteer/${item.postId}`}>
                {imageUrl ? <S.ApplyThumb src={imageUrl} alt=""/> : <S.ApplyThumbEmpty/>}
                <S.ApplicationTitle>
                  <small>봉사 신청</small>
                  <strong>{item.postTitle}</strong>
                  <span>{formatVolunteerWhen(item)} · {item.place}</span>
                </S.ApplicationTitle>
              </S.ApplicationHead>

              <S.ApplicationStatusBox>
                <strong>{text.title}</strong>
                {text.hint}
              </S.ApplicationStatusBox>

              {item.cancelable && confirmId !== item.id && (
                <S.ApplicationCancel type="button" disabled={cancelingId === item.id} onClick={() => setConfirmId(item.id)}>
                  {cancelingId === item.id ? "취소하는 중..." : "신청 취소"}
                </S.ApplicationCancel>
              )}
              {item.cancelable && confirmId === item.id && (
                <S.ApplicationConfirm role="group" aria-label="신청 취소 확인">
                  <span>취소하면 다른 분이 이 자리에 신청할 수 있어요. 취소할까요?</span>
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
        <Header title="봉사 신청 내역"/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>

      <CustomAlert isOpen={notice !== ""} message={notice} type="error" onConfirm={() => setNotice("")}/>
    </S.AppWrapper>
  );
};
