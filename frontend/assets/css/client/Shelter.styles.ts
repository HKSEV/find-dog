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
