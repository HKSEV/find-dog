"use client";

import React, { useState } from "react";
// 💡 길게 나열했던 스타일 컴포넌트들을 'S'라는 바구니(별칭) 하나로 깔끔하게 묶어옵니다!
import * as S from "../../../assets/css/admin/Sidebar.styled";
import AdminLogoIcon from "../../components/AdminLogoIcon";
import * as I from "@/assets/css/admin/AdminIcons.styles";
import { BrandText, BrandDivider } from "@/assets/css/admin/SidebarContent.styles";

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
        <BrandText>
          Admin <sup>2</sup>
        </BrandText>
      </S.SidebarBrand>

      <BrandDivider/>

      {/* 1. 대시보드 (메인) 링크 */}
      <S.NavItem>
        <S.NavLink href="/admin" $isCollapsed={isCollapsed}>
          <I.Dashboard/>
          <span>Dashboard</span>
        </S.NavLink>
      </S.NavItem>

      <S.Divider/>

      <S.NavItem>
        <S.NavLink href="/admin/pick" $isCollapsed={isCollapsed}>
          <I.Users/>
          <span>추천동물설정</span>
        </S.NavLink>
      </S.NavItem>

      {/* 2. 각 메뉴별로 NavItem 하나씩 독립적으로 적용 */}
      <S.NavItem>
        <S.NavLink href="/admin/campaign" $isCollapsed={isCollapsed}>
          <I.Users/>
          <span>캠페인</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/admin/intergrate" $isCollapsed={isCollapsed}>
          <I.Settings/>
          <span>통합게시물설정</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/admin/sheltersetting" $isCollapsed={isCollapsed}>
          <I.Image/>
          <span>보호소 설정</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/wearesetting" $isCollapsed={isCollapsed}>
          <I.Info/>
          <span>우리는 설정</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/worksetting" $isCollapsed={isCollapsed}>
          <I.Work/>
          <span>work</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/blogsetting" $isCollapsed={isCollapsed}>
          <I.Blog/>
          <span>blog</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/mapsetting" $isCollapsed={isCollapsed}>
          <I.Location/>
          <span>map</span>
        </S.NavLink>
      </S.NavItem>

      <S.NavItem>
        <S.NavLink href="/contactsetting" $isCollapsed={isCollapsed}>
          <I.Contact/>
          <span>contact</span>
        </S.NavLink>
      </S.NavItem>

      <S.Divider/>

      <S.ToggleButtonWrapper>
        <S.ToggleButton onClick={handleToggle} $isCollapsed={isCollapsed}>
          {isCollapsed ? <I.Expand/> : <I.Collapse/>}
        </S.ToggleButton>
      </S.ToggleButtonWrapper>
    </S.SidebarContainer>
  );
};
