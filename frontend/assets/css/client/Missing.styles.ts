"use client";

import styled from "styled-components";
import { colors } from "./theme";
import { MapPin, Calendar, Plus } from "lucide-react";

export const LocationIcon = styled(MapPin).attrs({size: 14, color: colors.gray500})``;
export const DateIcon = styled(Calendar).attrs({size: 14, color: colors.gray500})``;
export const MissingWriteIcon = styled(Plus).attrs({size: 20, color: colors.white})``;

// 사진이 없는 실종 글 (외부 임시 이미지 대신)
export const MissingPhotoEmpty = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 13px;
  color: ${colors.gray500};
`;
