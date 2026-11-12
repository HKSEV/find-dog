// 💡 실종 글 관리 (작성자만): 찾았어요로 바꾸기, 수정, 삭제
import axios from "axios";
import { MissingAnimal, missingAuthHeader } from "../redux/missingSlice";

export interface MissingUpdateRequest {
  type: "LOST" | "FOUND";
  title: string;
  breed: string;
  color: string;
  gender: string;
  age: string;
  weight: string;
  rescueLocation: string;
  occurredAt: string | null;
  content: string;
}

export const completeMissingPost = (id: number) =>
  axios.patch(`/api/missing-posts/${id}/complete`, null, {headers: missingAuthHeader()});

export const deleteMissingPost = (id: number) =>
  axios.delete(`/api/missing-posts/${id}`, {headers: missingAuthHeader()});

export const updateMissingPost = async (id: number, body: MissingUpdateRequest) =>
  (await axios.put<MissingAnimal>(`/api/missing-posts/${id}`, body, {headers: missingAuthHeader()})).data;

// 서버가 보낸 한글 메시지 (401은 로그인 다시)
export const toMissingError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "로그인이 끝났어요. 다시 로그인해 주세요.";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};
