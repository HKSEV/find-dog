"use client";

import Link from "next/link";
import styled, { css } from "styled-components";
import { TopbarContainer } from "@/assets/css/admin/Topbar.styles";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";

const profileMenuItem = css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 10px 16px;
  color: ${coolGray[700]};
  text-align: left;
  font-size: 0.8125rem;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: ${coolGray[500]};
  }

  &:hover, &:focus-visible {
    outline: none;
    background-color: ${coolGray[100]};
    color: ${coolGray[900]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const AdminTopbar = styled(TopbarContainer)`
  position: relative;
  z-index: 20;
  flex-shrink: 0;
  gap: 16px;

  @media (max-width: 991px) {
    flex-wrap: wrap;
    height: auto;
    min-height: 70px;
    padding-top: 12px;
    padding-bottom: 12px;
    row-gap: 10px;
  }
`;

export const AdminTopbarCaption = styled.span`
  color: ${coolGray[500]};
  font-size: 0.8125rem;
  font-weight: 600;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const AdminSessionExpiryBadge = styled.div<{$expiring: boolean}>`
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  margin-left: auto;
  padding: 7px 10px;
  border: 1px solid ${({$expiring}) => ($expiring ? adminColors.danger : coolGray[200])};
  border-radius: 8px;
  background-color: ${({$expiring}) => ($expiring ? adminColors.dangerSoft : adminColors.primarySoft)};
  color: ${({$expiring}) => ($expiring ? adminColors.danger : adminColors.primaryText)};
  font-size: 0.75rem;
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
  }

  time {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 575px) {
    margin-left: 0;
    padding: 6px 8px;

    span {
      display: none;
    }
  }
`;

export const ProfileMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const ProfileName = styled(Link)`
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${coolGray[700]};
  font-size: 0.875rem;

  &:hover {
    color: ${adminColors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 4px;
    border-radius: 3px;
  }

  @media (max-width: 575px) {
    max-width: 180px;
    font-size: 0.8125rem;
  }
`;

export const ProfileTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 24px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${adminColors.primary};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const ProfileChevron = styled.span<{$open: boolean}>`
  color: ${coolGray[500]};
  transform: rotate(${({$open}) => ($open ? "180deg" : "0deg")});
  transition: transform 0.18s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ProfileDropdown = styled.div<{$open: boolean}>`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 30;
  width: 260px;
  max-width: calc(100vw - 96px);
  padding: 6px 0;
  border: 1px solid ${coolGray[200]};
  border-radius: 12px;
  background-color: #FFFFFF;
  box-shadow: 0 12px 32px rgba(39, 81, 133, 0.12);
  opacity: ${({$open}) => ($open ? 1 : 0)};
  transform: translateY(${({$open}) => ($open ? "0" : "-6px")}) scale(${({$open}) => ($open ? 1 : 0.98)});
  transform-origin: top right;
  visibility: ${({$open}) => ($open ? "visible" : "hidden")};
  pointer-events: ${({$open}) => ($open ? "auto" : "none")};
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0s ${({$open}) => ($open ? "0s" : "0.18s")};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const ProfileMenuHeading = styled.div`
  padding: 10px 16px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid ${coolGray[200]};
  color: ${coolGray[800]};
  font-size: 0.875rem;
  font-weight: 600;
  overflow-wrap: anywhere;

  span {
    display: block;
    margin-top: 3px;
    color: ${coolGray[500]};
    font-size: 0.75rem;
    font-weight: 400;
  }
`;

export const ProfileMenuItem = styled(Link)`
  ${profileMenuItem}
`;

export const ProfileMenuAction = styled.button`
  ${profileMenuItem}
`;

export const ProfileMenuDivider = styled.hr`
  margin: 5px 0;
  border-top: 1px solid ${coolGray[200]};
`;
