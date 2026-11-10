"use client";

import styled from "styled-components";
import {
  Fixed,
  FlexBetween,
  Fw500,
  IconColor,
  MainColor,
  Pointer,
  Sticky,
  W100
} from "@/assets/css/common/CommonBase.styles";

export const Header = styled.header`
  ${Fixed};

  top: 0;
  left: 50%;
  transform: translateX(-50%);

  margin: 0 auto;
  z-index: 9999;
  ${W100};
  max-width: 480px; /* 💡 컨테이너 최대 크기와 일치시킴 */
  box-sizing: border-box;
  height: 56px; /* 💡 시안 기준. 각 화면은 HeaderOffset(56px)으로 헤더 아래 여백을 둠 */
  padding: 0 20px;
  ${FlexBetween};
  background-color: #FFF;
`;

export const Logo = styled.h4`
  margin: 0;
  ${Fw500};
  ${MainColor};
`;

export const Back = styled.span`
  width: 60px;
  ${Pointer};
  ${MainColor};
  transition: all 0.5s;

  &:hover {
    color: #333;
  }
`;

export const ShelterHeader = styled.header`
  background-color: #FFF;
  padding: 15px 20px;
  ${FlexBetween};
  ${Sticky};
  top: 0;
  z-index: 10;
`;

export const SectionHeader = styled.div`
  ${FlexBetween};
  padding-right: 20px;
  margin-bottom: 15px;
  .more-link {
    font-size: 0.85rem;
    ${IconColor};
    text-decoration: none;
  }
`;
