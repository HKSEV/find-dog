import axios, { CanceledError, InternalAxiosRequestConfig } from "axios";
import {
  AdminLoginResponse,
  clearAdminSession,
  getAdminRemainingSeconds,
  getAdminSession,
  getAdminSessionId,
  replaceAdminSession,
  syncAdminServerTime
} from "./adminAuth";

interface AdminRequestConfig extends InternalAxiosRequestConfig {
  adminSessionId?: string;
  adminRetried?: boolean;
}

let renewal: {token: string; sessionId: string; promise: Promise<void>} | null = null;

export const isAdminSessionRenewing = (token: string) => renewal?.token === token;

const adminApi = axios.create({timeout: 15000, withCredentials: false});
const getRequestToken = (authorization: unknown) =>
  typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.substring(7) : null;

adminApi.interceptors.request.use(async (config: AdminRequestConfig) => {
  if (config.url === "/api/admin/login") {
    config.headers.delete("Authorization");
    return config;
  };
  const requestedSession = getAdminSession();
  if (!requestedSession) throw new CanceledError("관리자 로그인이 필요합니다.");
  const sessionId = getAdminSessionId(requestedSession);
  if (config.adminSessionId && config.adminSessionId !== sessionId) throw new CanceledError("관리자 로그인 정보가 변경되었습니다.");
  if (renewal?.sessionId === sessionId && config.url !== "/api/admin/refresh") {
    await renewal.promise.catch(() => undefined);
  };
  const session = getAdminSession();
  if (!session || getAdminSessionId(session) !== sessionId) throw new CanceledError("관리자 로그인 정보가 변경되었습니다.");
  if (getAdminRemainingSeconds(session) === 0) {
    clearAdminSession("expired", session.token);
    throw new CanceledError("관리자 로그인이 만료되었습니다.");
  };
  config.adminSessionId = sessionId;
  config.headers.set("Authorization", `Bearer ${session.token}`);
  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    const token = getRequestToken(response.config.headers.get("Authorization"));
    const config = response.config as AdminRequestConfig;
    const current = getAdminSession();
    if (token && (!current || config.adminSessionId !== getAdminSessionId(current))) {
      throw new CanceledError("관리자 로그인 정보가 변경되었습니다.");
    };
    if (token && current?.token === token && config.url === "/api/admin/profile") {
      syncAdminServerTime(token, Number(response.headers["x-admin-expires-at"]), Number(response.headers["x-server-time"]));
    };
    return response;
  },
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.config?.url !== "/api/admin/login"
      && [401, 403].includes(error.response?.status || 0)) {
      const config = error.config as AdminRequestConfig | undefined;
      const token = getRequestToken(config?.headers.get("Authorization"));
      if (token && renewal?.token === token && config?.url !== "/api/admin/refresh") {
        await renewal.promise.catch(() => undefined);
      };
      const current = getAdminSession();
      if (config && token && current && config.adminSessionId === getAdminSessionId(current)) {
        if (token !== current.token && !config.adminRetried && config.url !== "/api/admin/refresh") {
          config.adminRetried = true;
          return adminApi.request(config);
        };
        if (token === current.token) clearAdminSession("invalid", token);
      };
    };
    return Promise.reject(error);
  }
);

export const renewAdminSession = () => {
  const session = getAdminSession();
  if (!session) return Promise.reject(new CanceledError("관리자 로그인이 필요합니다."));
  const sessionId = getAdminSessionId(session);
  if (renewal?.sessionId === sessionId) return renewal.promise;
  const config = {adminSessionId: sessionId, timeout: 15000};
  const promise = adminApi.post<AdminLoginResponse>("/api/admin/refresh", null, config).then((response) => {
    if (!replaceAdminSession(response.data, session.token)) throw new CanceledError("관리자 로그인 정보가 변경되었습니다.");
  });
  renewal = {token: session.token, sessionId, promise};
  const finish = () => {
    if (renewal?.promise === promise) renewal = null;
  };
  void promise.then(finish, finish);
  return promise;
};

export default adminApi;
