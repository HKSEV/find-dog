"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loadUserFromStorage, logoutUser } from "../redux/userSlice";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { CustomAlert } from "../components/CustomAlert";
import * as S from "@/assets/css/Style.styles";
// 💡 커스텀 알럿 임포트

// 💡 MUI 아이콘 임포트

export default function MyPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {isLoggedIn, nickname} = useSelector((state: RootState) => state.user);

  // 💡 커스텀 알럿 상태 관리
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
    onConfirm: () => {}
  });

  const closeAlert = () => {
    setAlertConfig((prev) => ({...prev, isOpen: false}));
  };

  useEffect(() => {
    // 컴포넌트 마운트 시 로컬스토리지에서 유저 정보 로드
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  // 로그아웃 기능
  const handleLogout = () => {
    dispatch(logoutUser());

    // 💡 기본 alert 대신 CustomAlert 띄우기
    setAlertConfig({
      isOpen: true,
      message: "로그아웃 되었습니다.",
      type: "success",
      onConfirm: () => {
        closeAlert();
        router.push("/login"); // 확인 버튼을 누르면 이동
      }
    });
  };

  return (
    <S.AppWrapper>
      <Header title="마이페이지" isTab/>
      <S.Container>
        <S.Mt70/>

        <S.LoginLayout>
          <S.H2Size20>
            {isLoggedIn ? (
              <S.LayOutSpaceBetween>
                <span>
                  환영합니다 <span>{nickname}</span>님
                </span>
                <S.LogOutBtn onClick={handleLogout}>로그아웃</S.LogOutBtn>
              </S.LayOutSpaceBetween>
            ) : (
              <Link href="/login">
                <span>로그인</span>을 해주세요
              </Link>
            )}
          </S.H2Size20>

          <S.LayOutSpaceBetween>
            <TopMenuCard icon={<S.MembershipIcon/>} text="멤버십"/>
            <TopMenuCard icon={<S.ApplicationIcon/>} text="입양신청"/>
            <TopMenuCard icon={<S.MessageIcon/>} text="쪽지함"/>
          </S.LayOutSpaceBetween>
        </S.LoginLayout>

        <S.Line/>

        <S.LoginLayout>
          <S.List>
            <S.H3Size16>마이메뉴</S.H3Size16>
            {!isLoggedIn && <ListItem icon={<S.MyPageAccountIcon/>} text="로그인" link="/login"/>}
            <ListItem icon={<S.FavoriteIcon/>} text="관심 유기 동물"/>
          </S.List>
        </S.LoginLayout>

        <S.Line/>

        <S.LoginLayout>
          <S.List>
            <S.H3Size16>정보</S.H3Size16>
            <ListItem icon={<S.NoticeIcon/>} text="공지사항"/>
            <ListItem icon={<S.HelpMenuIcon/>} text="자주하는 질문"/>
            <ListItem icon={<S.ContactIcon/>} text="문의하기"/>
          </S.List>
        </S.LoginLayout>

        <S.LoginLayout>
          <S.List>
            <S.H3Size16>SNS</S.H3Size16>
            <ListItem icon={<S.InstagramIcon/>} text="어서찾아주개 인스타그램"/>
            <ListItem icon={<S.BlogIcon/>} text="어서찾아주개 블로그"/>
            <ListItem icon={<S.VideoIcon/>} text="어서찾아주개 유튜브"/>
          </S.List>
        </S.LoginLayout>
      </S.Container>
      <Footer/>

      {/* 💡 커스텀 알럿 렌더링 영역 */}
      <CustomAlert
      isOpen={alertConfig.isOpen}
      message={alertConfig.message}
      type={alertConfig.type}
      onConfirm={alertConfig.onConfirm}/>
    </S.AppWrapper>
  );
};

function TopMenuCard({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <S.MenuCardBox>
      {icon}
      <S.MenuCardText>{text}</S.MenuCardText>
    </S.MenuCardBox>
  );
};

function ListItem({icon, text, link}: {icon: React.ReactNode; text: string; link?: string}) {
  const content = (
    <S.ListItemWrapper>
      <S.ListItemLeft>
        {icon}
        <S.ListItemText>{text}</S.ListItemText>
      </S.ListItemLeft>
      <S.ListChevron/>
    </S.ListItemWrapper>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  };
  return content;
};
