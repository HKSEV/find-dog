"use client";

import Image from "next/image";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchShelterAnimals, setActiveTab, toggleAlert } from "../redux/shelterSlice";

import Header from "@/app/components/Header";
import Footer from "../components/Footer";

//MUI
import { NotificationsOutlined as NotificationsIcon } from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

export default function Shelter() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {activeTab, isAlertOn, animals, loading} = useSelector((state: RootState) => state.shelter);

  useEffect(() => {
    dispatch(fetchShelterAnimals());
  }, [dispatch]);

  // 이미지 주소 변환함수 (사진이 없으면 화면에서 "사진 없음"으로 표시)
  const getFullImageUrl = (url: string) => {
    if (url.startsWith("/uploads/")) {
      return `http://localhost:8080${url}`;
    };
    return url;
  };

  return (
    <S.AppWrapper>
      <Header title="입양·봉사" isTab/>

      <S.Container>
        <S.Mt70/>

        <S.TabContainer>
          {["보호동물", "보호소 찾기", "추천 입양 동물"].map((tab) => (
            <S.TabBtn key={tab} $active={activeTab === tab} onClick={() => dispatch(setActiveTab(tab))}>
              {tab}
            </S.TabBtn>
          ))}
        </S.TabContainer>

        {/*필터 영역 */}
        <S.FilterContainer>
          <S.FilterIconBtn>
            <S.FilterIconButton/>
          </S.FilterIconBtn>

          <S.FilterSelect defaultValue="3months">
            <option value="3months">최근 1개월</option>
            <option value="3months">최근 2개월</option>
            <option value="3months">최근 3개월</option>
          </S.FilterSelect>

          <S.FilterSelect defaultValue="allArea">
            <option value="allArea">모든 지역</option>
            <option value="allArea">서울</option>
          </S.FilterSelect>

          <S.FilterSelect defaultValue="allAnimal">
            <option value="allAnimal">모든 동물</option>
            <option value="allAnimal">강아지</option>
          </S.FilterSelect>
        </S.FilterContainer>

        {/*실시간 알림 토글배너 */}
        <S.AlertBanner>
          <S.AlertInfo>
            <div className="icon-circle">
              <NotificationsIcon/>
            </div>
            <div className="text-group">
              <strong>이 지역 실시간 알림</strong>
              <span>새 공고가 올라오면 알려드려요</span>
            </div>
          </S.AlertInfo>
          <S.ToggleBtn $isOn={isAlertOn} onClick={() => dispatch(toggleAlert())}>
            <div className="handle"/>
          </S.ToggleBtn>
        </S.AlertBanner>

        <S.Divider/>

        <S.RecommendSection>
          <S.SectionHeader>
            <S.H2Size20>이달의 추천 입양 동물</S.H2Size20>
            <Link href="#more" className="more-link">
              더보기
              <S.MoreChevron/>
            </Link>
          </S.SectionHeader>

          <S.RecommendScroll>
            <S.RecommendCard>
              <S.RecommendImgBox>
                <S.ShelterPhotoEmpty>사진 준비 중</S.ShelterPhotoEmpty>
              </S.RecommendImgBox>
              <S.LocationText>
                <S.LocationPin/>
                강원특별자치도..
              </S.LocationText>
            </S.RecommendCard>
          </S.RecommendScroll>
        </S.RecommendSection>

        <S.Divider/>

        <S.ListSection>
          {loading ? (
            <div>데이터를 불러오는 중입니다...</div>
          ) : animals.length === 0 ? (
            <div>등록된 보호 동물이 없습니다</div>
          ) : (
            animals.map((animal) => (
              <S.AnimalCard key={animal.id}>
                <S.AnimalImgBox>
                  {animal.imageUrl ? (
                    <Image
                    src={getFullImageUrl(animal.imageUrl)}
                    alt={animal.breed}
                    width={95}
                    height={95}
                    unoptimized
                    loading="eager"/>
                  ) : (
                    <S.ShelterPhotoEmpty>사진 없음</S.ShelterPhotoEmpty>
                  )}
                </S.AnimalImgBox>
                <S.AnimalInfo>
                  <S.BadgeGroup>
                    <S.Badge $type="status">{animal.status === "COMPLETED" ? "완료" : "공고중"}</S.Badge>
                    <S.Badge
                    $type={animal.gender === "FEMALE" ? "female" : animal.gender === "MALE" ? "male" : "unknown"}>
                      {animal.gender === "MALE" ? "수컷" : animal.gender === "FEMALE" ? "암컷" : "미상"}
                    </S.Badge>
                  </S.BadgeGroup>
                  <S.InfoGrid>
                    <span className="label">품종</span>
                    <span className="value">{animal.breed}</span>
                    <span className="label">공고번호</span>
                    <span className="value">{animal.noticeNo}</span>
                    <span className="label">등록날짜</span>
                    <span className="value">{animal.regDate}</span>
                    <span className="label">구조장소</span>
                    <span className="value">{animal.rescueLocation}</span>
                  </S.InfoGrid>
                </S.AnimalInfo>
              </S.AnimalCard>
            ))
          )}
        </S.ListSection>
      </S.Container>
      <Footer/>
    </S.AppWrapper>
  );
};
