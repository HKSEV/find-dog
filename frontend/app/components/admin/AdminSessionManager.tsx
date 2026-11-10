"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { adminSessionCleared } from "@/app/redux/adminSessionActions";
import {
  adminSessionEvent,
  clearAdminSession,
  getAdminRemainingSeconds,
  getAdminSession,
  useAdminSession
} from "@/lib/adminAuth";
import useAdminModal from "../contexts/AdminModalContext";

export default function AdminSessionManager() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const {openAlertModal} = useAdminModal();
  const {session, isHydrating} = useAdminSession();
  const token = session?.token;
  const expiresAt = session?.expiresAt;
  const clockOffset = session?.clockOffset;

  useEffect(() => {
    const handleSessionEnd = (event: Event) => {
      const reason = (event as CustomEvent<{reason?: string}>).detail?.reason;
      if (!reason) return;
      dispatch(adminSessionCleared());
      if (reason !== "logout") {
        openAlertModal("관리자 로그인이 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.", undefined, {
          variant: "info"
        });
      };
      router.replace("/admin/login");
    };
    window.addEventListener(adminSessionEvent, handleSessionEnd);
    return () => window.removeEventListener(adminSessionEvent, handleSessionEnd);
  }, [dispatch, openAlertModal, router]);

  useEffect(() => {
    if (!isHydrating && !token && pathname !== "/admin/login") {
      dispatch(adminSessionCleared());
      router.replace("/admin/login");
    };
  }, [dispatch, isHydrating, pathname, router, token]);

  useEffect(() => {
    if (!token || expiresAt === undefined || clockOffset === undefined) return;
    const checkExpiration = () => {
      const current = getAdminSession();
      if (current?.token === token && getAdminRemainingSeconds(current) === 0) clearAdminSession("expired", token);
    };
    checkExpiration();
    const timer = window.setInterval(checkExpiration, 1000);
    window.addEventListener("focus", checkExpiration);
    document.addEventListener("visibilitychange", checkExpiration);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", checkExpiration);
      document.removeEventListener("visibilitychange", checkExpiration);
    };
  }, [clockOffset, expiresAt, token]);

  return null;
};
