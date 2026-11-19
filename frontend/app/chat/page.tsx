"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { loginHref } from "@/app/components/loginLink";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";
import { toImageUrl } from "../shelter/animalFormat";
import { ChatRoom, chatTime, fetchChatRooms } from "./chatApi";
import * as S from "@/assets/css/Style.styles";

const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getHasToken = () => Boolean(localStorage.getItem("token"));

// 💡 채팅 탭: 실종·목격 글로 시작한 1:1 대화 목록 (최근 대화 순, 안 읽은 수)
//    목록은 30초마다 다시 받아서 새 메시지를 반영
export default function ChatListPage() {
  const hasToken = useSyncExternalStore(subscribeStorage, getHasToken, () => null);
  const collapsed = useScrollCollapse();
  const [rooms, setRooms] = useState<ChatRoom[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!hasToken) return;
    let alive = true;
    const load = () => fetchChatRooms()
      .then((list) => {
        if (!alive) return;
        setRooms(list);
        setFailed(false);
      })
      .catch(() => alive && setFailed(true));
    load();
    const timer = setInterval(load, 30000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [hasToken]);

  const renderBody = () => {
    if (hasToken === false) {
      return (
        <S.WriteLoginNotice>
          <p>로그인하면 실종·목격 글을 쓴 사람과<br/>번호 없이 채팅할 수 있어요</p>
          <Link href={loginHref("/chat")}>로그인</Link>
        </S.WriteLoginNotice>
      );
    };
    if (failed && !rooms) return <S.ChatEmpty>채팅 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.</S.ChatEmpty>;
    if (!rooms) return <S.ChatEmpty>불러오는 중이에요</S.ChatEmpty>;
    if (rooms.length === 0) {
      return (
        <S.ChatEmpty>
          <S.ChatEmptyIcon aria-hidden="true"/>
          아직 대화가 없어요.<br/>실종·목격 글에서 &quot;채팅하기&quot;를 눌러 연락해 보세요.
        </S.ChatEmpty>
      );
    };
    return (
      <S.ChatList>
        {rooms.map((room) => {
          const thumb = toImageUrl(room.postImage ?? undefined);
          return (
            <li key={room.id}>
              <S.ChatRow as={Link} href={`/chat/room/?id=${room.id}`}>
                {thumb ? <S.ChatThumb src={thumb} alt=""/> : <S.ChatThumbEmpty aria-hidden="true"><S.ChatPinIcon/></S.ChatThumbEmpty>}
                <S.ChatRowBody>
                  <strong>{room.otherNickname}</strong>
                  <small>{chatTime(room.lastMessageAt)}</small>
                  <p>{room.blocked ? "종료된 대화예요" : room.lastMessage || "대화를 시작해 보세요"}</p>
                  <em>{room.postType === "FOUND" ? "목격" : "실종"} · {room.postTitle}{room.postStatus === "COMPLETED" ? " · 찾았어요" : ""}</em>
                </S.ChatRowBody>
                {room.unread > 0 && <S.ChatUnread aria-label={`안 읽은 메시지 ${room.unread}개`}>{room.unread > 99 ? "99+" : room.unread}</S.ChatUnread>}
              </S.ChatRow>
            </li>
          );
        })}
      </S.ChatList>
    );
  };

  return (
    <S.AppWrapper>
      <Header title="채팅" isTab hidden={collapsed}/>
      <S.Container>
        <S.HeaderOffset/>
        {renderBody()}
        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
