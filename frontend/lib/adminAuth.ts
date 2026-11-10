import { useMemo, useSyncExternalStore } from "react";

const sessionKey = "find-dog-admin-session";
export const adminSessionEvent = "find-dog-admin-session-change";
let clearedSnapshot: string | null = null;

export interface AdminSession {
  token: string;
  expiresAt: number;
  clockOffset: number;
}

export interface AdminLoginResponse {
  name: string;
  message: string;
  token: string;
  expiresAt: number;
  serverTime: number;
}

const getSnapshot = (): string | null | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const snapshot = sessionStorage.getItem(sessionKey);
    return snapshot === clearedSnapshot ? null : snapshot;
  } catch {
    return null;
  }
};

const parseSession = (snapshot: string | null | undefined): AdminSession | null => {
  if (!snapshot) return null;
  try {
    const value: Partial<AdminSession> = JSON.parse(snapshot);
    if (typeof value.token !== "string" || !value.token || !Number.isFinite(value.expiresAt)
      || !Number.isFinite(value.clockOffset)) return null;
    return value as AdminSession;
  } catch {
    return null;
  }
};

export const getAdminSession = () => parseSession(getSnapshot());

export const getAdminRemainingSeconds = (session: AdminSession, now = Date.now()) =>
  Math.max(0, Math.ceil((session.expiresAt - now - session.clockOffset) / 1000));

export const saveAdminSession = (response: AdminLoginResponse) => {
  if (!response.token || !Number.isFinite(response.expiresAt) || !Number.isFinite(response.serverTime)
    || response.expiresAt <= response.serverTime) throw new Error("관리자 로그인 응답이 올바르지 않습니다.");
  const session: AdminSession = {
    token: response.token,
    expiresAt: response.expiresAt,
    clockOffset: response.serverTime - Date.now()
  };
  sessionStorage.setItem(sessionKey, JSON.stringify(session));
  clearedSnapshot = null;
  window.dispatchEvent(new CustomEvent(adminSessionEvent));
};

export const syncAdminServerTime = (token: string, expiresAt: number, serverTime: number) => {
  const session = getAdminSession();
  if (session?.token !== token || !Number.isFinite(expiresAt) || !Number.isFinite(serverTime)) return;
  try {
    sessionStorage.setItem(sessionKey, JSON.stringify({...session, expiresAt, clockOffset: serverTime - Date.now()}));
    window.dispatchEvent(new CustomEvent(adminSessionEvent));
  } catch {
    // 로그인 때 저장한 만료 시각을 유지합니다.
  }
};

export const clearAdminSession = (reason: "logout" | "expired" | "invalid", expectedToken?: string) => {
  if (expectedToken && getAdminSession()?.token !== expectedToken) return;
  clearedSnapshot = getSnapshot() || null;
  try {
    sessionStorage.removeItem(sessionKey);
  } catch {
    // 저장소 접근이 제한되어도 로그인 종료를 알립니다.
  }
  window.dispatchEvent(new CustomEvent(adminSessionEvent, {detail: {reason}}));
};

const subscribe = (listener: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === sessionKey || event.key === null) listener();
  };
  window.addEventListener(adminSessionEvent, listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(adminSessionEvent, listener);
    window.removeEventListener("storage", handleStorage);
  };
};

export const useAdminSession = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => undefined);
  const session = useMemo(() => parseSession(snapshot), [snapshot]);
  return {session, isHydrating: snapshot === undefined};
};
