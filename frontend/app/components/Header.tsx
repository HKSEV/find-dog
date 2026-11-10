"use client";

import React from "react";
import { useRouter } from "next/navigation"; // 💡 useRouter 임포트

import Logo from "./Logo";
import * as S from "@/assets/css/Style.styles";

interface HeaderProps {
  title?: string;
  onBackClick?: () => void;
  isMain?: boolean;
  isTab?: boolean; // 하단 탭 첫 화면 (입양·봉사, 실종·제보, 커뮤니티, 마이)
}

export default function Header({title, onBackClick, isMain, isTab}: HeaderProps) {
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

        {/* 우측 아이콘 그룹 (로그인·내 정보는 하단 "마이" 탭에서) */}
        <S.HeaderActions>
          <S.NotificationIcon
          onClick={() => router.push("/mypage")} // 필요시 알림 페이지 경로로 수정
        />
        </S.HeaderActions>
      </S.Header>
    );
  };

  // 💡 2. 하단 탭 첫 화면용 헤더 (뒤로 버튼 없이 큰 제목)
  if (isTab) {
    return (
      <S.Header>
        <S.HeaderTabTitle>{title}</S.HeaderTabTitle>
      </S.Header>
    );
  };

  // 💡 3. 서브 페이지용 헤더 (상세, 글쓰기 등)
  return (
    <S.Header>
      <S.Back onClick={handleBack}>&lt; 뒤로</S.Back>

      <S.H5Bold>{title}</S.H5Bold>

      <S.HeaderSpacer/>
    </S.Header>
  );
};
