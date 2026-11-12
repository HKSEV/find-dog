"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCampaigns, fetchHomeExtras } from "../redux/homeSlice";
import { toImageUrl } from "./animalFormat";

import { showToast } from "@/app/components/Toast";
import { PlayArrow as PlayIcon } from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

const HELP_COUNT = 3;
const CAMPAIGN_COUNT = 3;

// 💡 입양·봉사 탭 > 봉사·후원
//    도움이 필요해요(/api/need-help), 입양 캠페인(/api/campaigns)은 관리자가 올린 글을 보여줌
//    봉사 모집, 후원은 백엔드가 아직 없어서 안내만
export default function VolunteerTab() {
  const dispatch = useDispatch<AppDispatch>();
  const {campaigns, needHelps} = useSelector((state: RootState) => state.home);

  const [openHelpId, setOpenHelpId] = useState<number | null>(null);
  const [showAllHelps, setShowAllHelps] = useState(false);
  const [pickedTag, setPickedTag] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchHomeExtras());
    dispatch(fetchCampaigns(""));
  }, [dispatch]);

  // 캠페인에 달린 해시태그 (중복 없이 올라온 순서대로)
  const hashtags = useMemo(
    () => [...new Set(campaigns.map((campaign) => campaign.hashtag).filter(Boolean))],
    [campaigns]
  );

  const visibleCampaigns = campaigns
    .filter((campaign) => !pickedTag || campaign.hashtag === pickedTag)
    .slice(0, CAMPAIGN_COUNT);

  const visibleHelps = showAllHelps ? needHelps : needHelps.slice(0, HELP_COUNT);

  const openCampaign = (mediaUrl?: string) => {
    if (mediaUrl) {
      window.open(mediaUrl, "_blank", "noopener,noreferrer");
    } else {
      showToast("캠페인 자세한 내용은 준비 중이에요.");
    };
  };

  return (
    <>
      {/* 봉사 모집 */}
      <S.VolunteerSection $first>
        <S.VolunteerSectionHead>
          <S.VolunteerSectionTitle>봉사 모집</S.VolunteerSectionTitle>
        </S.VolunteerSectionHead>
        <S.VolunteerNotice>
          <strong>보호소 봉사 모집을 준비하고 있어요</strong>
          <span>산책, 견사 청소, 미용·목욕 봉사를 여기서 신청할 수 있게 할게요.</span>
        </S.VolunteerNotice>
      </S.VolunteerSection>

      <S.VolunteerBand/>

      {/* 도움이 필요해요 */}
      <S.VolunteerSection>
        <S.VolunteerSectionHead>
          <S.VolunteerSectionTitle>도움이 필요해요</S.VolunteerSectionTitle>
          {needHelps.length > HELP_COUNT && (
            <S.VolunteerMoreButton type="button" onClick={() => setShowAllHelps((prev) => !prev)}>
              {showAllHelps ? "접기" : "전체보기"}
            </S.VolunteerMoreButton>
          )}
        </S.VolunteerSectionHead>

        {needHelps.length === 0 ? (
          <S.VolunteerEmpty>지금 올라온 도움 요청이 없어요</S.VolunteerEmpty>
        ) : (
          <S.VolunteerList>
            {visibleHelps.map((help) => {
              const isOpen = openHelpId === help.id;
              const imageUrl = toImageUrl(help.imageUrl);
              return (
                <S.VolunteerHelpItem key={help.id}>
                  <S.VolunteerHelpRow
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenHelpId(isOpen ? null : help.id)}>
                    {imageUrl ? <S.VolunteerHelpThumb src={imageUrl} alt=""/> : <S.VolunteerThumbEmpty/>}
                    <S.VolunteerHelpBody>
                      <S.VolunteerHelpTitle>{help.title}</S.VolunteerHelpTitle>
                      {!isOpen && <S.VolunteerHelpSummary>{help.content}</S.VolunteerHelpSummary>}
                    </S.VolunteerHelpBody>
                    <S.VolunteerHelpToggle>{isOpen ? "접기" : "자세히"}</S.VolunteerHelpToggle>
                  </S.VolunteerHelpRow>
                  {isOpen && <S.VolunteerHelpContent>{help.content}</S.VolunteerHelpContent>}
                </S.VolunteerHelpItem>
              );
            })}
          </S.VolunteerList>
        )}
      </S.VolunteerSection>

      {/* 입양 캠페인 */}
      {campaigns.length > 0 && (
        <S.VolunteerSection>
          <S.VolunteerSectionHead>
            <S.VolunteerSectionTitle>입양 캠페인</S.VolunteerSectionTitle>
          </S.VolunteerSectionHead>

          {hashtags.length > 1 && (
            <S.VolunteerTags>
              <S.VolunteerTag type="button" $active={!pickedTag} aria-pressed={!pickedTag} onClick={() => setPickedTag(null)}>
                전체
              </S.VolunteerTag>
              {hashtags.map((tag) => (
                <S.VolunteerTag
                key={tag}
                type="button"
                $active={pickedTag === tag}
                aria-pressed={pickedTag === tag}
                onClick={() => setPickedTag(tag)}>
                  {tag}
                </S.VolunteerTag>
              ))}
            </S.VolunteerTags>
          )}

          {visibleCampaigns.map((campaign) => {
            const thumbnail = toImageUrl(campaign.thumbnailUrl);
            return (
              <S.VolunteerCampaign key={campaign.id} type="button" onClick={() => openCampaign(campaign.mediaUrl)}>
                <S.VolunteerCampaignThumbWrap>
                  {thumbnail ? <S.VolunteerCampaignThumb src={thumbnail} alt=""/> : <S.VolunteerThumbEmpty $size="96px"/>}
                  {campaign.mediaType && campaign.mediaType !== "IMAGE" && (
                    <S.VolunteerPlayBadge><PlayIcon/></S.VolunteerPlayBadge>
                  )}
                </S.VolunteerCampaignThumbWrap>
                <S.VolunteerCampaignBody>
                  <S.VolunteerCampaignTitle>{campaign.title}</S.VolunteerCampaignTitle>
                  {campaign.content && <S.VolunteerCampaignText>{campaign.content}</S.VolunteerCampaignText>}
                </S.VolunteerCampaignBody>
              </S.VolunteerCampaign>
            );
          })}
        </S.VolunteerSection>
      )}

      <S.VolunteerBand/>

      {/* 후원하기 */}
      <S.VolunteerSection>
        <S.VolunteerSectionHead>
          <S.VolunteerSectionTitle>후원하기</S.VolunteerSectionTitle>
        </S.VolunteerSectionHead>
        <S.SupportGrid>
          <S.SupportCard type="button" $primary onClick={() => showToast("정기 후원은 준비 중이에요.")}>
            <strong>정기 후원</strong>
            <span>보호소 운영비를 매달 함께</span>
          </S.SupportCard>
          <S.SupportCard type="button" onClick={() => showToast("물품 후원은 준비 중이에요.")}>
            <strong>물품 후원</strong>
            <span>사료, 패드, 담요 보내기</span>
          </S.SupportCard>
        </S.SupportGrid>
      </S.VolunteerSection>
    </>
  );
};
