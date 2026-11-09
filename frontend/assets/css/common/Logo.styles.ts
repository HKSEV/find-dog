import styled from "styled-components";
import React from "react";

export const LogoText = styled.h1`
  color: #FF8C00;
  font-size: 1.3rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.5px;
`;

export const LogoSvg = styled.svg<{$cursor?: React.CSSProperties["cursor"]}>`
  && {
    cursor: ${({$cursor}) => $cursor};
  }
`;
