"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchCampaigns } from "../redux/homeSlice";
import { toImageUrl } from "./animalFormat";

import { PlayArrow as PlayIcon } from "@mui/icons-material";
import * as S from "@/assets/css/Style.styles";

const CAMPAIGN_COUNT = 3;

// 💡 함께해요 > 입양 맨 위: 입양 캠페인 (관리자가 올린 캠페인, /api/campaigns)
//    처음엔 한 개만, 전체보기를 누르면 해시태그로 골라 보기
export default function CampaignSection() {
  const dispatch = useDispatch<AppDispatch>();
  const campaigns = useSelector((state: RootState) => state.home.campaigns);
  const [showAll, setShowAll] = useState(false);
  const [pickedTag, setPickedTag] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCampaigns(""));
  }, [dispatch]);

  // 캠페인에 달린 해시태그 (중복 없이 올라온 순서대로)
  const hashtags = useMemo(
    () => [...new Set(campaigns.map((campaign) => campaign.hashtag).filter(Boolean))],
    [campaigns]
  );

  if (campaigns.length === 0) return null;

  const visibleCampaigns = showAll
    ? campaigns.filter((campaign) => !pickedTag || campaign.hashtag === pickedTag).slice(0, CAMPAIGN_COUNT)
    : campaigns.slice(0, 1);

  return (
    <S.VolunteerSection $first>
      <S.VolunteerSectionHead>
        <S.VolunteerSectionTitle>입양 캠페인</S.VolunteerSectionTitle>
        {campaigns.length > 1 && (
          <S.VolunteerMoreButton
          type="button"
          onClick={() => {
            setShowAll((prev) => !prev);
            setPickedTag(null);
          }}>
            {showAll ? "접기" : "전체보기"}
          </S.VolunteerMoreButton>
        )}
      </S.VolunteerSectionHead>

      {showAll && hashtags.length > 1 && (
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
          href={toImageUrl(campaign.mediaUrl)} // 직접 올린 영상(/uploads/...)은 백엔드 주소를 붙임, 유튜브는 그대로
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
  );
};
