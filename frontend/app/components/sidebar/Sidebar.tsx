"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBullhorn } from "react-icons/fa";
import { FiCalendar, FiChevronLeft, FiChevronRight, FiClipboard, FiGrid, FiHeart, FiHome, FiMapPin, FiMessageSquare, FiVideo } from "react-icons/fi";
import AdminLogoIcon from "../AdminLogoIcon";
import { adminOperationHref } from "@/lib/adminOperations";
import * as S from "@/assets/css/Style.styles";

const menuGroups = [
  {title: "", items: [{href: "/admin", label: "대시보드", icon: FiGrid}]},
  {title: "홈", items: [
    {href: "/admin/campaign", label: "캠페인", icon: FaBullhorn},
    {href: adminOperationHref("need-help"), label: "도움 요청", icon: FiHeart}
  ]},
  {title: "입양·봉사", items: [
    {href: "/admin/sheltersetting", label: "보호 동물", icon: FiHome},
    {href: adminOperationHref("adoptions"), label: "입양 신청", icon: FiClipboard},
    {href: adminOperationHref("volunteers"), label: "봉사 모집", icon: FiCalendar}
  ]},
  {title: "실종·제보", items: [{href: adminOperationHref("missing"), label: "실종·제보 글", icon: FiMapPin}]},
  {title: "커뮤니티", items: [
    {href: "/admin/intergrate", label: "보호소 소식·영상", icon: FiVideo},
    {href: adminOperationHref("community"), label: "회원 게시물", icon: FiMessageSquare}
  ]}
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <S.SidebarContainer $isCollapsed={isCollapsed} aria-label="관리자 사이드바">
      <S.SidebarBrand
      href="/admin"
      $isCollapsed={isCollapsed}
      aria-label="어서찾아주개 관리자 페이지"
      title="어서찾아주개 관리자 페이지">
        <S.SidebarBrandIcon>
          <AdminLogoIcon/>
        </S.SidebarBrandIcon>
        <S.SidebarContentBrandText $isCollapsed={isCollapsed}>
          어서찾아주개 <span>관리자 페이지</span>
        </S.SidebarContentBrandText>
      </S.SidebarBrand>
      <S.BrandDivider/>

      <S.SidebarNavigation id="admin-sidebar-menu" aria-label="관리자 메뉴">
        {menuGroups.map(({title, items}) => (
          <div key={title || "dashboard"}>
            {title && <S.SidebarGroupLabel $isCollapsed={isCollapsed}>{title}</S.SidebarGroupLabel>}
            <S.SidebarMenu aria-label={title || undefined}>
              {items.map(({href, label, icon: Icon}) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));
                return (
                  <S.SidebarNavItem key={href}>
                    <S.NavLink
                    href={href}
                    $isCollapsed={isCollapsed}
                    $isActive={isActive}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={label}
                    title={label}>
                      <Icon aria-hidden="true"/>
                      <span>{label}</span>
                    </S.NavLink>
                  </S.SidebarNavItem>
                );
              })}
            </S.SidebarMenu>
          </div>
        ))}
      </S.SidebarNavigation>

      <S.ToggleButtonWrapper>
        <S.ToggleButton
        type="button"
        onClick={() => setIsCollapsed((previous) => !previous)}
        aria-label={isCollapsed ? "사이드바 펼치기" : "사이드바 접기"}
        aria-expanded={!isCollapsed}
        aria-controls="admin-sidebar-menu">
          {isCollapsed ? <FiChevronRight aria-hidden="true"/> : <FiChevronLeft aria-hidden="true"/>}
        </S.ToggleButton>
      </S.ToggleButtonWrapper>
    </S.SidebarContainer>
  );
};
