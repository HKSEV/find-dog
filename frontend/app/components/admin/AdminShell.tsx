"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Layout } from "../layout/Layout";
import AdminPageLoading from "./AdminPageLoading";
import {
  adminSessionEvent,
  getAdminRemainingSeconds,
  getAdminSession,
  useAdminSession
} from "@/lib/adminAuth";
import { isAdminSessionRenewing } from "@/lib/adminApi";
import * as S from "@/assets/css/Style.styles";

const loginPath = "/admin/login";

export default function AdminShell({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const {session, isHydrating} = useAdminSession();
  const documentNavigationStarted = useRef(false);
  const token = session?.token;
  const expiresAt = session?.expiresAt;
  const clockOffset = session?.clockOffset;

  useEffect(() => {
    if (pathname === loginPath) {
      documentNavigationStarted.current = false;
      return;
    };

    let fallbackTimer: number | undefined;

    const checkRedirect = () => {
      const currentPath = window.location.pathname.replace(/\/+$/, "");
      const isAdminPath = currentPath === "/admin" || currentPath.startsWith("/admin/");
      if (!isAdminPath || currentPath === loginPath || documentNavigationStarted.current) return;

      const current = getAdminSession();
      if (current && (getAdminRemainingSeconds(current) > 0 || isAdminSessionRenewing(current.token))) return;

      // 로그아웃·만료 알림을 확인할 수 있도록 기다립니다.
      if (document.querySelector('[role="alertdialog"][open]')) {
        fallbackTimer = window.setTimeout(checkRedirect, 250);
        return;
      };

      documentNavigationStarted.current = true;
      window.location.replace(loginPath);
    };

    const scheduleRedirectCheck = () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(checkRedirect, 1000);
    };

    const handleResume = (event: Event) => {
      if (event.type === "visibilitychange" && document.visibilityState === "hidden") return;
      if (event.type === "pageshow") documentNavigationStarted.current = false;

      window.dispatchEvent(new CustomEvent(adminSessionEvent));
      scheduleRedirectCheck();
    };

    scheduleRedirectCheck();
    window.addEventListener("pageshow", handleResume);
    window.addEventListener("focus", handleResume);
    document.addEventListener("visibilitychange", handleResume);

    return () => {
      if (fallbackTimer !== undefined) window.clearTimeout(fallbackTimer);
      window.removeEventListener("pageshow", handleResume);
      window.removeEventListener("focus", handleResume);
      document.removeEventListener("visibilitychange", handleResume);
    };
  }, [clockOffset, expiresAt, pathname, token]);

  if (pathname === loginPath) return children;

  const canRender = session && (getAdminRemainingSeconds(session) > 0 || isAdminSessionRenewing(session.token));
  if (isHydrating || !canRender) {
    return (
      <S.AdminShellWrapper>
        <AdminPageLoading message={isHydrating ? "로그인 정보를 확인하는 중입니다." : "로그인 페이지로 이동 중입니다."}/>
      </S.AdminShellWrapper>
    );
  };

  return <Layout>{children}</Layout>;
};