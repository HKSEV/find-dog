"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 💡 useRouter 임포트

import Logo from "./Logo";
import { fetchHasUnread } from "../notifications/notificationApi";
import * as S from "@/assets/css/Style.styles";

interface HeaderProps {
  title?: string;
  onBackClick?: () => void;
  isMain?: boolean;
  isTab?: boolean; // 하단 탭 첫 화면 (입양·봉사, 실종·제보, 커뮤니티, 마이)
  isModal?: boolean; // 잠깐 띄운 작업 창 (로그인 등): 왼쪽에 닫기(X)
  onClose?: () => void; // 닫기(X)를 눌렀을 때. 서브 헤더에 주면 오른쪽에 X가 생김
  hidden?: boolean; // 탭 헤더: true면 위로 숨김 (아래로 스크롤할 때, useScrollCollapse)
  action?: React.ReactNode; // 오른쪽 버튼 (예: 마이의 설정 톱니바퀴, 지도의 "목록"). 탭 헤더와 서브 페이지 헤더에서 씀
}

export default function Header({title, onBackClick, isMain, isTab, isModal, onClose, action, hidden}: HeaderProps) {
  const router = useRouter(); // 💡 라우터 초기화
  const [hasUnread, setHasUnread] = useState(false); // 메인 헤더 종 아이콘 빨간 점

  useEffect(() => {
    if (!isMain) return;
    let alive = true;
    fetchHasUnread().then((value) => alive && setHasUnread(value));
    return () => {
      alive = false;
    };
  }, [isMain]);

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back(); // window.history.back() 대신 Next.js 라우터 사용
    };
  };

  // 닫으면 원래 보던 화면으로. 주소로 바로 들어와서 돌아갈 곳이 없으면 홈으로
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    };
  };

  // 💡 1. 메인 페이지용 헤더
  //    hidden(아래로 스크롤)이면 헤더는 위로 숨고 오른쪽 위에 둥근 알림 버튼만 남음
  if (isMain) {
    const bellLabel = hasUnread ? "알림 (새 알림 있음)" : "알림";
    return (
      <>
        <S.Header
        aria-hidden={hidden || undefined}
        style={{transform: hidden ? "translate(-50%, -100%)" : undefined, transition: "transform 0.2s"}}>
          <Logo onClick={() => router.push("/")}/>

          {/* 우측 아이콘 그룹 (로그인·내 정보는 하단 "마이" 탭에서) */}
          <S.HeaderActions>
            <S.HeaderBell type="button" aria-label={bellLabel} onClick={() => router.push("/notifications")}>
              <S.NotificationIcon/>
              {hasUnread && <S.HeaderBellDot aria-hidden="true"/>}
            </S.HeaderBell>
          </S.HeaderActions>
        </S.Header>

        <S.FloatingHeaderActions $show={Boolean(hidden)} aria-hidden={!hidden}>
          <S.FloatingRoundButton type="button" aria-label={bellLabel} tabIndex={hidden ? 0 : -1} onClick={() => router.push("/notifications")}>
            <S.NotificationIcon/>
            {hasUnread && <S.FloatingBadgeDot aria-hidden="true"/>}
          </S.FloatingRoundButton>
        </S.FloatingHeaderActions>
      </>
    );
  };

  // 💡 2. 하단 탭 첫 화면용 헤더 (뒤로 버튼 없이 큰 제목)
  if (isTab) {
    return (
      <>
        <S.Header
        aria-hidden={hidden || undefined}
        style={{transform: hidden ? "translate(-50%, -100%)" : undefined, transition: "transform 0.2s"}}>
          <S.HeaderTabTitle>{title}</S.HeaderTabTitle>
          {action}
        </S.Header>
      </>
    );
  };

  // 💡 3. 잠깐 띄운 작업 창용 헤더 (로그인 등): 왼쪽 닫기(X) + 가운데 제목
  if (isModal) {
    return (
      <>
        <S.Header>
          <S.HeaderIconButton $side="left" aria-label="닫기" onClick={handleClose}>
            <S.HeaderCloseIcon/>
          </S.HeaderIconButton>

          <S.H5Bold>{title}</S.H5Bold>

          <S.HeaderSpacer/>
        </S.Header>
      </>
    );
  };

  // 💡 4. 서브 페이지용 헤더 (상세, 단계가 있는 화면 등): 왼쪽 뒤로(<) + 가운데 제목
  return (
    <>
      <S.Header>
        <S.HeaderIconButton $side="left" aria-label="뒤로" onClick={handleBack}>
          <S.HeaderBackIcon/>
        </S.HeaderIconButton>

        <S.H5Bold>{title}</S.H5Bold>

        {action ?? (onClose ? (
          <S.HeaderIconButton $side="right" aria-label="닫기" onClick={handleClose}>
            <S.HeaderCloseIcon/>
          </S.HeaderIconButton>
        ) : (
          <S.HeaderSpacer/>
        ))}
      </S.Header>
    </>
  );
};
