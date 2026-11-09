"use client";

import Link from "next/link";
import styled from "styled-components";
import { coolGray } from "@/assets/css/admin/AdminBase.styles";

export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const SidebarContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  background-color: ${coolGray[50]};
`;

export const SidebarMainContent = styled.div`
  flex: 1 0 auto;
`;

export const ContainerFluid = styled.div`
  width: 100%;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
  margin-right: auto;
  margin-left: auto;
`;

export const SidebarContainer = styled.aside<{$isCollapsed?: boolean}>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: ${({$isCollapsed}) => ($isCollapsed ? "76px" : "224px")};
  min-height: 100vh;
  overflow: hidden;
  background-color: ${coolGray[900]};
  transition: width 0.2s ease;

  @media (max-width: 767px) {
    width: 64px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const BrandText = styled.div<{$isCollapsed?: boolean}>`
  display: ${({$isCollapsed}) => ($isCollapsed ? "none" : "block")};

  @media (max-width: 767px) {
    display: none;
  }
`;

export const SidebarBrand = styled(Link)<{$isCollapsed?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: ${({$isCollapsed}) => ($isCollapsed ? "center" : "flex-start")};
  height: 72px;
  padding: ${({$isCollapsed}) => ($isCollapsed ? "0" : "0 24px")};
  color: #FFFFFF;
  font-size: 1.25rem;
  font-weight: 750;
  white-space: nowrap;

  &:hover {
    color: #FFFFFF;
  }

  &:focus-visible {
    outline: 2px solid ${coolGray[400]};
    outline-offset: -4px;
  }

  @media (max-width: 767px) {
    justify-content: center;
    padding: 0;
  }
`;

export const SidebarBrandIcon = styled.span`
  flex-shrink: 0;
`;

export const SidebarDivider = styled.hr`
  margin: 0 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

export const SidebarNavigation = styled.nav`
  padding-top: 20px;
`;

export const SidebarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SidebarNavItem = styled.li`
  padding: 0 10px;
`;

export const NavLink = styled(Link)<{$isCollapsed?: boolean; $isActive?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: ${({$isCollapsed}) => ($isCollapsed ? "center" : "flex-start")};
  gap: 14px;
  min-height: 46px;
  padding: ${({$isCollapsed}) => ($isCollapsed ? "12px 0" : "12px 16px")};
  border-radius: 7px;
  background-color: ${({$isActive}) => ($isActive ? coolGray[800] : "transparent")};
  color: ${({$isActive}) => ($isActive ? "#FFFFFF" : coolGray[400])};
  font-size: 0.875rem;
  font-weight: ${({$isActive}) => ($isActive ? 650 : 500)};
  transition: background-color 0.2s, color 0.2s;

  svg {
    flex-shrink: 0;
    width: 19px;
    height: 19px;
  }

  span {
    display: ${({$isCollapsed}) => ($isCollapsed ? "none" : "inline")};
    white-space: nowrap;
  }

  &:hover {
    background-color: ${coolGray[800]};
    color: #FFFFFF;
  }

  &:focus-visible {
    outline: 2px solid ${coolGray[400]};
    outline-offset: 2px;
  }

  @media (max-width: 767px) {
    justify-content: center;
    padding: 12px 0;

    span {
      display: none;
    }
  }
`;

export const ToggleButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 24px 0;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const ToggleButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.08);
  color: ${coolGray[300]};
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
  }

  &:focus-visible {
    outline: 2px solid ${coolGray[400]};
    outline-offset: 3px;
  }
`;
