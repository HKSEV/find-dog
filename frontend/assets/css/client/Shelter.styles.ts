"use client";

import {
  TuneOutlined as FilterIcon,
  FmdGood as LocationIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import styled from "styled-components";

export const FilterIconButton = styled(FilterIcon)`
  && {
    font-size: 20px;
    color: #666;
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
