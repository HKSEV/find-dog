"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loadUserFromStorage } from "../redux/userSlice";
import { fetchShelterAnimals } from "../redux/shelterSlice";
import { animalTitle, toImageUrl } from "../shelter/animalFormat";
import { useLikedAnimals } from "../shelter/useLikedAnimals";
import { fetchMyAccount } from "./accountApi";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { loginHref } from "../components/loginLink";
import * as S from "@/assets/css/Style.styles";
import { useScrollCollapse } from "@/app/components/useScrollCollapse";

// 💡 아직 화면이 없는 메뉴는 "준비 중"으로 표시 (누를 수 없음)
const activityMenus = [
  {label: "작성한 글", href: "/mypage/posts", needLogin: true},
  {label: "입양 신청 내역", href: "/mypage/applications", needLogin: true},
  {label: "봉사 신청 내역", href: "/mypage/volunteers", needLogin: true}
];

const guideMenus = [
  {label: "자주 묻는 질문", href: "/mypage/faq"},
  {label: "이용약관", href: "/mypage/terms"},
  {label: "개인정보처리방침", href: "/mypage/privacy"}
];

type Menu = {label: string; href?: string; needLogin?: boolean};

// 저장해 둔 프로필 사진 주소 (다른 탭에서 바뀌면 다시 읽음)
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getCachedPhoto = () => {
  try {
    return localStorage.getItem("profileImage");
  } catch {
    return null;
  }
};

export default function MyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const collapsed = useScrollCollapse(); // 💡 아래로 스크롤하면 헤더 숨김
  const {isLoggedIn, nickname, email} = useSelector((state: RootState) => state.user);
  const {animals} = useSelector((state: RootState) => state.shelter);
  const {isLiked} = useLikedAnimals();
  const [photo, setPhoto] = useState<string | null | undefined>(undefined); // undefined: 아직 서버에서 못 받음
  // 💡 지난번에 받은 사진 주소를 기기에 저장해 두고, 서버 응답을 기다리지 않고 바로 보여줌 (Render가 깨어나는 동안 빈 아이콘이 오래 보이지 않게)
  const cachedPhoto = useSyncExternalStore(subscribeStorage, getCachedPhoto, () => null);
  const shownPhoto = photo === undefined ? cachedPhoto : photo;
  const [isKakao, setIsKakao] = useState(false); // 카카오 회원은 이메일 대신 "카카오 계정"

  useEffect(() => {
    dispatch(loadUserFromStorage()); // 로컬스토리지에서 로그인 정보 로드
    dispatch(fetchShelterAnimals()); // 관심 동물 사진·이름을 보여주려고 보호 동물 목록을 받음
  }, [dispatch]);

  // 프로필 사진은 로그인 정보에 없어서 내 정보를 따로 받아 옴 (정보 수정에서 바꾼 사진이 바로 보이게)
  useEffect(() => {
    if (!isLoggedIn) return;
    let alive = true;
    fetchMyAccount()
      .then((me) => {
        if (!alive) return;
        const url = toImageUrl(me.profileImageUrl) ?? null;
        setPhoto(url);
        try {
          if (url) localStorage.setItem("profileImage", url);
          else localStorage.removeItem("profileImage");
        } catch {
          // 저장 못 해도 화면에는 그대로 보임
        }
        setIsKakao(me.provider === "KAKAO");
      })
      .catch(() => {}); // 못 받으면 저장해 둔 사진(없으면 기본 아이콘)을 그대로 보여줌
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
      hidden={collapsed}
      action={(
        // 💡 설정: 정보 수정, 로그아웃 (로그아웃은 실수로 누르지 않게 설정 안으로 옮김)
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
              {shownPhoto ? <img src={shownPhoto} alt="" decoding="async"/> : <S.MyAvatarIcon aria-hidden="true"/>}
            </S.MyAvatar>
            <S.MyProfileText>
              <strong>{nickname}</strong>
              {isKakao ? <span>카카오 계정</span> : email && <span>{email}</span>}
            </S.MyProfileText>
          </S.MyProfile>
        ) : (
          <S.MyLoginCard>
            <S.MyLoginTitle>로그인하면 입양·봉사를 신청하고<br/>글을 쓸 수 있어요</S.MyLoginTitle>
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
                  <S.MyLikedCard key={animal.id} as={Link} href={`/shelter/detail/?id=${animal.id}`}>
                    {imageUrl ? (
                      <S.MyLikedImage src={imageUrl} alt={`${animal.breed} 사진`}/>
                    ) : (
                      <S.MyLikedEmptyImage>사진 준비 중</S.MyLikedEmptyImage>
                    )}
                    <S.MyLikedName>{animalTitle(animal)}</S.MyLikedName>
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
        <S.MyCopyright>
          {"© 2026 어서찾아주개\n글꼴 Pretendard (SIL Open Font License 1.1) · 지도 ⓒ Kakao"}
        </S.MyCopyright>
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
