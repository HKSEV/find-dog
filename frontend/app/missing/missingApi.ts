// 💡 실종 글 관리 (작성자만): 찾았어요로 바꾸기, 수정, 삭제
import axios from "axios";
import { MissingAnimal, missingAuthHeader } from "../redux/missingSlice";
import type { ReportReason } from "../components/ReportSheet";

export interface MissingUpdateRequest {
  type: "LOST" | "FOUND";
  title: string;
  petName: string; // 아이 이름 (목격 글은 빈 값)
  breed: string;
  color: string;
  gender: string;
  age: string;
  weight: string;
  rescueLocation: string;
  occurredAt: string | null;
  occurredTime: string | null;
  lat: number | null;
  lng: number | null;
  content: string;
}

// 근처 글: 실종 글이면 근처 목격 제보, 목격 글이면 근처 실종 신고 (3km 안, 가까운 순)
export const fetchNearbyPosts = async (id: number) =>
  (await axios.get<MissingAnimal[]>(`/api/missing-posts/${id}/nearby`)).data;

export const completeMissingPost = (id: number) =>
  axios.patch(`/api/missing-posts/${id}/complete`, null, {headers: missingAuthHeader()});

export const deleteMissingPost = (id: number) =>
  axios.delete(`/api/missing-posts/${id}`, {headers: missingAuthHeader()});

export const updateMissingPost = async (id: number, body: MissingUpdateRequest) =>
  (await axios.put<MissingAnimal>(`/api/missing-posts/${id}`, body, {headers: missingAuthHeader()})).data;

// 💡 글 신고 (로그인 필요, 내 글은 불가)
export const missingReportReasons: {value: ReportReason; label: string}[] = [
  {value: "FAKE", label: "거짓 글이거나 사례금을 노린 사기 같아요"},
  {value: "SPAM", label: "광고·홍보 글이에요"},
  {value: "PRIVACY", label: "개인정보가 드러나 있어요"},
  {value: "ABUSE", label: "욕설·혐오·부적절한 사진이 있어요"},
  {value: "ETC", label: "기타"}
];
export const reportMissingPost = async (id: number, body: {reason: ReportReason; detail?: string}) =>
  (await axios.post<{message: string}>(`/api/missing-posts/${id}/report`, body, {headers: missingAuthHeader()})).data.message;

// 서버가 보낸 한글 메시지 (401은 로그인 다시)
export const toMissingError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "로그인이 끝났어요. 다시 로그인해 주세요.";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};
