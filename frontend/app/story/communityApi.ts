// 💡 커뮤니티 회원 글 API (자유 이야기, 입양 후기, 구조 이야기, 질문)
//    공용 store.ts를 건드리지 않으려고 Redux slice 대신 화면에서 바로 부름
import axios from "axios";

export type CommunityCategory = "FREE" | "ADOPTION_REVIEW" | "RESCUE_STORY" | "QUESTION";

export interface CommunityPost {
  id: number;
  category: CommunityCategory;
  title: string;
  content: string;
  mediaUrls: string[];
  authorName: string;
  authorImageUrl?: string | null;
  mine: boolean;
  createdAt: string;
  updatedAt?: string;
}

// 화면에 보이는 분류 이름 <-> 서버 값
export const communityCategories: {label: string; value: CommunityCategory}[] = [
  {label: "자유 이야기", value: "FREE"},
  {label: "입양 후기", value: "ADOPTION_REVIEW"},
  {label: "구조 이야기", value: "RESCUE_STORY"},
  {label: "질문", value: "QUESTION"}
];

export const categoryLabel = (value: CommunityCategory) =>
  communityCategories.find((item) => item.value === value)?.label ?? "이야기";

export const categoryValue = (label: string) => communityCategories.find((item) => item.label === label)?.value;

const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? {Authorization: `Bearer ${token}`} : {};
};

export const PAGE_SIZE = 10;

export const fetchCommunityPosts = async (category?: CommunityCategory, cursorId?: number, size = PAGE_SIZE) =>
  (await axios.get<CommunityPost[]>("/api/community-posts", {params: {category, cursorId, size}})).data;

export const fetchCommunityPost = async (id: number) =>
  (await axios.get<CommunityPost>(`/api/community-posts/${id}`, {headers: authHeader()})).data;

// 쓰기·고치기: dto(JSON) + files(새 사진). 고칠 때 keepMediaUrls로 남길 기존 사진을 알려 줌
const toFormData = (dto: {category: CommunityCategory; title: string; content: string; keepMediaUrls?: string[]}, files: File[]) => {
  const data = new FormData();
  data.append("dto", new Blob([JSON.stringify(dto)], {type: "application/json"}));
  files.forEach((file) => data.append("files", file));
  return data;
};

export const createCommunityPost = async (dto: {category: CommunityCategory; title: string; content: string}, files: File[]) =>
  (await axios.post<CommunityPost>("/api/community-posts", toFormData(dto, files), {headers: authHeader()})).data;

export const updateCommunityPost = async (
  id: number,
  dto: {category: CommunityCategory; title: string; content: string; keepMediaUrls: string[]},
  files: File[]
) => (await axios.put<CommunityPost>(`/api/community-posts/${id}`, toFormData(dto, files), {headers: authHeader()})).data;

export const deleteCommunityPost = async (id: number) => {
  await axios.delete(`/api/community-posts/${id}`, {headers: authHeader()});
};

export const toCommunityError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "UNAUTHORIZED";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};
