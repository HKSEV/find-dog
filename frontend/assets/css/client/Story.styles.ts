import Image from "next/image";
import { Plus } from "lucide-react";
import * as S from "@/assets/css/style.styles";
import styled from "styled-components";

export const StorySubTabs = styled.div`
  && {
    display: flex;
    gap: 16px;
    padding: 12px 16px;
    background-color: #FFF;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 1px solid #F1F3F5;
  }
`;

export const StorySubTab = styled.span<{$active: boolean}>`
  && {
    cursor: pointer;
    color: ${({$active}) => ($active ? "#FF7A00" : "#888")};
    border-bottom: ${({$active}) => ($active ? "2px solid #FF7A00" : "none")};
    padding-bottom: 4px;
  }
`;

export const WriteIcon = styled(Plus).attrs({size: 20, color: "#FFF"})``;

export const StoryFilters = styled(S.FilterContainer)`
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
    color: #888;
    cursor: pointer;
  }
`;

export const GridViewIcon = styled.span`
  && {
    font-size: 18px;
  }
`;

export const StoryAlert = styled(S.AlertBanner)`
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
    color: #888;
  }
`;

export const StoryCard = styled.div`
  && {
    background-color: #FFF;
    border-bottom: 8px solid #F8F9FA;
    padding: 16px;
  }
`;

export const FeaturedCard = styled.div`
  && {
    background-color: #FFF5EB;
    border-radius: 12px;
    padding: 12px;
    border: 1px solid #FFE8D6;
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
    background-color: #FF7A00;
    color: #FFF;
    font-size: 11px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

export const FeaturedTime = styled.span`
  && {
    font-size: 11px;
    color: #888;
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
    color: #222;
    margin-bottom: 4px;
  }
`;

export const FeaturedDescription = styled.div`
  && {
    font-size: 12px;
    color: #666;
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
    color: #888;
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
    background-color: #E4E5E7;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #555;
  }
`;

export const AuthorName = styled.div`
  && {
    font-size: 13px;
    font-weight: bold;
    color: #333;
  }
`;

export const AuthorTime = styled.div`
  && {
    font-size: 10px;
    color: #AAA;
  }
`;

export const PostMenu = styled.span`
  && {
    font-size: 11px;
    color: #999;
  }
`;

export const StoryTitle = styled.div`
  && {
    font-size: 15px;
    font-weight: bold;
    color: #111;
    margin-bottom: 6px;
  }
`;

export const StoryDescription = styled.div`
  && {
    font-size: 13px;
    color: #444;
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
    color: #888;
    border-top: 1px solid #F1F3F5;
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
