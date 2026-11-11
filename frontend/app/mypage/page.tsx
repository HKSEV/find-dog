"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loadUserFromStorage, logoutUser } from "../redux/userSlice";
import { fetchShelterAnimals } from "../redux/shelterSlice";
import { genderLabel, toImageUrl } from "../shelter/animalFormat";
import { useLikedAnimals } from "../shelter/useLikedAnimals";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { CustomAlert } from "../components/CustomAlert";
import * as S from "@/assets/css/Style.styles";

// 💡 아직 화면이 없는 메뉴는 "준비 중"으로 표시 (누를 수 없음)
const activityMenus = [
  {label: "작성한 글", href: "/mypage/posts", needLogin: true},
  {label: "입양·봉사 신청 내역"},
  {label: "관심 보호소"},
  {label: "알림 설정"}
];

const guideMenus = [
  {label: "어서찾아주개 소개"},
  {label: "공지사항"},
  {label: "자주 묻는 질문"},
  {label: "문의하기"}
];

type Menu = {label: string; href?: string; needLogin?: boolean};

export default function MyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoggedIn, nickname, email} = useSelector((state: RootState) => state.user);
  const {animals} = useSelector((state: RootState) => state.shelter);
  const {isLiked} = useLikedAnimals();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);

  useEffect(() => {
    dispatch(loadUserFromStorage()); // 로컬스토리지에서 로그인 정보 로드
    dispatch(fetchShelterAnimals()); // 관심 동물 사진·이름을 보여주려고 보호 동물 목록을 받음
  }, [dispatch]);

  // 하트를 누른 순서가 아니라 보호 동물 목록 순서(공고 최신순)로 보여줌
  const likedAnimals = animals
    .filter((animal) => isLiked(animal.id))
    .slice()
    .sort((a, b) => (b.regDate ?? "").localeCompare(a.regDate ?? "") || b.id - a.id);

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsLogoutAlertOpen(true);
  };

  const renderMenu = ({label, href, needLogin}: Menu) => {
    if (!href) {
      return (
        <S.MyMenuItem key={label} as="div" $disabled aria-disabled="true">
          <span>{label}</span>
          <small>준비 중</small>
        </S.MyMenuItem>
      );
    };

    // 로그인이 필요한 메뉴는 로그인 전이면 로그인 화면으로
    return (
      <S.MyMenuItem key={label} as={Link} href={needLogin && !isLoggedIn ? "/login" : href}>
        <span>{label}</span>
        <S.MyMenuChevron aria-hidden="true"/>
      </S.MyMenuItem>
    );
  };

  return (
    <S.AppWrapper>
      <Header title="마이페이지" isTab/>
      <S.Container>
        <S.HeaderOffset/>

        {isLoggedIn ? (
          <S.MyProfile>
            <S.MyAvatar><S.MyAvatarIcon aria-hidden="true"/></S.MyAvatar>
            <S.MyProfileText>
              <strong>{nickname}</strong>
              {email && <span>{email}</span>}
            </S.MyProfileText>
          </S.MyProfile>
        ) : (
          <S.MyLoginCard>
            <S.MyLoginTitle>로그인하면 실종 신고를 올리고<br/>작성한 글을 모아 볼 수 있어요</S.MyLoginTitle>
            <S.MyLoginButtons>
              <S.MyLoginButton as={Link} href="/login" $primary>로그인</S.MyLoginButton>
              <S.MyLoginButton as={Link} href="/signup">회원가입</S.MyLoginButton>
            </S.MyLoginButtons>
          </S.MyLoginCard>
        )}

        {/* 관심 동물: 입양 탭에서 하트를 누른 친구 (이 브라우저에 저장) */}
        <S.MySection>
          <S.MySectionHead>
            <S.MySectionTitle>관심 동물</S.MySectionTitle>
            {likedAnimals.length > 0 && <S.MySectionCount>{likedAnimals.length}마리</S.MySectionCount>}
          </S.MySectionHead>

          {likedAnimals.length === 0 ? (
            <S.MyEmpty>
              입양 탭에서 하트를 누르면 여기에 모여요. <Link href="/shelter">보호 중인 친구 보러 가기</Link>
            </S.MyEmpty>
          ) : (
            <S.MyLikedStrip>
              {likedAnimals.map((animal) => {
                const imageUrl = toImageUrl(animal.imageUrl);
                return (
                  <S.MyLikedCard key={animal.id} as={Link} href={`/shelter/${animal.id}`}>
                    {imageUrl ? (
                      <S.MyLikedImage src={imageUrl} alt={`${animal.breed} 사진`}/>
                    ) : (
                      <S.MyLikedEmptyImage>사진 준비 중</S.MyLikedEmptyImage>
                    )}
                    <S.MyLikedName>{animal.breed} · {genderLabel[animal.gender] ?? animal.gender}</S.MyLikedName>
                  </S.MyLikedCard>
                );
              })}
            </S.MyLikedStrip>
          )}
        </S.MySection>

        <S.MyBand/>

        <S.MyMenu>
          <S.MyMenuTitle>나의 활동</S.MyMenuTitle>
          {activityMenus.map(renderMenu)}

          <S.MyMenuTitle>이용안내</S.MyMenuTitle>
          {guideMenus.map(renderMenu)}

          {isLoggedIn && <S.MyLogoutButton type="button" onClick={handleLogout}>로그아웃</S.MyLogoutButton>}
        </S.MyMenu>
      </S.Container>
      <Footer/>

      <CustomAlert
      isOpen={isLogoutAlertOpen}
      message="로그아웃 되었습니다."
      type="success"
      onConfirm={() => setIsLogoutAlertOpen(false)}/>
    </S.AppWrapper>
  );
};
