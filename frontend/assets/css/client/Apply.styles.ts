"use client";

import { FavoriteRounded as HeartFilledIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 입양 신청서 (/shelter/[id]/apply), 입양 신청 내역 (/mypage/applications)
//    입력 칸·선택 버튼·아래 고정 버튼은 MissingWrite.styles의 Write* 를 같이 씀

// 신청할 친구 요약
export const ApplyAnimal = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${colors.bgLight};

  strong {
    display: block;
    font-size: 15px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  small {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

// 신청할 친구·신청 내역의 작은 사진 (없으면 빈 칸)
export const ApplyThumb = styled.img`
  flex: none;
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 8px;
`;

export const ApplyThumbEmpty = styled.span`
  flex: none;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background-color: ${colors.bgSubtle};
`;

export const ApplyNotice = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray800};
`;

// 2칸 / 3칸 선택 버튼 줄
export const ApplyChoiceGroup = styled.div<{$columns: number}>`
  display: grid;
  grid-template-columns: repeat(${({$columns}) => $columns}, minmax(0, 1fr));
  gap: 8px;
`;

export const ApplyAgree = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray800};
  cursor: pointer;

  input {
    flex: none;
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: ${colors.brand};
  }
`;

// 신청 완료
export const ApplyDone = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 56px 24px 24px;
  text-align: center;

  h2 {
    margin: 8px 0 0;
    font-size: 20px;
    font-weight: ${fontWeight.bold};
    color: ${colors.gray900};
  }

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: ${colors.gray500};
  }
`;

export const ApplyDoneIcon = styled(HeartFilledIcon)`
  && {
    font-size: 40px;
    color: ${colors.brand};
  }
`;

export const ApplyDoneButtons = styled.div`
  display: grid;
  gap: 8px;
  width: 100%;
  margin-top: 20px;
`;

export const ApplyButton = styled.a<{$primary?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border: 1px solid ${({$primary}) => ($primary ? colors.brand : colors.border)};
  border-radius: 12px;
  background-color: ${({$primary}) => ($primary ? colors.brand : colors.white)};
  color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  }
`;

// ==========================================
// 입양 신청 내역
// ==========================================

export const ApplicationList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 8px 20px 32px;
  list-style: none;
`;

export const ApplicationCard = styled.li<{$muted?: boolean}>`
  padding: 16px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  opacity: ${({$muted}) => ($muted ? 0.7 : 1)};
`;

export const ApplicationHead = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900};
  }
`;

export const ApplicationTitle = styled.span`
  flex: 1;
  min-width: 0;

  small {
    display: block;
    font-size: 11px;
    font-weight: ${fontWeight.semibold};
    color: ${colors.brand};
  }

  strong {
    display: block;
    margin-top: 2px;
    overflow: hidden;
    font-size: 15px;
    font-weight: ${fontWeight.semibold};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    margin-top: 2px;
    font-size: 12px;
    color: ${colors.gray500};
  }
`;

// 3단계 진행 막대 (접수 / 보호소에 전달 / 결과)
export const ApplicationBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  margin-top: 14px;
`;

export const ApplicationBarStep = styled.span<{$on?: boolean; $tone?: "done" | "stop"}>`
  height: 4px;
  border-radius: 999px;
  background-color: ${({$on, $tone}) => (!$on ? colors.border : $tone === "stop" ? colors.gray400 : colors.brand)};
`;

export const ApplicationBarLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  margin-top: 6px;
  font-size: 11px;
  color: ${colors.gray500};

  b {
    font-weight: ${fontWeight.semibold};
    color: ${colors.brand};
  }
`;

export const ApplicationStatusBox = styled.div`
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: ${colors.gray800};

  strong {
    display: block;
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }

  q {
    display: block;
    margin-top: 4px;
    padding: 8px 10px;
    border-radius: 8px;
    background-color: ${colors.bgLight};
    color: ${colors.gray800};
    quotes: none;
  }

  a {
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;

export const ApplicationCancel = styled.button<{$danger?: boolean}>`
  height: 36px;
  margin-top: 12px;
  padding: 0 12px;
  border: 1px solid ${({$danger}) => ($danger ? colors.danger : colors.border)};
  border-radius: 8px;
  background-color: ${colors.white};
  color: ${({$danger}) => ($danger ? colors.danger : colors.gray800)};
  font-size: 13px;
  cursor: pointer;

  &:disabled {
    color: ${colors.gray400};
    cursor: default;
  }
`;

// 신청 취소 확인 (카드 안에서 한 번 더 묻기)
export const ApplicationConfirm = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 8px;

  span {
    flex-basis: 100%;
    margin-top: 12px;
    font-size: 13px;
    color: ${colors.gray800};
  }

  button {
    margin-top: 8px;
  }
`;
