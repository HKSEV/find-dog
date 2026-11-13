"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { loadUserFromStorage, logoutUser } from "../../redux/userSlice";
import { showToast } from "../../components/Toast";
import { loginHref } from "../../components/loginLink";

import Header from "@/app/components/Header";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import * as S from "@/assets/css/Style.styles";

// 💡 마이 > 설정 (헤더 톱니바퀴): 정보 수정, 알림 설정, 로그아웃
export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn} = useSelector((state: RootState) => state.user);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setConfirmLogout(false);
    showToast("로그아웃했어요");
    router.replace("/mypage");
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="설정"/>
        <S.HeaderOffset/>

        <S.MyMenu>
          <S.MyMenuTitle>계정</S.MyMenuTitle>
          <S.MyMenuItem as={Link} href={isLoggedIn ? "/mypage/settings/profile" : loginHref("/mypage/settings/profile")}>
            <span>정보 수정</span>
            <S.MyMenuChevron aria-hidden="true"/>
          </S.MyMenuItem>
          <S.MyMenuItem as="div" $disabled aria-disabled="true">
            <span>알림 설정</span>
            <small>준비 중</small>
          </S.MyMenuItem>
        </S.MyMenu>

        {isLoggedIn ? (
          <S.SettingsLogout type="button" onClick={() => setConfirmLogout(true)}>로그아웃</S.SettingsLogout>
        ) : (
          <S.SettingsLogout as={Link} href={loginHref("/mypage/settings")}>로그인</S.SettingsLogout>
        )}
      </S.Container>

      <ConfirmDialog
      isOpen={confirmLogout}
      title="로그아웃할까요?"
      message="관심 동물은 이 기기에 그대로 남아요."
      confirmText="로그아웃"
      onConfirm={handleLogout}
      onCancel={() => setConfirmLogout(false)}/>
    </S.AppWrapper>
  );
};
