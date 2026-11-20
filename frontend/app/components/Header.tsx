"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 💡 useRouter 임포트

import Logo from "./Logo";
import { useDemoLogin } from "./DemoLogin";
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
  const [hasUnread, setHasUnread] = useState(false); // 종 아이콘 빨간 점 (홈 + 하단 탭 첫 화면)
  const demo = useDemoLogin(); // 💡 홈 로고를 길게 누르면 시연 계정 고르기

  useEffect(() => {
    if (!isMain && !isTab) return;
    let alive = true;
    fetchHasUnread().then((value) => alive && setHasUnread(value));
    return () => {
      alive = false;
    };
  }, [isMain, isTab]);

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
  //    hidden(아래로 스크롤)이면 헤더가 위로 숨음 (알림 버튼도 같이 숨김)
  if (isMain) {
    const bellLabel = hasUnread ? "알림 (새 알림 있음)" : "알림";
    return (
      <>
        <S.Header
        aria-hidden={hidden || undefined}
        style={{transform: hidden ? "translate(-50%, -100%)" : undefined, transition: "transform 0.2s"}}>
          <S.LogoHold {...demo.handlers}>
            <Logo onClick={() => router.push("/")}/>
          </S.LogoHold>

          {/* 우측 아이콘 그룹 (로그인·내 정보는 하단 "마이" 탭에서)
              다른 탭 헤더와 같은 버튼 크기·간격·색(검정). 테마색은 로고에만 */}
          <S.HeaderActionRow>
            {action}
            <S.TabBellButton type="button" aria-label={bellLabel} onClick={() => router.push("/notifications")}>
              <S.TabBellIcon aria-hidden="true"/>
              {hasUnread && <S.TabBellDot aria-hidden="true"/>}
            </S.TabBellButton>
          </S.HeaderActionRow>
        </S.Header>
        {demo.sheet}
      </>
    );
  };

  // 💡 2. 하단 탭 첫 화면용 헤더 (뒤로 버튼 없이 큰 제목)
  //    오른쪽: 화면별 버튼(action) + 알림 종 (홈이 아닌 탭에서도 바로 알림으로)
  if (isTab) {
    const bellLabel = hasUnread ? "알림 (새 알림 있음)" : "알림";
    return (
      <>
        <S.Header
        aria-hidden={hidden || undefined}
        style={{transform: hidden ? "translate(-50%, -100%)" : undefined, transition: "transform 0.2s"}}>
          <S.HeaderTabTitle>{title}</S.HeaderTabTitle>
          <S.HeaderActionRow>
            {action}
            <S.TabBellButton type="button" aria-label={bellLabel} onClick={() => router.push("/notifications")}>
              <S.TabBellIcon aria-hidden="true"/>
              {hasUnread && <S.TabBellDot aria-hidden="true"/>}
            </S.TabBellButton>
          </S.HeaderActionRow>
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
