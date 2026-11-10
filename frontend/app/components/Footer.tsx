"use client";
import React from "react";
//nextjs에서 바뀌는것..
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home as HomeIcon,
  VolunteerActivismOutlined as AdoptIcon,
  Campaign as CampaignIcon,
  ChatBubbleOutlineOutlined as CommunityIcon,
  PersonOutlined as PersonOutlineIcon
} from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

// 💡 하단 탭: 홈 / 입양·봉사 / 실종·제보 / 커뮤니티 / 마이
const tabs = [
  {href: "/", label: "홈", icon: <HomeIcon/>},
  {href: "/shelter", label: "입양·봉사", icon: <AdoptIcon/>},
  {href: "/missing", label: "실종·제보", icon: <CampaignIcon/>},
  {href: "/story", label: "커뮤니티", icon: <CommunityIcon/>},
  {href: "/mypage", label: "마이", icon: <PersonOutlineIcon/>}
];

export default function Footer() {
  const pathname = usePathname();

  // 홈은 정확히 "/"일 때만, 나머지는 하위 경로까지 선택된 탭으로 표시
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <S.BottomNav>
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} aria-current={isActive(tab.href) ? "page" : undefined}>
          <S.NavItem $active={isActive(tab.href)}>
            {tab.icon}
            <span>{tab.label}</span>
          </S.NavItem>
        </Link>
      ))}
    </S.BottomNav>
  );
};
