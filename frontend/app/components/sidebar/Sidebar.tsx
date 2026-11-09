"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import { FiGrid, FiSpeaker, FiLayers, FiHome, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AdminLogoIcon from "../AdminLogoIcon";
import * as S from "@/assets/css/Style.styles";

const menuItems = [
  {href: "/admin", label: "Dashboard", icon: FiGrid},
  {href: "/admin/pick", label: "추천동물설정", icon: FaPaw},
  {href: "/admin/campaign", label: "캠페인", icon: FiSpeaker},
  {href: "/admin/intergrate", label: "통합게시물설정", icon: FiLayers},
  {href: "/admin/sheltersetting", label: "보호소 설정", icon: FiHome}
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
        <S.SidebarMenu>
          {menuItems.map(({href, label, icon: Icon}) => {
            const isActive =
              href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
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
