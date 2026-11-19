"use client";

import styled from "styled-components";
import {
  Fixed,
  MainMaxWidth,
  Mauto,
  FlexColumn,
  Pointer,
  W100
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
  z-index: 999999;

  /* 💡 시안처럼 5칸으로 똑같이 나눔. 예전 space-around는 글자 길이(홈 20px, 입양·봉사 39px)에 따라
     탭 사이 간격이 74·83·81·73px로 달라 보였음. 각 칸 전체를 누를 수 있게 링크가 칸을 꽉 채움 */
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  & > a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-decoration: none;
  }
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

// 탭 아이콘 + 오른쪽 위 빨간 숫자 (안 읽은 채팅)
export const NavIconWrap = styled.span`
  position: relative;
  display: inline-flex;
`;

export const NavBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border: 1.5px solid #FFF;
  border-radius: 999px;
  background-color: #DC3545;
  font-size: 9px !important;
  font-weight: 600;
  line-height: 13px;
  color: #FFF;
  text-align: center;
`;
