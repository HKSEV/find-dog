"use client";

import styled from "styled-components";
import React from "react";

export const LogoSvg = styled.svg<{$cursor?: React.CSSProperties["cursor"]}>`
  && {
    cursor: ${({$cursor}) => $cursor};
  }
`;
