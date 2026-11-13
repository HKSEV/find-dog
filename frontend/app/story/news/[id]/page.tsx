"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchStoryContents } from "../../../redux/storySlice";
import { toImageUrl } from "../../../shelter/animalFormat";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

// "2026-11-10T09:30:00" -> "2026.11.10"
const toDate = (iso: string) => (iso ? iso.substring(0, 10).replaceAll("-", ".") : "");

// 💡 보호소 소식 상세 (/story/news/[id]). 상세 API가 없어서 목록을 받아 같은 id를 찾음
export default function ShelterNewsDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const {news, loading, error} = useSelector((state: RootState) => state.story);
  const item = news.find((entry) => entry.id === id);

  useEffect(() => {
    if (news.length === 0) dispatch(fetchStoryContents());
  }, [dispatch, news.length]);

  const handleBack = () => (window.history.length > 1 ? router.back() : router.push("/story"));

  if (!item) {
    const message = loading || (news.length === 0 && !error) ? "불러오는 중이에요" : error ? error : "삭제됐거나 없는 소식이에요";
    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="보호소 소식" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{message}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const imageUrl = toImageUrl(item.imageUrl);
  const videoUrl = item.videoUrl?.trim();
  const attachmentUrl = toImageUrl(item.attachmentUrl?.trim());

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="보호소 소식" onBackClick={handleBack}/>
        <S.HeaderOffset/>
        <S.DetailPage>
          {imageUrl && <S.VolunteerHeroImage src={imageUrl} alt=""/>}
          <S.DetailSection>
            <S.CommunityPostKind>보호소 소식</S.CommunityPostKind>
            <S.DetailTitle>{item.title}</S.DetailTitle>
            <S.DetailNotice>{toDate(item.insertDt)}</S.DetailNotice>
            <S.DetailText>{item.content}</S.DetailText>
            {(videoUrl || attachmentUrl) && (
              <S.NewsLinks>
                {videoUrl && <a href={videoUrl} target="_blank" rel="noopener noreferrer">영상 보기</a>}
                {attachmentUrl && <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">첨부 파일 보기</a>}
              </S.NewsLinks>
            )}
          </S.DetailSection>
        </S.DetailPage>
      </S.Container>
    </S.AppWrapper>
  );
};
