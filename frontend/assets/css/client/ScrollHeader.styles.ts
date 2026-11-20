"use client";

import { SearchRounded as SearchIcon, ArrowBackIosNewRounded as BackIcon, CancelRounded as ClearIcon, NotificationsNoneRounded as BellIcon } from "@mui/icons-material";
import styled from "styled-components";
import { colors, fontWeight } from "./theme";

// 💡 스크롤하면 숨는 헤더 + 둥근 아이콘 (실종·제보 목록)
//    헤더가 숨으면 같은 기능의 둥근 버튼만 오른쪽 위에 떠 있음

export const HeaderActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  /* 화면별 버튼 줄이 알림 종 앞에 들어가면, 그 줄의 마지막 버튼은 오른쪽으로 당기지 않음 */
  & & > :last-child {
    margin-right: 0;
  }
`;

// 헤더 안 아이콘 버튼 (검색 등)
export const HeaderRoundButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${colors.gray900};
  text-decoration: none;
  cursor: pointer;

  /* 마지막 버튼은 아이콘이 오른쪽 여백(20px) 선에 맞도록 바깥으로 당김 */
  &:last-child {
    margin-right: -8px;
  }

  svg {
    font-size: 26px;
  }
`;

// 헤더가 숨었을 때 오른쪽 위에 떠 있는 둥근 버튼 묶음
export const FloatingHeaderActions = styled.div<{$show: boolean}>`
  position: fixed;
  top: 10px;
  right: max(16px, calc(50% - 240px + 16px));
  z-index: 10000;
  display: flex;
  gap: 8px;
  opacity: ${({$show}) => ($show ? 1 : 0)};
  pointer-events: ${({$show}) => ($show ? "auto" : "none")};
  transform: translateY(${({$show}) => ($show ? "0" : "-8px")});
  transition: opacity 0.2s, transform 0.2s;
`;

export const FloatingRoundButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: ${colors.gray900};
  cursor: pointer;

  svg {
    font-size: 24px;
  }
`;

export const HeaderSearchIcon = styled(SearchIcon)``;


// 검색 중일 때 헤더 자리를 채우는 검색창
export const SearchBar = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  max-width: 480px;
  height: 56px;
  box-sizing: border-box;
  padding: 0 12px 0 6px;
  background-color: ${colors.white};
  transform: translateX(-50%);
`;

export const SearchBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.gray900};
  cursor: pointer;
`;

export const SearchBackIcon = styled(BackIcon)`
  && {
    font-size: 20px;
  }
`;

export const SearchField = styled.label`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 10px 0 12px;
  border-radius: 10px;
  background-color: ${colors.bgSubtle};
  color: ${colors.gray500};

  input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    font-size: 15px;
    color: ${colors.gray900};
  }

  /* 브라우저 기본 지우기(X)는 숨기고 직접 만든 지우기 버튼만 */
  input::-webkit-search-cancel-button {
    display: none;
  }

  svg {
    font-size: 20px;
  }
`;

export const SearchClearButton = styled.button`
  display: flex;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${colors.gray400};
  cursor: pointer;
`;

export const SearchClearIcon = styled(ClearIcon)``;

export const SearchHint = styled.p`
  margin: 8px 20px 0;
  font-size: 13px;
  color: ${colors.gray500};

  strong {
    font-weight: ${fontWeight.semibold};
    color: ${colors.gray900};
  }
`;

// 💡 하단 탭 첫 화면 헤더 오른쪽 알림 종 (홈 말고 다른 탭에서도 바로 알림으로)
export const TabBellButton = styled(HeaderRoundButton)`
  position: relative;
`;

export const TabBellIcon = styled(BellIcon)``;

export const TabBellDot = styled.span`
  position: absolute;
  top: 7px;
  right: 8px;
  width: 8px;
  height: 8px;
  border: 2px solid ${colors.white};
  border-radius: 999px;
  background-color: #E5484D;
`;

// 홈 로고 감싸기: 길게 누르면 시연 계정 고르기 (글자 선택·휴대폰 길게 누르기 메뉴가 뜨지 않게)
export const LogoHold = styled.span`
  display: inline-flex;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
`;
