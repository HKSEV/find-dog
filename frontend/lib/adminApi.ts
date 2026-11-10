import axios, { CanceledError } from "axios";
import { clearAdminSession, getAdminSession, syncAdminServerTime } from "./adminAuth";

const adminApi = axios.create({timeout: 15000, withCredentials: false});
const getRequestToken = (authorization: unknown) =>
  typeof authorization === "string" && authorization.startsWith("Bearer ") ? authorization.substring(7) : null;

adminApi.interceptors.request.use((config) => {
  const session = getAdminSession();
  if (session && config.url !== "/api/admin/login") config.headers.set("Authorization", `Bearer ${session.token}`);
  else config.headers.delete("Authorization");
  return config;
});

adminApi.interceptors.response.use(
  (response) => {
    const token = getRequestToken(response.config.headers.get("Authorization"));
    if (token && getAdminSession()?.token !== token) throw new CanceledError("관리자 로그인 정보가 변경되었습니다.");
    if (token && response.config.url === "/api/admin/profile") {
      syncAdminServerTime(token, Number(response.headers["x-admin-expires-at"]), Number(response.headers["x-server-time"]));
    };
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.config?.url !== "/api/admin/login"
      && [401, 403].includes(error.response?.status || 0)) {
      const token = getRequestToken(error.config?.headers.get("Authorization"));
      if (token && getAdminSession()?.token === token) clearAdminSession("invalid", token);
    };
    return Promise.reject(error);
  }
);

export default adminApi;
