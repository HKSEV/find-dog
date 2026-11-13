"use client";

import styled from "styled-components";
import { colors, fontWeight, fluid } from "./theme";

// 💡 입양·봉사 탭 > 함께해요 (디자인 개편 시안 기준)

export const VolunteerSection = styled.section<{$first?: boolean}>`
  padding: ${({$first}) => ($first ? "8px 20px 0" : "24px 20px 0")};
`;

export const VolunteerSectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const VolunteerSectionTitle = styled.h2`
  margin: 0;
  font-size: ${fluid(17, 19)};
  font-weight: ${fontWeight.bold};
  letter-spacing: -0.4px;
  color: ${colors.gray900};
`;

export const VolunteerMoreButton = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 13px;
  color: ${colors.gray500};
  cursor: pointer;
`;

export const VolunteerEmpty = styled.p`
  margin: 0;
  padding: 16px 0 0;
  font-size: 13px;
  color: ${colors.gray500};
`;

// 도움이 필요해요
export const VolunteerList = styled.ul`
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
`;

export const VolunteerHelpItem = styled.li`
  border-bottom: 1px solid ${colors.border};

  &:last-child {
    border-bottom: 0;
  }
`;

export const VolunteerHelpRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 0;
  border: 0;
  background: transparent;
  color: ${colors.gray900};
  text-align: left;
  cursor: pointer;
`;

export const VolunteerHelpThumb = styled.img`
  flex: none;
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
`;

export const VolunteerThumbEmpty = styled.span<{$size?: string}>`
  flex: none;
  display: block;
  width: ${({$size}) => $size ?? "64px"};
  height: ${({$size}) => $size ?? "64px"};
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
`;

export const VolunteerHelpBody = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const VolunteerHelpTitle = styled.span`
  overflow: hidden;
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const VolunteerHelpSummary = styled.span`
  overflow: hidden;
  font-size: 12px;
  color: ${colors.gray500};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const VolunteerHelpToggle = styled.span`
  flex: none;
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.brand};
`;

export const VolunteerHelpContent = styled.p`
  margin: 0;
  padding: 0 0 14px 76px;
  font-size: 14px;
  line-height: 1.7;
  color: ${colors.gray800};
  white-space: pre-line;
`;

// 입양 캠페인
export const VolunteerTags = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 12px;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const VolunteerTag = styled.button<{$active?: boolean}>`
  flex: none;
  padding: 7px 12px;
  border: 0;
  border-radius: 8px;
  background-color: ${({$active}) => ($active ? colors.brand : colors.bgSubtle)};
  color: ${({$active}) => ($active ? colors.white : colors.gray800)};
  font-size: 13px;
  font-weight: ${({$active}) => ($active ? fontWeight.semibold : fontWeight.regular)};
  cursor: pointer;
`;

// 링크가 있으면 a(새 창), 없으면 div
export const VolunteerCampaign = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  margin-top: 14px;
  color: ${colors.gray900};
  text-decoration: none;
`;

export const VolunteerCampaignThumbWrap = styled.span`
  position: relative;
  flex: none;
  display: block;
`;

export const VolunteerCampaignThumb = styled.img`
  display: block;
  width: 96px;
  height: 96px;
  object-fit: cover;
  border-radius: 10px;
`;

export const VolunteerPlayBadge = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;
  border-radius: 999px;
  background-color: rgba(31, 27, 26, 0.6);
  color: ${colors.white};

  svg {
    font-size: 20px;
  }
`;

export const VolunteerCampaignBody = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const VolunteerCampaignTitle = styled.span`
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  line-height: 1.4;
`;

export const VolunteerCampaignText = styled.span`
  display: -webkit-box;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray500};
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
