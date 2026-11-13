"use client";

import styled from "styled-components";
import {
  Relative,
  BoxShadow,
  W100,
  Ohidden,
  FlexStart
} from "@/assets/css/common/CommonBase.styles";

// Style.styles.ts 파일 수정

export const AppWrapper = styled.div`
  ${FlexStart};
  background-color: #333;
  min-height: 100vh;
  ${W100};
  ${Relative};
  ${Ohidden};
`;

export const Container = styled.div`
  ${W100};
  max-width: 480px;
  min-height: 100vh;
  background-color: #FFF;
  ${Relative};
  padding-bottom: 70px;
  ${BoxShadow};
  margin: 0 auto; /* 💡 박스를 항상 정중앙에 위치시킴 */
`;

// 💡 고정 헤더(56px) 아래에서 본문이 시작하도록 두는 여백
export const HeaderOffset = styled.div`
  margin-top: 56px;
`;
