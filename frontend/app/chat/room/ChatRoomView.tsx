"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import MapPicker from "@/app/components/map/MapPicker";
import { kakaoMapLink } from "@/app/components/map/kakaoMap";
import { showToast } from "@/app/components/Toast";
import { loginHref } from "@/app/components/loginLink";
import { useImeSafeSubmit } from "@/app/components/imeSafeSubmit";
import { toImageUrl } from "../../shelter/animalFormat";
import { ChatMessage, ChatRoom, chatTime, fetchChatMessages, fetchChatRoom, sendChatMessage, toChatError } from "../chatApi";
import ChatReportSheet from "./ChatReportSheet";
import * as S from "@/assets/css/Style.styles";

const POLL_MS = 3000; // 새 메시지 확인 간격

// 💡 채팅방: 위에 글 카드 고정, 메시지(글·위치), 아래 입력창
//    새 메시지는 3초마다 마지막 메시지 뒤로 받아 붙임 (실시간 연결 대신 간단한 방식)
export default function ChatRoomView({id}: {id: number}) {
  const router = useRouter();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "missing" | "login">("loading");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const lastIdRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const imeSafeSubmit = useImeSafeSubmit();

  // 받은 메시지 붙이기 (같은 메시지가 두 번 오지 않게 id로 거름)
  const append = useCallback((list: ChatMessage[]) => {
    if (list.length === 0) return;
    lastIdRef.current = Math.max(lastIdRef.current, ...list.map((message) => message.id));
    setMessages((prev) => {
      const seen = new Set(prev.map((message) => message.id));
      return [...prev, ...list.filter((message) => !seen.has(message.id))];
    });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace(loginHref(`/chat/room/?id=${id}`));
      return;
    };
    let alive = true;
    fetchChatRoom(id)
      .then((data) => {
        if (!alive) return;
        setRoom(data);
        setStatus("ready");
      })
      .catch((error) => alive && setStatus(toChatError(error, "").includes("로그인") ? "login" : "missing"));
    return () => {
      alive = false;
    };
  }, [id, router]);

  // 처음 메시지 + 3초마다 새 메시지 (화면이 숨어 있으면 쉼)
  useEffect(() => {
    if (status !== "ready") return;
    let alive = true;
    const poll = () => {
      if (document.hidden) return;
      fetchChatMessages(id, lastIdRef.current)
        .then((list) => alive && append(list))
        .catch(() => {});
    };
    poll();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [id, status, append]);

  // 새 메시지가 오면 아래로
  useEffect(() => {
    bottomRef.current?.scrollIntoView({block: "end"});
  }, [messages.length]);

  const send = async (body: Parameters<typeof sendChatMessage>[1]) => {
    setSending(true);
    try {
      append([await sendChatMessage(id, body)]);
      return true;
    } catch (error) {
      showToast(toChatError(error, "보내지 못했어요. 잠시 후 다시 시도해 주세요."));
      // 상대가 차단했거나 운영팀이 종료했으면 입력창을 안내로 바꿈
      fetchChatRoom(id).then(setRoom).catch(() => {});
      return false;
    } finally {
      setSending(false);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content || sending) return;
    if (await send({type: "TEXT", content})) setText("");
  };

  const header = (
    <Header
    title={room?.otherNickname ?? "채팅"}
    onBackClick={() => (window.history.length > 1 ? router.back() : router.push("/chat"))}
    action={room ? (
      <S.HeaderRoundButton type="button" aria-label="신고하기" title="신고하기" onClick={() => setReportOpen(true)}>
        <S.ChatReportIcon aria-hidden="true"/>
      </S.HeaderRoundButton>
    ) : undefined}/>
  );

  if (status !== "ready" || !room) {
    return (
      <S.AppWrapper>
        <S.Container>
          {header}
          <S.HeaderOffset/>
          <S.ChatEmpty>{status === "loading" ? "불러오는 중이에요" : status === "login" ? "다시 로그인해 주세요" : "대화방을 찾을 수 없어요"}</S.ChatEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const thumb = toImageUrl(room.postImage ?? undefined);

  return (
    <S.AppWrapper>
      <S.Container>
        {header}
        <S.HeaderOffset/>

        {/* 어떤 글에 대한 대화인지 (누르면 글로) */}
        <S.ChatPostCard as={Link} href={`/missing/detail/?id=${room.postId}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- 정적 내보내기라 next/image 최적화를 쓰지 않음 */}
          {thumb ? <img src={thumb} alt=""/> : <span data-empty aria-hidden="true"/>}
          <div>
            <strong>{room.postTitle}</strong>
            <small>{room.postType === "FOUND" ? "목격 제보" : "실종 신고"}{room.postStatus === "COMPLETED" ? " · 찾았어요" : ""}{room.iAmOwner ? " · 내 글" : ""}</small>
          </div>
          <S.MapCardChevron aria-hidden="true"/>
        </S.ChatPostCard>

        <S.ChatMessages>
          <S.ChatNotice>전화번호 없이 대화해요. 연락처는 꼭 필요할 때만 알려 주세요.</S.ChatNotice>
          {messages.map((message) => (
            <S.ChatBubbleRow key={message.id} $mine={message.mine}>
              {message.type === "LOCATION" && message.lat != null && message.lng != null ? (
                <S.ChatLocation
                $mine={message.mine}
                href={kakaoMapLink(message.content || "알려준 위치", {lat: message.lat, lng: message.lng})}
                target="_blank"
                rel="noopener noreferrer">
                  <div><S.ChatPinIcon aria-hidden="true"/></div>
                  <p>{message.content || "위치를 보냈어요"}<small>카카오맵에서 보기 ›</small></p>
                </S.ChatLocation>
              ) : (
                <S.ChatBubble $mine={message.mine}>{message.content}</S.ChatBubble>
              )}
              <time dateTime={message.createdAt}>{chatTime(message.createdAt)}</time>
            </S.ChatBubbleRow>
          ))}
          <div ref={bottomRef}/>
        </S.ChatMessages>

        {room.blocked ? (
          <S.ChatClosedBar role="status">종료된 대화예요. 메시지를 보낼 수 없어요.</S.ChatClosedBar>
        ) : (
          <S.ChatInputBar onSubmit={handleSubmit}>
            <S.ChatIconButton type="button" aria-label="위치 보내기" onClick={() => setPickerOpen(true)}>
              <S.ChatPinIcon/>
            </S.ChatIconButton>
            <textarea
            rows={1}
            aria-label="메시지"
            placeholder="메시지 보내기"
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              // Enter 로 보내기 (Shift+Enter 는 줄바꿈, 한글 조합 중 Enter 는 무시)
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                e.currentTarget.form?.requestSubmit();
              };
            }}/>
            <S.ChatIconButton type="submit" $primary aria-label="보내기" disabled={sending || !text.trim()} {...imeSafeSubmit}>
              <S.ChatSendIcon/>
            </S.ChatIconButton>
          </S.ChatInputBar>
        )}
      </S.Container>

      {reportOpen && (
        <ChatReportSheet
        roomId={room.id}
        otherNickname={room.otherNickname}
        onClose={() => setReportOpen(false)}
        onReported={(blocked) => {
          setReportOpen(false);
          if (blocked) setRoom({...room, blocked: true});
        }}/>
      )}

      {pickerOpen && (
        <MapPicker
        onClose={() => setPickerOpen(false)}
        onSelect={(place) => {
          setPickerOpen(false);
          send({type: "LOCATION", content: place.address.slice(0, 100), lat: place.lat, lng: place.lng});
        }}/>
      )}
    </S.AppWrapper>
  );
};
