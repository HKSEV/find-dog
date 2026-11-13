"use client";

import {
  ChevronRightRounded as ChevronIcon,
  PersonOutlineRounded as PersonIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 마이 탭 (디자인 개편 시안 기준)

// 로그인 전: 로그인 / 회원가입 안내
export const MyLoginCard = styled.section`
  margin: 8px 20px 0;
  padding: 22px 20px;
  border-radius: 14px;
  background-color: ${colors.brandBg};
  color: ${colors.gray900};
`;

export const MyLoginTitle = styled.p`
  margin: 0;
  font-size: 17px;
  font-weight: ${fontWeight.bold};
  line-height: 1.45;
`;

export const MyLoginButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
`;

export const MyLoginButton = styled.a<{$primary?: boolean}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-radius: 10px;
  background-color: ${({$primary}) => ($primary ? colors.brand : colors.white)};
  color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  font-size: 15px;
  font-weight: ${fontWeight.semibold};
  text-decoration: none;

  &:hover {
    color: ${({$primary}) => ($primary ? colors.white : colors.gray900)};
  }
`;

// 로그인 후: 프로필
export const MyProfile = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 20px 0;
`;

export const MyAvatar = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 999px;
  overflow: hidden;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray400};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const MyAvatarIcon = styled(PersonIcon)`
  && {
    font-size: 32px;
  }
`;

export const MyProfileText = styled.span`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    overflow: hidden;
    font-size: 18px;
    font-weight: ${fontWeight.bold};
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    display: block;
    overflow: hidden;
    margin-top: 2px;
    font-size: 13px;
    color: ${colors.gray500};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

// 섹션
export const MySection = styled.section`
  padding: 26px 0 0;
`;

export const MySectionHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

export const MySectionTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: ${fontWeight.bold};
  color: ${colors.gray900};
`;

export const MySectionCount = styled.span`
  font-size: 13px;
  color: ${colors.gray500};
`;

export const MyEmpty = styled.p`
  margin: 0;
  padding: 12px 20px 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${colors.gray500};

  a {
    color: ${colors.brand};
    font-weight: ${fontWeight.semibold};
  }
`;

// 관심 동물 (가로 줄)
export const MyLikedStrip = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 20px 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MyLikedCard = styled.a`
  flex: none;
  width: 104px;
  color: ${colors.gray900};
  text-decoration: none;

  &:hover {
    color: ${colors.gray900};
  }
`;

export const MyLikedImage = styled.img`
  display: block;
  width: 104px;
  height: 104px;
  object-fit: cover;
  border-radius: 10px;
`;

export const MyLikedEmptyImage = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  border-radius: 10px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray500};
  font-size: 11px;
`;

export const MyLikedName = styled.span`
  display: block;
  overflow: hidden;
  margin-top: 6px;
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const MyBand = styled.div`
  height: 8px;
  margin-top: 26px;
  background-color: ${colors.bgSubtle};
`;

// 메뉴 목록
export const MyMenu = styled.section`
  padding: 8px 20px 24px;
`;

// 설정 맨 아래 로그아웃 (메뉴와 떨어뜨려 실수로 누르지 않게)
export const SettingsLogout = styled.button`
  display: block;
  width: calc(100% - 40px);
  height: 48px;
  margin: 8px 20px 0;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  background-color: ${colors.white};
  color: ${colors.gray500};
  font-size: 15px;
  font-weight: ${fontWeight.medium};
  text-align: center;
  line-height: 46px;
  cursor: pointer;

  &&:hover {
    color: ${colors.gray500};
  }
`;

export const MyMenuTitle = styled.h2`
  margin: 16px 0 4px;
  font-size: 13px;
  font-weight: ${fontWeight.semibold};
  color: ${colors.gray500};
`;

export const MyMenuItem = styled.a<{$disabled?: boolean}>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 52px;
  /* 버튼으로 쓸 때(로그아웃)도 같은 모양 */
  padding: 0;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  background: transparent;
  font-family: inherit;
  text-align: left;
  border-bottom: 1px solid ${colors.bgSubtle};
  color: ${({$disabled}) => ($disabled ? colors.gray400 : colors.gray900)};
  font-size: 15px;
  text-decoration: none;
  cursor: ${({$disabled}) => ($disabled ? "default" : "pointer")};

  &:hover {
    color: ${({$disabled}) => ($disabled ? colors.gray400 : colors.gray900)};
  }

  span {
    flex: 1;
  }

  small {
    font-size: 12px;
    color: ${colors.gray400};
  }
`;

export const MyMenuChevron = styled(ChevronIcon)`
  && {
    font-size: 20px;
    color: ${colors.gray400};
  }
`;
