"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loadUserFromStorage } from "../redux/userSlice";
import { fetchShelterAnimals } from "../redux/shelterSlice";
import { genderLabel, toImageUrl } from "../shelter/animalFormat";
import { useLikedAnimals } from "../shelter/useLikedAnimals";
import { fetchMyAccount } from "./accountApi";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { loginHref } from "../components/loginLink";
import * as S from "@/assets/css/Style.styles";

// 💡 아직 화면이 없는 메뉴는 "준비 중"으로 표시 (누를 수 없음)
const activityMenus = [
  {label: "작성한 글", href: "/mypage/posts", needLogin: true},
  {label: "입양 신청 내역", href: "/mypage/applications", needLogin: true},
  {label: "봉사 신청 내역"},
  {label: "관심 보호소"},
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
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadUserFromStorage()); // 로컬스토리지에서 로그인 정보 로드
    dispatch(fetchShelterAnimals()); // 관심 동물 사진·이름을 보여주려고 보호 동물 목록을 받음
  }, [dispatch]);

  // 프로필 사진은 로그인 정보에 없어서 내 정보를 따로 받아 옴 (정보 수정에서 바꾼 사진이 바로 보이게)
  useEffect(() => {
    if (!isLoggedIn) return;
    let alive = true;
    fetchMyAccount()
      .then((me) => alive && setPhoto(toImageUrl(me.profileImageUrl) ?? null))
      .catch(() => alive && setPhoto(null)); // 못 받아도 기본 아이콘으로
    return () => {
      alive = false;
    };
  }, [isLoggedIn]);

  // 하트를 누른 순서가 아니라 보호 동물 목록 순서(공고 최신순)로 보여줌
  const likedAnimals = animals
    .filter((animal) => isLiked(animal.id))
    .slice()
    .sort((a, b) => (b.regDate ?? "").localeCompare(a.regDate ?? "") || b.id - a.id);

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
      <S.MyMenuItem key={label} as={Link} href={needLogin && !isLoggedIn ? loginHref(href) : href}>
        <span>{label}</span>
        <S.MyMenuChevron aria-hidden="true"/>
      </S.MyMenuItem>
    );
  };

  return (
    <S.AppWrapper>
      <Header
      title="마이페이지"
      isTab
      action={(
        // 💡 설정: 정보 수정, 알림 설정, 로그아웃, 회원 탈퇴 (로그아웃은 실수로 누르지 않게 설정 안으로 옮김)
        <S.HeaderIconButton as={Link} href="/mypage/settings" $side="right" aria-label="설정">
          <S.HeaderSettingsIcon/>
        </S.HeaderIconButton>
      )}/>
      <S.Container>
        <S.HeaderOffset/>

        {isLoggedIn ? (
          <S.MyProfile>
            <S.MyAvatar>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {photo ? <img src={photo} alt=""/> : <S.MyAvatarIcon aria-hidden="true"/>}
            </S.MyAvatar>
            <S.MyProfileText>
              <strong>{nickname}</strong>
              {email && <span>{email}</span>}
            </S.MyProfileText>
          </S.MyProfile>
        ) : (
          <S.MyLoginCard>
            <S.MyLoginTitle>로그인하면 실종 신고를 올리고<br/>작성한 글을 모아 볼 수 있어요</S.MyLoginTitle>
            <S.MyLoginButtons>
              <S.MyLoginButton as={Link} href={loginHref("/mypage")} $primary>로그인</S.MyLoginButton>
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

        </S.MyMenu>
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
