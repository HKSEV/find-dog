"use client";

import { useEffect, useState } from "react";
import { FiClock, FiRefreshCw } from "react-icons/fi";
import { clearAdminSession, getAdminRemainingSeconds, getAdminSession, getAdminSessionId, useAdminSession } from "@/lib/adminAuth";
import { renewAdminSession } from "@/lib/adminApi";
import useAdminModal from "../contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

export default function AdminSessionExpiry() {
  const {session} = useAdminSession();
  const {openAlertModal} = useAdminModal();
  const [now, setNow] = useState(() => Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!session || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await renewAdminSession();
      setNow(Date.now());
    } catch {
      const current = getAdminSession();
      if (current && getAdminSessionId(current) === getAdminSessionId(session)) {
        if (getAdminRemainingSeconds(current) === 0) clearAdminSession("expired", current.token);
        else openAlertModal("로그인 시간을 갱신하지 못했습니다. 잠시 후 다시 시도해 주세요.", undefined, {variant: "error"});
      };
    } finally {
      setIsRefreshing(false);
    }
  };

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
      <S.AdminSessionRefreshButton
      type="button"
      aria-label="로그인 시간 갱신"
      title="로그인 시간 갱신"
      aria-busy={isRefreshing}
      disabled={isRefreshing}
      $refreshing={isRefreshing}
      onClick={handleRefresh}>
        <FiRefreshCw aria-hidden="true"/>
      </S.AdminSessionRefreshButton>
    </S.AdminSessionExpiryBadge>
  );
};
