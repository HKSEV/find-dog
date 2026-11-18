"use client";

import { ShareRounded as ShareIcon, LinkRounded as LinkIcon, MoreHorizRounded as MoreIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 공유하기 (상세 화면 상단 공유 버튼 + 아래에서 올라오는 공유 시트)

export const DetailShareIcon = styled(ShareIcon)`
  && {
    font-size: 20px;
  }
`;

export const ShareSheetOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10003;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

export const ShareSheet = styled.div`
  width: 100%;
  max-width: 480px;
  box-sizing: border-box;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
  border-radius: 18px 18px 0 0;
  background-color: ${colors.white};
`;

export const ShareSheetHandle = styled.span`
  display: block;
  width: 40px;
  height: 4px;
  margin: 0 auto 16px;
  border-radius: 2px;
  background-color: ${colors.gray200};
`;

export const ShareSheetTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray900};
`;

export const ShareSheetNote = styled.p`
  margin: 0 0 20px;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray500};
`;

export const ShareOptions = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 8px;
`;

export const ShareOption = styled.button`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border: 0;
  background: none;
  font-size: 13px;
  color: ${colors.gray800};
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const ShareOptionCircle = styled.span<{$tone: "kakao" | "gray"}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background-color: ${({$tone}) => ($tone === "kakao" ? colors.kakao : colors.bgSubtle)};
  color: ${colors.gray900};
`;

// 카카오 말풍선 (카카오 디자인 가이드의 노란 바탕 + 검은 말풍선)
export const ShareKakaoMark = styled.svg`
  width: 24px;
  height: 24px;
`;

export const ShareLinkIcon = styled(LinkIcon)`
  && {
    font-size: 24px;
  }
`;

export const ShareMoreIcon = styled(MoreIcon)`
  && {
    font-size: 24px;
  }
`;

export const ShareCancelButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 20px;
  border: 0;
  border-radius: 12px;
  background-color: ${colors.bgSubtle};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray800};
  cursor: pointer;
`;
