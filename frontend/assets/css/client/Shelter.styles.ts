"use client";

import {
  TuneOutlined as FilterIcon,
  FmdGood as LocationIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors } from "./theme";

export const FilterIconButton = styled(FilterIcon)`
  && {
    font-size: 20px;
    color: ${colors.gray500};
  }
`;

export const MoreChevron = styled(ChevronRightIcon)`
  && {
    font-size: 18px;
  }
`;

export const LocationPin = styled(LocationIcon)`
  && {
    font-size: 16px;
  }
`;

// 사진이 없는 보호 동물 (외부 임시 이미지 대신)
export const ShelterPhotoEmpty = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: ${colors.gray500};
`;
