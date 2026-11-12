"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AppNotification, fetchNotifications, isUnauthorized, readAllNotifications } from "./notificationApi";
import { timeAgo } from "../missing/missingFormat";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import * as S from "@/assets/css/Style.styles";

// 💡 알림 화면: 최근 알림 50개. 열면 모두 읽음으로 바뀜 (이번에 새로 온 알림은 배경색으로 표시)
export default function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "error">("loading");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!localStorage.getItem("token")) {
        setStatus("login");
        return;
      };
      try {
        const list = await fetchNotifications();
        if (!alive) return;
        setItems(list);
        setStatus("ready");
        if (list.some((item) => !item.read)) readAllNotifications().catch(() => {}); // 못 바꿔도 다음에 열 때 다시
      } catch (error) {
        if (alive) setStatus(isUnauthorized(error) ? "login" : "error");
      };
    };
    const timer = setTimeout(load, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const renderBody = () => {
    if (status === "loading") return <S.MissingEmptyText>알림을 불러오는 중이에요</S.MissingEmptyText>;
    if (status === "login") {
      return <S.MissingEmptyText>로그인하면 알림을 볼 수 있어요. <Link href={loginHref("/notifications")}>로그인하기</Link></S.MissingEmptyText>;
    };
    if (status === "error") return <S.MissingEmptyText>알림을 불러오지 못했어요. 잠시 후 다시 시도해 주세요</S.MissingEmptyText>;
    if (items.length === 0) {
      return <S.MissingEmptyText>아직 받은 알림이 없어요.<br/>입양 신청이 진행되면 여기에서 알려 드려요.</S.MissingEmptyText>;
    };

    return (
      <S.NoticeList>
        {items.map((item) => {
          const body = (
            <>
              <S.NoticeKind>입양 신청</S.NoticeKind>
              <S.NoticeMessage>{item.message}</S.NoticeMessage>
              <S.NoticeTime>{timeAgo(item.createdAt)}</S.NoticeTime>
            </>
          );
          return (
            <li key={item.id}>
              {item.link ? (
                <S.NoticeRow as={Link} href={item.link} $unread={!item.read}>{body}</S.NoticeRow>
              ) : (
                <S.NoticeRow $unread={!item.read}>{body}</S.NoticeRow>
              )}
            </li>
          );
        })}
      </S.NoticeList>
    );
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="알림"/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>
    </S.AppWrapper>
  );
};
