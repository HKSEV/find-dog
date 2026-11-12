// 💡 내 정보 조회·수정 (마이 > 설정 > 정보 수정). 로그인 토큰 필요
import axios from "axios";

export interface MyAccount {
  email: string;
  nickname: string;
  name: string;
  phone: string;
  address?: string | null;
  profileImageUrl?: string | null;
  userType?: string;
  provider?: string;
}

export interface MyAccountUpdate {
  nickname: string;
  name: string;
  phone: string;
  address: string;
  profileImageUrl?: string | null; // null: 그대로, "": 지움
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const fetchMyAccount = async () => (await axios.get<MyAccount>("/api/members/me", {headers: authHeader()})).data;

export const updateMyAccount = async (body: MyAccountUpdate) =>
  (await axios.put<MyAccount>("/api/members/me", body, {headers: authHeader()})).data;

// 프로필 사진 올리기 (회원가입과 같은 API). 올린 사진 주소를 돌려줌
export const uploadProfileImage = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  return (await axios.post<string>("/api/members/upload-profile", data)).data;
};

export const toAccountError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "UNAUTHORIZED";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};
