"use client";

import DetailById from "@/app/components/DetailById";
import ChatProfileView from "./ChatProfileView";

// 💡 채팅 상대 프로필 (/chat/profile/?id=대화방 번호)
export default function ChatProfilePage() {
  return <DetailById component={ChatProfileView}/>;
};
