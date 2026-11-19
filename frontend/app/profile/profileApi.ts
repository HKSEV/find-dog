// 💡 회원 공개 프로필 (로그인 없이도): 닉네임·사진·쓴 글
import axios from "axios";

export interface ProfilePost {
  id: number;
  title: string;
  kind: string; // 실종·제보: LOST / FOUND, 커뮤니티: 카테고리
  status: "MISSING" | "COMPLETED" | null;
  image: string | null;
  createdAt: string | null;
}

export interface MemberProfile {
  id: number;
  nickname: string;
  image: string | null;
  missingPosts: ProfilePost[];
  communityPosts: ProfilePost[];
}

export const fetchMemberProfile = async (id: number) => (await axios.get<MemberProfile>(`/api/members/${id}/profile`)).data;
