"use client";

import React from "react";
import { useRouter } from "next/navigation"; // 💡 useRouter 임포트
import * as S from "@/assets/css/style.styles";
import { NotificationsOutlined as NotificationsNoneIcon, PersonOutlined as PersonOutlineIcon } from "@mui/icons-material";
import Logo from "./Logo";
import styled from "styled-components";

const HeaderActions = styled.div`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

const AccountIcon = styled(PersonOutlineIcon)`
  && {
    cursor: pointer;
    color: #8a4e4b;
    font-size: 30px;
  }
`;

const NotificationIcon = styled(NotificationsNoneIcon)`
  && {
    cursor: pointer;
    color: #8a4e4b;
    font-size: 28px;
  }
`;

const HeaderSpacer = styled(S.None)`
  && {
    width: 60px;
  }
`;

interface HeaderProps {
  title?: string;
  onBackClick?: () => void;
  isMain?: boolean;
}

export default function Header({title, onBackClick, isMain}: HeaderProps) {
  const router = useRouter(); // 💡 라우터 초기화

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back(); // window.history.back() 대신 Next.js 라우터 사용
    };
  };

  // 💡 1. 메인 페이지용 헤더
  if (isMain) {
    return (
      <S.Header>
        <Logo onClick={() => router.push("/")}/>

        {/* 우측 아이콘 그룹 */}
        <HeaderActions>
          <AccountIcon
          onClick={() => router.push("/login")} // 💡 클릭 시 /login 으로 이동
        />
          <NotificationIcon
          onClick={() => router.push("/mypage")} // 필요시 알림 페이지 경로로 수정
        />
        </HeaderActions>
      </S.Header>
    );
  };

  // 💡 2. 서브 페이지용 헤더
  return (
    <S.Header>
      <S.Back onClick={handleBack}>&lt; 뒤로</S.Back>

      <S.H5Bold>{title}</S.H5Bold>

      <HeaderSpacer/>
    </S.Header>
  );
};
