// 💡 내 알림 (홈 헤더 종 아이콘 > 알림 화면). 로그인 토큰 필요
import axios from "axios";

export interface AppNotification {
  id: number;
  type: "ADOPTION";
  message: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const fetchNotifications = async () =>
  (await axios.get<AppNotification[]>("/api/notifications", {headers: authHeader()})).data;

// 종 아이콘 빨간 점용. 로그인 전이거나 실패하면 false
export const fetchHasUnread = async () => {
  if (!localStorage.getItem("token")) return false;
  try {
    return (await axios.get<{hasUnread: boolean}>("/api/notifications/unread", {headers: authHeader()})).data.hasUnread;
  } catch {
    return false;
  };
};

export const readAllNotifications = async () => {
  await axios.patch("/api/notifications/read-all", null, {headers: authHeader()});
};

export const isUnauthorized = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 401;
