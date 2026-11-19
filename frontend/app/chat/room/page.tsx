"use client";

import DetailById from "@/app/components/DetailById";
import ChatRoomView from "./ChatRoomView";

// 💡 채팅방 (/chat/room/?id=3)
export default function ChatRoomPage() {
  return <DetailById component={ChatRoomView}/>;
};
