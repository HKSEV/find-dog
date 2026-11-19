"use client";

import DetailById from "@/app/components/DetailById";
import ProfileView from "./ProfileView";

// 💡 회원 프로필 (/profile/?id=회원 번호): 글 상세의 글쓴이, 채팅 상대
export default function ProfilePage() {
  return <DetailById component={ProfileView}/>;
};
