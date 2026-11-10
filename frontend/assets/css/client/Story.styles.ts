"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

import styled from "styled-components";
import { colors } from "./theme";
import { FilterContainer } from "@/assets/css/common/Nav.styles";
import { AlertBanner } from "@/assets/css/client/MissingReport.styles";

export const StorySubTabs = styled.div`
  && {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
    background-color: ${colors.white};
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid ${colors.bgSubtle};
  }
`;

export const StorySubTab = styled.span<{$active: boolean}>`
  && {
    cursor: pointer;
    color: ${({$active}) => ($active ? colors.accent : colors.gray400)};
    border-bottom: ${({$active}) => ($active ? `2px solid ${colors.accent}` : "none")};
    padding-bottom: 4px;
  }
`;

export const StoryWriteIcon = styled(Plus).attrs({size: 20, color: colors.white})``;

export const StoryFilters = styled(FilterContainer)`
  && {
    border-bottom: none;
    padding-bottom: 8px;
  }
`;

export const ViewOptions = styled.div`
  && {
    margin-left: auto;
    display: flex;
    gap: 6px;
    color: ${colors.gray400};
    cursor: pointer;
  }
`;

export const GridViewIcon = styled.span`
  && {
    font-size: 18px;
  }
`;

export const StoryAlert = styled(AlertBanner)`
  && {
    margin-top: 4px;
    margin-bottom: 8px;
  }
`;

export const StoryList = styled.div`
  && {
    padding-bottom: 30px;
  }
`;

export const LoadingMessage = styled.div`
  && {
    text-align: center;
    padding: 40px;
    color: ${colors.gray400};
  }
`;

export const StoryCard = styled.div`
  && {
    background-color: ${colors.white};
    border-bottom: 8px solid ${colors.bgLight};
    padding: 16px;
  }
`;

export const FeaturedCard = styled.div`
  && {
    background-color: ${colors.accentBg};
    border-radius: 12px;
    padding: 12px;
    border: 1px solid ${colors.accentBorder};
  }
`;

export const FeaturedHeader = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
`;

export const FeaturedBadge = styled.span`
  && {
    background-color: ${colors.accent};
    color: ${colors.white};
    font-size: 11px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

export const FeaturedTime = styled.span`
  && {
    font-size: 11px;
    color: ${colors.gray400};
  }
`;

export const FeaturedContent = styled.div`
  && {
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

export const FeaturedImage = styled(Image)`
  && {
    width: 70px;
    height: 70px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

export const FeaturedTitle = styled.div`
  && {
    font-size: 14px;
    font-weight: bold;
    color: ${colors.gray900};
    margin-bottom: 4px;
  }
`;

export const FeaturedDescription = styled.div`
  && {
    font-size: 12px;
    color: ${colors.gray500};
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const FeaturedStats = styled.div`
  && {
    font-size: 11px;
    color: ${colors.gray400};
    margin-top: 6px;
  }
`;

export const StoryHeader = styled.div`
  && {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
`;

export const AuthorDetails = styled.div`
  && {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const AuthorAvatar = styled.div`
  && {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: ${colors.bgMuted};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: ${colors.gray500};
  }
`;

export const AuthorName = styled.div`
  && {
    font-size: 13px;
    font-weight: bold;
    color: ${colors.gray800};
  }
`;

export const AuthorTime = styled.div`
  && {
    font-size: 10px;
    color: ${colors.gray400};
  }
`;

export const PostMenu = styled.span`
  && {
    font-size: 11px;
    color: ${colors.gray400};
  }
`;

export const StoryTitle = styled.div`
  && {
    font-size: 15px;
    font-weight: bold;
    color: ${colors.gray900};
    margin-bottom: 6px;
  }
`;

export const StoryDescription = styled.div`
  && {
    font-size: 13px;
    color: ${colors.gray800};
    line-height: 1.4;
    margin-bottom: 12px;
  }
`;

export const StoryImages = styled.div`
  && {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    overflow-x: auto;
  }
`;

export const StoryImage = styled(Image)`
  && {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    object-fit: cover;
  }
`;

export const StoryActions = styled.div`
  && {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: ${colors.gray400};
    border-top: 1px solid ${colors.bgSubtle};
    padding-top: 10px;
  }
`;

export const CommentCount = styled.div`
  && {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
