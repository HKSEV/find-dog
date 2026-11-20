"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchNeedHelps } from "../../redux/homeSlice";
import { setActiveTab } from "../../redux/shelterSlice";
import { toImageUrl } from "../animalFormat";
import { POLICY_CONTACT } from "../../mypage/policyTexts";
import Header from "@/app/components/Header";
import ShareSheet from "@/app/components/ShareSheet";
import * as S from "@/assets/css/Style.styles";

const dateText = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}.${date.getMonth() + 1}.${String(date.getDate()).padStart(2, "0")} 올림`;
};

// 💡 도움 요청 상세: 사진·내용 전체 + 영상·자료 + "이렇게 도울 수 있어요"
//    (예전엔 목록에서 펼쳐 보기만 해서, 읽고 나서 할 수 있는 일이 없었음)
//    도울 방법: 봉사 신청 / 보호 중인 친구 입양 / 운영팀에 물품·임시 보호 문의 / 주변에 알리기
export default function HelpDetail({id}: {id: number}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {needHelps} = useSelector((state: RootState) => state.home);
  const [loaded, setLoaded] = useState(needHelps.length > 0);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    dispatch(fetchNeedHelps()).finally(() => setLoaded(true));
  }, [dispatch]);

  const help = needHelps.find((item) => item.id === id) ?? null;
  const handleBack = () => (window.history.length > 1 ? router.back() : router.push("/shelter"));

  if (!help) {
    return (
      <S.AppWrapper>
        <S.Container>
          <Header title="도움이 필요해요" onBackClick={handleBack}/>
          <S.HeaderOffset/>
          <S.AdoptEmpty>{loaded ? "마감됐거나 없는 도움 요청이에요" : "불러오는 중이에요"}</S.AdoptEmpty>
        </S.Container>
      </S.AppWrapper>
    );
  };

  const imageUrl = toImageUrl(help.imageUrl);
  const videoUrl = toImageUrl(help.videoUrl);
  const attachmentUrl = toImageUrl(help.attachmentUrl);
  const mail = `mailto:${POLICY_CONTACT}?subject=${encodeURIComponent(`[도움 요청] ${help.title}`)}`;
  const shareContent = {
    title: `[도움이 필요해요] ${help.title}`,
    description: help.content.length > 60 ? `${help.content.slice(0, 60)}…` : help.content,
    imageUrl,
    path: `/shelter/help/?id=${help.id}`
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header
        title="도움이 필요해요"
        onBackClick={handleBack}
        action={(
          <S.HeaderRoundButton type="button" aria-label="공유하기" title="공유하기" onClick={() => setSharing(true)}>
            <S.DetailShareIcon aria-hidden="true"/>
          </S.HeaderRoundButton>
        )}/>
        <S.HeaderOffset/>
        <S.DetailPage>
          {imageUrl && <S.VolunteerHeroImage src={imageUrl} alt=""/>}

          <S.DetailSection>
            <S.DetailTitle>{help.title}</S.DetailTitle>
            {dateText(help.insertDt) && <S.DetailNotice>{dateText(help.insertDt)}</S.DetailNotice>}
            <S.DetailText style={{marginTop: 14}}>{help.content}</S.DetailText>
            {(videoUrl || attachmentUrl) && (
              <S.HelpLinks>
                {videoUrl && <a href={videoUrl} target="_blank" rel="noopener noreferrer">영상 보기 ›</a>}
                {attachmentUrl && <a href={attachmentUrl} target="_blank" rel="noopener noreferrer">자료 보기 ›</a>}
              </S.HelpLinks>
            )}
          </S.DetailSection>

          <S.DetailSection>
            <S.DetailHeading>이렇게 도울 수 있어요</S.DetailHeading>
            <S.HelpWays>
              <S.HelpWay as={Link} href="/shelter" onClick={() => dispatch(setActiveTab("봉사"))}>
                <div><strong>봉사 신청하기</strong><small>협력 보호소의 산책·청소 봉사에 함께해요</small></div>
                <S.MyMenuChevron aria-hidden="true"/>
              </S.HelpWay>
              <S.HelpWay as={Link} href="/shelter" onClick={() => dispatch(setActiveTab("입양"))}>
                <div><strong>새 가족 되어 주기</strong><small>보호 중인 친구를 입양하면 자리가 생겨요</small></div>
                <S.MyMenuChevron aria-hidden="true"/>
              </S.HelpWay>
              <S.HelpWay href={mail}>
                <div><strong>물품 후원·임시 보호 문의</strong><small>운영팀이 협력 보호소와 연결해 드려요 ({POLICY_CONTACT})</small></div>
                <S.MyMenuChevron aria-hidden="true"/>
              </S.HelpWay>
            </S.HelpWays>
          </S.DetailSection>
        </S.DetailPage>

        <S.DetailActionBar>
          <S.DetailApplyButton type="button" onClick={() => setSharing(true)}>주변에 알리기</S.DetailApplyButton>
        </S.DetailActionBar>
      </S.Container>
      {sharing && <ShareSheet content={shareContent} note="도움이 필요한 소식을 주변에 알려 주세요." onClose={() => setSharing(false)}/>}
    </S.AppWrapper>
  );
};
