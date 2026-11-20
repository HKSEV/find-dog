// 💡 내 알림 (홈 헤더 종 아이콘 > 알림 화면). 로그인 토큰 필요
import axios from "axios";

export interface AppNotification {
  id: number;
  type: "ADOPTION" | "CHAT" | "NEARBY" | "REPORT" | "COMMENT";
  badge?: string | null; // 입양: 신청 상태 (FORWARDED, ADOPTED, REJECTED), 신고: 처리 결과 (RESOLVED, DISMISSED)
  message: string;
  imageUrl?: string | null;
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

// 알림 위 작은 라벨: 글자와 색 (모르는 값이면 "입양 신청")
export type NoticeTone = "brand" | "success" | "muted";

export const noticeBadge = (item: AppNotification): {label: string; tone: NoticeTone} => {
  if (item.type === "CHAT") return {label: "채팅", tone: "brand"};
  if (item.type === "NEARBY") return {label: "근처 목격 제보", tone: "success"};
  if (item.type === "COMMENT") return {label: "댓글", tone: "brand"};
  if (item.type === "REPORT") return {label: item.badge === "RESOLVED" ? "신고 처리 완료" : "신고 확인", tone: "muted"};
  switch (item.badge) {
    case "FORWARDED": return {label: "보호소 전달", tone: "brand"};
    case "ADOPTED": return {label: "입양 확정", tone: "success"};
    case "REJECTED": return {label: "입양 불가", tone: "muted"};
    default: return {label: "입양 신청", tone: "brand"};
  };
};

export const isUnauthorized = (error: unknown) => axios.isAxiosError(error) && error.response?.status === 401;
