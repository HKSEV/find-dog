// 💡 입양 신청 API (로그인 토큰 필요)
//    공용 store.ts를 건드리지 않으려고 Redux slice 대신 화면에서 바로 부름
import axios from "axios";

export type ApplicationStatus = "RECEIVED" | "FORWARDED" | "ADOPTED" | "REJECTED" | "CANCELED";
export type HousingType = "APARTMENT" | "HOUSE" | "OTHER";

export interface AdoptionApplication {
  id: number;
  status: ApplicationStatus;
  statusReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  applicantName: string;
  applicantPhone: string;
  housingType: HousingType;
  hasPetExperience: boolean;
  familyAgreed: boolean;
  message?: string;
  animalId: number;
  animalBreed: string;
  animalGender?: string;
  animalImageUrl?: string;
  animalNoticeNo?: string;
  animalRegDate?: string;
  animalRescueLocation?: string;
}

export interface AdoptionApplicationRequest {
  shelterAnimalId: number;
  applicantName: string;
  applicantPhone: string;
  housingType: HousingType;
  hasPetExperience: boolean;
  familyAgreed: boolean;
  message: string;
  agreeToShare: boolean;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

// 서버가 보낸 한글 메시지를 꺼냄. 로그인 문제는 "UNAUTHORIZED"로 통일
export const toApplicationError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "UNAUTHORIZED";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};

export const fetchApplyPrefill = async () =>
  (await axios.get<{name: string; phone: string}>("/api/adoption-applications/prefill", {headers: authHeader()})).data;

export const submitApplication = async (request: AdoptionApplicationRequest) =>
  (await axios.post<AdoptionApplication>("/api/adoption-applications", request, {headers: authHeader()})).data;

export const fetchMyApplications = async () =>
  (await axios.get<AdoptionApplication[]>("/api/adoption-applications/mine", {headers: authHeader()})).data;

export const cancelApplication = async (id: number) =>
  (await axios.patch<AdoptionApplication>(`/api/adoption-applications/${id}/cancel`, null, {headers: authHeader()})).data;

// 아직 끝나지 않은 신청 (접수, 보호소에 전달)
export const isActiveApplication = (status: ApplicationStatus) => status === "RECEIVED" || status === "FORWARDED";

export const housingLabel: Record<HousingType, string> = {APARTMENT: "아파트", HOUSE: "주택", OTHER: "기타"};

// 내역 화면의 3단계: 접수 -> 보호소에 전달 -> 결과
export const applicationSteps = ["접수", "보호소에 전달", "결과"];

export const applicationStepIndex = (status: ApplicationStatus) =>
  status === "RECEIVED" ? 0 : status === "FORWARDED" ? 1 : 2;

// 상태 문구 (입양 불가는 차갑지 않게)
export const applicationStatusText: Record<ApplicationStatus, string> = {
  RECEIVED: "신청서를 받았어요",
  FORWARDED: "보호소에 전달했어요",
  ADOPTED: "입양이 확정됐어요",
  REJECTED: "이번엔 함께하지 못했어요",
  CANCELED: "신청을 취소했어요"
};

export const applicationStatusHint: Record<ApplicationStatus, string> = {
  RECEIVED: "운영팀이 확인한 뒤 보호소에 전달해요.",
  FORWARDED: "보호소에서 적어 주신 연락처로 직접 연락드려요.",
  ADOPTED: "새 가족이 된 걸 축하해요!",
  REJECTED: "다른 친구들도 새 가족을 기다리고 있어요.",
  CANCELED: ""
};
