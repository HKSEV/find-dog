"use client";
import React, { useEffect, useState } from "react";
//nextjs에서 바뀌는것..
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home as HomeIcon,
  VolunteerActivismOutlined as AdoptIcon,
  Campaign as CampaignIcon,
  PersonOutlined as PersonOutlineIcon,
  ChatBubbleOutlineRounded as ChatIcon
} from "@mui/icons-material";
import { fetchChatUnread } from "../chat/chatApi";
import * as S from "@/assets/css/Style.styles";

// 💡 하단 탭: 홈 / 실종·제보 / 함께해요(입양·봉사·이야기) / 채팅 / 마이
//    also: 함께 선택된 것으로 볼 하위 경로 (보호 동물·봉사·이야기 글 상세와 글쓰기)
const tabs = [
  {href: "/", label: "홈", icon: <HomeIcon/>},
  {href: "/missing", label: "실종·제보", icon: <CampaignIcon/>},
  {href: "/shelter", label: "함께해요", icon: <AdoptIcon/>, also: ["/volunteer", "/story"]},
  {href: "/chat", label: "채팅", icon: <ChatIcon/>},
  {href: "/mypage", label: "마이", icon: <PersonOutlineIcon/>}
];

// 안 읽은 채팅 수 (로그인했을 때만, 30초마다)
const CHAT_POLL_MS = 30000;

export default function Footer() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    let alive = true;
    const load = () => fetchChatUnread().then((count) => alive && setUnread(count)).catch(() => {});
    load();
    const timer = setInterval(load, CHAT_POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [pathname]);

  // 홈은 정확히 "/"일 때만, 나머지는 하위 경로까지 선택된 탭으로 표시
  const isActive = (tab: (typeof tabs)[number]) =>
    tab.href === "/" ? pathname === "/" : [tab.href, ...(tab.also ?? [])].some((path) => pathname.startsWith(path));

  return (
    <S.BottomNav>
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={isActive(tab) ? "page" : undefined}>
          <S.NavItem $active={isActive(tab)}>
            <S.NavIconWrap>
              {tab.icon}
              {tab.href === "/chat" && unread > 0 && <S.NavBadge aria-label={`안 읽은 채팅 ${unread}개`}>{unread > 99 ? "99+" : unread}</S.NavBadge>}
            </S.NavIconWrap>
            <span>{tab.label}</span>
          </S.NavItem>
        </Link>
      ))}
    </S.BottomNav>
  );
};
