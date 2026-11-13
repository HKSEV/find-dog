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

// 💡 마이 > 설정 (헤더 톱니바퀴): 정보 수정, 로그아웃
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

        {/* 로그아웃 상태에서는 고칠 정보가 없으니 로그인 안내만 */}
        {isLoggedIn ? (
          <>
            <S.MyMenu>
              <S.MyMenuTitle>계정</S.MyMenuTitle>
              <S.MyMenuItem as={Link} href="/mypage/settings/profile">
                <span>정보 수정</span>
                <S.MyMenuChevron aria-hidden="true"/>
              </S.MyMenuItem>
            </S.MyMenu>
            <S.SettingsLogout type="button" onClick={() => setConfirmLogout(true)}>로그아웃</S.SettingsLogout>
          </>
        ) : (
          <S.WriteLoginNotice>
            <p>로그인하면 닉네임, 연락처 같은<br/>내 정보를 고칠 수 있어요</p>
            <Link href={loginHref("/mypage/settings")}>로그인</Link>
          </S.WriteLoginNotice>
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
