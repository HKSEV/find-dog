"use client";

import styled from "styled-components";
import { Ohidden, Relative, W100, H100 } from "@/assets/css/common/CommonBase.styles";

//Thumb
export const Thumb = styled.div`
  ${Relative};
  border-radius: 8px;
  ${Relative};
  aspect-ratio: 16/9;
`;
export const VideoThumb = styled.img`
  ${W100};
  ${H100};
  object-fit: cover;
`;

export const CampaignMediaWrap = styled.div`
  ${Relative};
  ${W100};
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  ${Ohidden};
  background-color: #F0F0F0;
`;
