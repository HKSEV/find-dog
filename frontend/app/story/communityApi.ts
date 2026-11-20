// 💡 커뮤니티 회원 글 API (자유 이야기, 입양 후기, 구조 이야기, 질문)
//    공용 store.ts를 건드리지 않으려고 Redux slice 대신 화면에서 바로 부름
import axios from "axios";
import type { ReportReason } from "../components/ReportSheet";

export type CommunityCategory = "FREE" | "ADOPTION_REVIEW" | "RESCUE_STORY" | "QUESTION";

export interface CommunityPost {
  id: number;
  category: CommunityCategory;
  title: string;
  content: string;
  mediaUrls: string[];
  authorName: string;
  authorImageUrl?: string | null;
  authorId?: number | null; // 글쓴이 프로필 (/profile/?id=)
  mine: boolean;
  createdAt: string;
  updatedAt?: string;
  likeCount: number;    // 공감(하트) 수
  commentCount: number; // 댓글 수
  liked: boolean;       // 내가 공감했는지 (상세에서 로그인했을 때만)
}

export interface CommunityComment {
  id: number;
  content: string;
  authorName: string;
  authorImageUrl?: string | null;
  authorId?: number | null;
  mine: boolean; // 내가 쓴 댓글 (지우기 버튼)
  createdAt: string;
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

// keyword: 검색어 (제목·내용, 함께해요 헤더 돋보기)
export const fetchCommunityPosts = async (category?: CommunityCategory, cursorId?: number, size = PAGE_SIZE, keyword?: string) =>
  (await axios.get<CommunityPost[]>("/api/community-posts", {params: {category, cursorId, size, keyword: keyword || undefined}})).data;

export const fetchMyCommunityPosts = async () =>
  (await axios.get<CommunityPost[]>("/api/community-posts/mine", {headers: authHeader()})).data;

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

// 💡 공감(하트): 켜기·끄기 → 지금 상태와 수
export const setCommunityLike = async (id: number, on: boolean) => {
  const url = `/api/community-posts/${id}/like`;
  const config = {headers: authHeader()};
  return (on ? await axios.put<{liked: boolean; likeCount: number}>(url, null, config) : await axios.delete<{liked: boolean; likeCount: number}>(url, config)).data;
};

// 💡 댓글: 목록(오래된 순), 쓰기·지우기(로그인)
export const fetchComments = async (id: number) =>
  (await axios.get<CommunityComment[]>(`/api/community-posts/${id}/comments`, {headers: authHeader()})).data;

export const addComment = async (id: number, content: string) =>
  (await axios.post<CommunityComment>(`/api/community-posts/${id}/comments`, {content}, {headers: authHeader()})).data;

export const deleteComment = async (id: number, commentId: number) => {
  await axios.delete(`/api/community-posts/${id}/comments/${commentId}`, {headers: authHeader()});
};

export const COMMENT_MAX = 500;

// 💡 글 신고 (로그인 필요, 내 글은 불가)
export const communityReportReasons: {value: ReportReason; label: string}[] = [
  {value: "SPAM", label: "광고·홍보 글이에요"},
  {value: "ABUSE", label: "욕설·혐오·부적절한 사진이 있어요"},
  {value: "PRIVACY", label: "개인정보가 드러나 있어요"},
  {value: "FAKE", label: "거짓 정보예요"},
  {value: "ETC", label: "기타"}
];
export const reportCommunityPost = async (id: number, body: {reason: ReportReason; detail?: string}) =>
  (await axios.post<{message: string}>(`/api/community-posts/${id}/report`, body, {headers: authHeader()})).data.message;

export const toCommunityError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "UNAUTHORIZED";
    if (typeof error.response?.data === "string" && error.response.data) return error.response.data;
  };
  return fallback;
};
