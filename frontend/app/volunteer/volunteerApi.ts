// 💡 봉사 모집·신청 API. 선착순이라 신청하면 바로 확정
//    공용 store.ts를 건드리지 않으려고 Redux slice 대신 화면에서 바로 부름
import axios from "axios";

export type VolunteerState = "OPEN" | "FULL" | "CLOSED";
export type VolunteerApplicationStatus = "CONFIRMED" | "CANCELED";

export interface VolunteerPost {
  id: number;
  title: string;
  content?: string | null;
  place: string;
  activityDate: string; // "2026-11-20"
  startTime: string; // "10:00"
  endTime: string;
  capacity: number;
  appliedCount: number;
  state: VolunteerState;
  imageUrl?: string | null;
  myApplicationId?: number | null; // 상세에서 로그인한 내가 신청했으면
}

export interface VolunteerApplication {
  id: number;
  postId: number;
  postTitle: string;
  place: string;
  activityDate: string;
  startTime: string;
  endTime: string;
  imageUrl?: string | null;
  applicantName: string;
  applicantPhone: string;
  message?: string | null;
  status: VolunteerApplicationStatus;
  cancelable: boolean;
  createdAt: string;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const fetchVolunteers = async () => (await axios.get<VolunteerPost[]>("/api/volunteers")).data;

export const fetchVolunteer = async (id: number) =>
  (await axios.get<VolunteerPost>(`/api/volunteers/${id}`, {headers: authHeader()})).data;

export const applyVolunteer = async (id: number, body: {applicantName: string; applicantPhone: string; message: string}) =>
  (await axios.post<VolunteerApplication>(`/api/volunteers/${id}/applications`, body, {headers: authHeader()})).data;

export const fetchMyVolunteerApplications = async () =>
  (await axios.get<VolunteerApplication[]>("/api/volunteer-applications/mine", {headers: authHeader()})).data;

export const cancelVolunteerApplication = async (id: number) =>
  (await axios.patch<VolunteerApplication>(`/api/volunteer-applications/${id}/cancel`, null, {headers: authHeader()})).data;

// 서버가 보낸 한글 메시지. 로그인 문제는 "UNAUTHORIZED"
export const toVolunteerError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "UNAUTHORIZED";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-11-20" -> {month: "11월", day: "20", weekday: "목"} (달력 칸)
export const dateParts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return {month: `${m}월`, day: String(d), weekday: WEEKDAYS[new Date(y, m - 1, d).getDay()]};
};

// "11월 20일 (목) 10:00~12:00"
export const formatVolunteerWhen = (post: Pick<VolunteerPost, "activityDate" | "startTime" | "endTime">) => {
  const {month, day, weekday} = dateParts(post.activityDate);
  return `${month} ${day}일 (${weekday}) ${post.startTime}~${post.endTime}`;
};

// 목록·상세 모집 배지. 남은 자리가 2명 이하면 "마감 임박"
export const volunteerBadge = (post: VolunteerPost): {label: string; tone: "open" | "soon" | "done"} => {
  if (post.state === "CLOSED") return {label: "모집 마감", tone: "done"};
  if (post.state === "FULL") return {label: "정원 마감", tone: "done"};
  if (post.capacity - post.appliedCount <= 2) return {label: "마감 임박", tone: "soon"};
  return {label: "모집 중", tone: "open"};
};
