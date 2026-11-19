// 💡 실종·목격 글 1:1 채팅 API (로그인 필요)
import axios from "axios";
import { missingAuthHeader } from "../redux/missingSlice";

export interface ChatRoom {
  id: number;
  postId: number;
  postTitle: string;
  postType: "LOST" | "FOUND";
  postStatus: "MISSING" | "COMPLETED" | null;
  postImage: string | null;
  otherNickname: string;
  otherImage: string | null;
  iAmOwner: boolean;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unread: number;
  blocked: boolean; // 신고하며 차단했거나 운영팀이 종료한 대화 (메시지를 보낼 수 없음)
}

export interface ChatMessage {
  id: number;
  mine: boolean;
  type: "TEXT" | "LOCATION";
  content: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
}

const auth = () => ({headers: missingAuthHeader()});

export const openChat = async (postId: number) => (await axios.post<ChatRoom>("/api/chats", {postId}, auth())).data;
export const fetchChatRooms = async () => (await axios.get<ChatRoom[]>("/api/chats", auth())).data;
export const fetchChatRoom = async (id: number) => (await axios.get<ChatRoom>(`/api/chats/${id}`, auth())).data;
export const fetchChatMessages = async (id: number, after: number) =>
  (await axios.get<ChatMessage[]>(`/api/chats/${id}/messages`, {...auth(), params: {after}})).data;
export const sendChatMessage = async (id: number, body: {type: "TEXT" | "LOCATION"; content?: string; lat?: number; lng?: number}) =>
  (await axios.post<ChatMessage>(`/api/chats/${id}/messages`, body, auth())).data;
export type ChatReportReason = "SPAM" | "ABUSE" | "FAKE" | "PRIVACY" | "ETC";
export const chatReportReasons: {value: ChatReportReason; label: string}[] = [
  {value: "SPAM", label: "광고·스팸이에요"},
  {value: "ABUSE", label: "욕설·비하·위협이 있어요"},
  {value: "FAKE", label: "사례금 요구나 거짓 정보 같아요"},
  {value: "PRIVACY", label: "개인정보를 요구하거나 퍼뜨려요"},
  {value: "ETC", label: "기타"}
];
export const reportChat = async (id: number, body: {reason: ChatReportReason; detail?: string; block: boolean}) =>
  (await axios.post<{message: string}>(`/api/chats/${id}/report`, body, auth())).data.message;
export const fetchChatUnread = async () => (await axios.get<{count: number}>("/api/chats/unread-count", auth())).data.count;

// 서버가 보낸 한글 메시지 (없으면 fallback)
export const toChatError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<{message?: string}>(error)) {
    if (error.response?.status === 401) return "로그인이 끝났어요. 다시 로그인해 주세요.";
    return error.response?.data?.message || fallback;
  };
  return fallback;
};

// "오후 3:10" / "11.18" / "어제"
export const chatTime = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    const h = date.getHours();
    return `${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${String(date.getMinutes()).padStart(2, "0")}`;
  };
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "어제";
  return `${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")}`;
};
