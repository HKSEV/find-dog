"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCampaigns, fetchHomeExtras } from "../redux/homeSlice";
import { toImageUrl } from "./animalFormat";

import { PlayArrow as PlayIcon } from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

const HELP_COUNT = 3;
const CAMPAIGN_COUNT = 3;

// 💡 입양·봉사 탭 > 함께해요
//    도움이 필요해요(/api/need-help), 입양 캠페인(/api/campaigns)은 관리자가 올린 글을 보여줌
//    봉사 모집·후원은 만들지 않기로 해서 뺌 (보호소 후원 링크가 생기면 다시 넣기)
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


  return (
    <>
      {/* 도움이 필요해요 */}
      <S.VolunteerSection $first>
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
              // 영상·자세히 보기 링크가 있으면 새 창으로, 없으면 누를 수 없는 카드
              <S.VolunteerCampaign
              key={campaign.id}
              as={campaign.mediaUrl ? "a" : "div"}
              href={campaign.mediaUrl || undefined}
              target={campaign.mediaUrl ? "_blank" : undefined}
              rel={campaign.mediaUrl ? "noopener noreferrer" : undefined}>
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
    </>
  );
};
