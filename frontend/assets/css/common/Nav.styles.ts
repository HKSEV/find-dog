"use client";

import styled from "styled-components";
import {
  Fixed,
  MainMaxWidth,
  Mauto,
  FlexAround,
  FlexColumn,
  Pointer,
  W100,
  IconColor,
  Fw600
} from "@/assets/css/common/CommonBase.styles";

export const BottomNav = styled.nav`
  ${W100};
  ${Fixed};
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  ${MainMaxWidth};
  ${Mauto};
  height: 3.75rem;
  background-color: #FFF; /* 💡 시안 기준 흰색. 브랜드 색은 선택된 탭에만 */
  border-top: 1px solid #EEE;
  ${FlexAround};
  z-index: 999999;
`;

interface NavItemProps {
  $active?: boolean;
}

export const NavItem = styled.div<NavItemProps>`
  ${FlexColumn};
  gap: 0.0005rem;
  ${Pointer};

  /* 선택 안 된 탭도 흰 배경에서 읽히는 진한 회색 (예전 #AE948F는 흰 배경에서 너무 흐림) */
  color: ${(props) => (props.$active ? "#8A4E4B" : "#6B6361")};

  svg {
    font-size: 20px;
    margin-bottom: 0.05px;
  }

  span {
    font-size: 0.65rem;
    color: ${(props) => (props.$active ? "#8A4E4B" : "#6B6361")};
    font-weight: ${(props) => (props.$active ? "700" : "400")};
  }
`;

export const MenuText = styled.div`
  ${IconColor};
  font-size: 0.6875rem;
  ${Fw600};
`;

export const FilterContainer = styled.div`
  padding: 15px 20px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  background-color: #FFF;
  &::-webkit-scrollbar {
    display: none;
  }
`;
