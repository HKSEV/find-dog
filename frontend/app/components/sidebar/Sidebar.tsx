"use client";

import React, { useState } from "react";
// 💡 길게 나열했던 스타일 컴포넌트들을 'S'라는 바구니(별칭) 하나로 깔끔하게 묶어옵니다!

import AdminLogoIcon from "../../components/AdminLogoIcon";
import * as S from "@/assets/css/Style.styles";

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <S.SidebarContainer $isCollapsed={isCollapsed}>
      <S.SidebarBrand href="/admin" $isCollapsed={isCollapsed}>
        <div className="sidebar-brand-icon">
          <AdminLogoIcon/>
        </div>
        <S.SidebarContentBrandText>
          Admin <sup>2</sup>
        </S.SidebarContentBrandText>
      </S.SidebarBrand>

      <S.BrandDivider/>

      {/* 1. 대시보드 (메인) 링크 */}
      <S.SidebarNavItem>
        <S.NavLink href="/admin" $isCollapsed={isCollapsed}>
          <S.Dashboard/>
          <span>Dashboard</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarDivider/>

      <S.SidebarNavItem>
        <S.NavLink href="/admin/pick" $isCollapsed={isCollapsed}>
          <S.Users/>
          <span>추천동물설정</span>
        </S.NavLink>
      </S.SidebarNavItem>

      {/* 2. 각 메뉴별로 NavItem 하나씩 독립적으로 적용 */}
      <S.SidebarNavItem>
        <S.NavLink href="/admin/campaign" $isCollapsed={isCollapsed}>
          <S.Users/>
          <span>캠페인</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/admin/intergrate" $isCollapsed={isCollapsed}>
          <S.Settings/>
          <span>통합게시물설정</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/admin/sheltersetting" $isCollapsed={isCollapsed}>
          <S.Image/>
          <span>보호소 설정</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/wearesetting" $isCollapsed={isCollapsed}>
          <S.Info/>
          <span>우리는 설정</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/worksetting" $isCollapsed={isCollapsed}>
          <S.Work/>
          <span>work</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/blogsetting" $isCollapsed={isCollapsed}>
          <S.Blog/>
          <span>blog</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/mapsetting" $isCollapsed={isCollapsed}>
          <S.Location/>
          <span>map</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarNavItem>
        <S.NavLink href="/contactsetting" $isCollapsed={isCollapsed}>
          <S.Contact/>
          <span>contact</span>
        </S.NavLink>
      </S.SidebarNavItem>

      <S.SidebarDivider/>

      <S.ToggleButtonWrapper>
        <S.ToggleButton onClick={handleToggle} $isCollapsed={isCollapsed}>
          {isCollapsed ? <S.Expand/> : <S.Collapse/>}
        </S.ToggleButton>
      </S.ToggleButtonWrapper>
    </S.SidebarContainer>
  );
};
