"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { loginHref } from "@/app/components/loginLink";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";
import { toImageUrl } from "../shelter/animalFormat";
import { ChatRoom, chatTime, fetchChatRooms } from "./chatApi";
import ProfileAvatar from "@/app/components/ProfileAvatar";
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
  // 💡 검색 (다른 탭과 같은 방식): 상대 닉네임, 글 제목, 마지막 메시지로 대화방 찾기
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText("");
  };
  const collapsed = useScrollCollapse() && !searchOpen;
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
    const words = searchText.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const shown = words.length === 0 ? rooms : rooms.filter((room) => {
      const text = `${room.otherNickname} ${room.postTitle} ${room.lastMessage ?? ""}`.toLowerCase();
      return words.every((word) => text.includes(word));
    });
    if (shown.length === 0) return <S.ChatEmpty>&quot;{searchText.trim()}&quot;에 맞는 대화가 없어요</S.ChatEmpty>;
    return (
      <S.ChatList>
        {shown.map((room) => {
          const thumb = toImageUrl(room.postImage ?? undefined);
          return (
            <li key={room.id}>
              <S.ChatRow as={Link} href={`/chat/room/?id=${room.id}`}>
                <ProfileAvatar image={room.otherImage} size={48}/>
                <S.ChatRowBody>
                  <strong>{room.otherNickname}</strong>
                  <small>{chatTime(room.lastMessageAt)}</small>
                  <p>{room.blocked ? "종료된 대화예요" : room.otherLeft ? "상대가 대화방을 나갔어요" : room.lastMessage || "대화를 시작해 보세요"}</p>
                  <em>{room.postType === "FOUND" ? "목격" : "실종"} · {room.postTitle}{room.postStatus === "COMPLETED" ? " · 찾았어요" : ""}</em>
                </S.ChatRowBody>
                {room.unread > 0 && <S.ChatUnread aria-label={`안 읽은 메시지 ${room.unread}개`}>{room.unread > 99 ? "99+" : room.unread}</S.ChatUnread>}
                {/* 어떤 글로 시작한 대화인지 (글 사진) */}
                {thumb ? <S.ChatThumb src={thumb} alt=""/> : <S.ChatThumbEmpty aria-hidden="true"><S.ChatPinIcon/></S.ChatThumbEmpty>}
              </S.ChatRow>
            </li>
          );
        })}
      </S.ChatList>
    );
  };

  return (
    <S.AppWrapper>
      {searchOpen ? (
        <S.SearchBar role="search">
          <S.SearchBackButton type="button" aria-label="검색 닫기" onClick={closeSearch}>
            <S.SearchBackIcon/>
          </S.SearchBackButton>
          <S.SearchField>
            <S.HeaderSearchIcon aria-hidden="true"/>
            <input
            ref={searchInputRef}
            type="search"
            enterKeyHint="search"
            aria-label="채팅 검색"
            placeholder="닉네임, 글 이름, 메시지"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}/>
            {searchText && (
              <S.SearchClearButton type="button" aria-label="검색어 지우기" onClick={() => setSearchText("")}>
                <S.SearchClearIcon/>
              </S.SearchClearButton>
            )}
          </S.SearchField>
        </S.SearchBar>
      ) : (
        <Header
        title="채팅"
        isTab
        hidden={collapsed}
        action={hasToken ? (
          <S.HeaderRoundButton type="button" aria-label="채팅 검색" onClick={() => setSearchOpen(true)}>
            <S.HeaderSearchIcon/>
          </S.HeaderRoundButton>
        ) : undefined}/>
      )}
      <S.Container>
        <S.HeaderOffset/>
        {renderBody()}
        <Footer/>
      </S.Container>
    </S.AppWrapper>
  );
};
