"use client";

import { useEffect, useState } from "react";
import { FiClock } from "react-icons/fi";
import { getAdminRemainingSeconds, useAdminSession } from "@/lib/adminAuth";
import * as S from "@/assets/css/Style.styles";

export default function AdminSessionExpiry() {
  const {session} = useAdminSession();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const timer = window.setInterval(tick, 1000);
    window.addEventListener("focus", tick);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", tick);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  if (!session) return null;
  const seconds = getAdminRemainingSeconds(session, now);
  const remaining = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const deadline = new Date(session.expiresAt).toLocaleTimeString("ko-KR", {hour: "2-digit", minute: "2-digit"});

  return (
    <S.AdminSessionExpiryBadge $expiring={seconds <= 300} title={`${deadline} 로그인 만료`}>
      <FiClock aria-hidden="true"/>
      <span>로그인 남은 시간</span>
      <time dateTime={new Date(session.expiresAt).toISOString()} aria-label={`로그인 만료까지 ${remaining}`}>
        {remaining}
      </time>
    </S.AdminSessionExpiryBadge>
  );
};
