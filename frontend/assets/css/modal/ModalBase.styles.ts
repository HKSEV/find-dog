"use client";

import styled from "styled-components";
import {
  BgWhite,
  BoxShadow,
  Fixed,
  FlexCenter,
  H100,
  Pointer,
  TransitionAll,
  W100
} from "@/assets/css/common/CommonBase.styles";

export const ModalOverlay = styled.div`
  ${Fixed};
  top: 0;
  left: 0;
  ${W100};
  ${H100};
  background: rgba(0, 0, 0, 0.5);
  ${FlexCenter};
  z-index: 99999;
`;

export const ModalContent = styled.div`
  ${BgWhite};
  padding: 24px;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  ${BoxShadow};
`;

export const SubmitButton = styled.button`
  ${W100};
  background: #FF6B6B;
  color: #FFF;
  padding: 0.8rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: bold;
  ${Pointer};
  margin-top: 8px;
  ${TransitionAll};
  &:hover {
    background: #FA5252;
  }
`;
