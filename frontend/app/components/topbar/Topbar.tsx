"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown, FiExternalLink, FiLogOut, FiRefreshCw, FiUser } from "react-icons/fi";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAdminProfile, logoutAdmin } from "../../redux/adminProfileSlice";
import useAdminModal from "../contexts/AdminModalContext";
import AdminProfileAvatar from "../AdminProfileAvatar";
import * as S from "@/assets/css/Style.styles";

export const Topbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {profile, status, isLoggingOut} = useSelector((state: RootState) => state.adminProfile);
  const {openAlertModal, openConfirmModal} = useAdminModal();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const request = dispatch(fetchAdminProfile());
    return () => request.abort();
  }, [dispatch]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    dropdownRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();

    const handleOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsDropdownOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsDropdownOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const handleMenuKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = [...(dropdownRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') || [])];
    const index = items.indexOf(document.activeElement as HTMLElement);
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[next]?.focus();
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    triggerRef.current?.focus();
    openConfirmModal(
      "로그아웃하시겠습니까?",
      async () => {
        const result = await dispatch(logoutAdmin());
        if (logoutAdmin.fulfilled.match(result)) {
          openAlertModal("로그아웃이 완료되었습니다.", () => router.replace("/admin/login"), {variant: "success"});
        } else {
          openAlertModal(result.payload || "로그아웃하지 못했습니다. 다시 시도해 주세요.", undefined, {
            variant: "error"
          });
        };
      },
      {confirmText: "예", cancelText: "아니오", description: "관리자 로그인을 종료합니다."}
    );
  };

  return (
    <S.AdminTopbar aria-label="관리자 헤더">
      <S.AdminTopbarCaption>어서찾아주개 관리자</S.AdminTopbarCaption>
      <S.ProfileMenu
      ref={menuRef}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDropdownOpen(false);
      }}>
        <S.ProfileName href={profile ? "/admin/mypage" : "/admin/login"}>
          {profile
            ? `${profile.name}님 안녕하세요`
            : status === "loading" || status === "idle"
              ? "회원 정보 확인 중…"
              : "로그인이 필요합니다"}
        </S.ProfileName>
        <S.ProfileTrigger
        ref={triggerRef}
        type="button"
        id="admin-profile-trigger"
        aria-label="프로필 메뉴"
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        aria-controls="admin-profile-menu"
        disabled={isLoggingOut}
        onClick={() => setIsDropdownOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setIsDropdownOpen(true);
          };
        }}>
          <AdminProfileAvatar profile={profile}/>
          <S.ProfileChevron $open={isDropdownOpen}>
            <FiChevronDown aria-hidden="true"/>
          </S.ProfileChevron>
        </S.ProfileTrigger>
        <S.ProfileDropdown
        ref={dropdownRef}
        id="admin-profile-menu"
        role="menu"
        aria-labelledby="admin-profile-trigger"
        aria-hidden={!isDropdownOpen}
        inert={!isDropdownOpen}
        $open={isDropdownOpen}
        onKeyDown={handleMenuKeys}>
          <S.ProfileMenuHeading>
            {profile?.nickname || profile?.name || "관리자 계정"}
            <span>{profile?.email || "회원 정보를 확인해 주세요."}</span>
          </S.ProfileMenuHeading>
          <S.ProfileMenuItem role="menuitem" href="/admin/mypage" onClick={() => setIsDropdownOpen(false)}>
            <FiUser aria-hidden="true"/>
            마이페이지
          </S.ProfileMenuItem>
          <S.ProfileMenuItem
          role="menuitem"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsDropdownOpen(false)}>
            <FiExternalLink aria-hidden="true"/>
            서비스 홈 보기
          </S.ProfileMenuItem>
          {!profile && (
            <S.ProfileMenuAction role="menuitem" type="button" onClick={() => dispatch(fetchAdminProfile())}>
              <FiRefreshCw aria-hidden="true"/>
              회원 정보 다시 불러오기
            </S.ProfileMenuAction>
          )}
          <S.ProfileMenuDivider/>
          <S.ProfileMenuAction role="menuitem" type="button" onClick={handleLogout} disabled={isLoggingOut}>
            <FiLogOut aria-hidden="true"/>
            {isLoggingOut ? "로그아웃 중…" : "로그아웃"}
          </S.ProfileMenuAction>
        </S.ProfileDropdown>
      </S.ProfileMenu>
    </S.AdminTopbar>
  );
};
