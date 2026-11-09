"use client";

import styled from "styled-components";
import { TopbarContainer, TopbarProfile, TopbarNavbar } from "@/assets/css/admin/Topbar.styles";
import { Search, User, SignOut } from "@/assets/css/admin/AdminIcons.styles";

export const AdminTopbar = styled(TopbarContainer)`
  position: relative;
  flex-flow: row nowrap;
`;

export const MobileMenuButton = styled.button`
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 400;
  color: #007BFF;
  text-decoration: none;
  &:hover {
    color: #0056B3;
    text-decoration: underline;
  }
  @media (min-width: 768px) {
    display: none !important;
  }
  border-radius: 50% !important;
  margin-right: 1rem !important;
`;

export const StyledSearch = styled(Search)`
  font-size: 0.875em;
`;

export const StyledTopbarNavbar = styled(TopbarNavbar)`
  margin-left: auto !important;
`;

export const ProfileMenu = styled.li`
  position: relative;
`;

export const ProfileTrigger = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  &::after {
    display: inline-block;
    margin-left: 0.255em;
    vertical-align: 0.255em;
    content: "";
    border-top: 0.3em solid;
    border-right: 0.3em solid transparent;
    border-bottom: 0;
    border-left: 0.3em solid transparent;
  }
`;

export const ProfileName = styled.span`
  margin-right: 0.5rem !important;
  display: none !important;
  @media (min-width: 992px) {
    display: inline !important;
  }
  color: #4A5565;
  font-size: 80%;
  font-weight: 400;
`;

export const StyledTopbarProfile = styled(TopbarProfile)`
  border-radius: 50% !important;
`;

export const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #FFF;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  right: 0;
  left: auto;
  display: block;
`;

export const ProfileMenuItem = styled.a`
  display: block;
  width: 100%;
  padding: 0.25rem 1.5rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  &:hover {
    color: #16181B;
    text-decoration: none;
    background-color: #F8F9FA;
  }
`;

export const ProfileIcon = styled(User)`
  font-size: 0.875em;
  margin-right: 0.5rem !important;
  color: #99A1AF;
`;

export const ProfileMenuDivider = styled.div`
  height: 0;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #E9ECEF;
`;

export const LogoutIcon = styled(SignOut)`
  font-size: 0.875em;
  margin-right: 0.5rem !important;
  color: #99A1AF;
`;
