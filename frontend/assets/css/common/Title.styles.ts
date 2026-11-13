"use client";

import styled from "styled-components";
import {
  Fw600,
  MainColor,
  TextCenterMixin as TextCenter
} from "@/assets/css/common/CommonBase.styles";

//title
export const H5Bold = styled.h5`
  flex: 1;
  margin: 0;
  ${TextCenter};
  ${Fw600};
  letter-spacing: -0.03rem;
  ${MainColor};
`;
