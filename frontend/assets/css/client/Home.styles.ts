"use client";

import styled from "styled-components";
import { colors } from "./theme";

import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Grid } from "@/assets/css/common/CommonBase.styles";
import { StatLabel } from "@/assets/css/common/Input.styles";

// 💡 홈 유튜브 / 펠로우 소식 / 도움이 필요해요 목록
export const HomeGrid = styled.div<{$cols: number; $gap: string}>`
  ${Grid};
  grid-template-columns: repeat(${({$cols}) => $cols}, minmax(0, 1fr));
  column-gap: 30px;
  row-gap: ${({$gap}) => $gap};
  padding-bottom: ${({$gap}) => $gap};
`;

export const RescueLabel = styled(StatLabel).attrs({$color: colors.success})``;
export const AdoptionLabel = styled(StatLabel).attrs({$color: colors.info})``;
export const EuthanasiaLabel = styled(StatLabel).attrs({$color: colors.danger})``;

export const IntroductionIcon = styled(InfoOutlinedIcon)`
  && {
    color: ${colors.brandLight};
  }
`;

export const AdoptionIcon = styled(VolunteerActivismOutlinedIcon)`
  && {
    color: ${colors.brandLight};
  }
`;

export const DonationIcon = styled(SavingsOutlinedIcon)`
  && {
    color: ${colors.brandLight};
  }
`;

export const SupportIcon = styled(CardGiftcardOutlinedIcon)`
  && {
    color: ${colors.brandLight};
  }
`;

export const StoreIcon = styled(StorefrontOutlinedIcon)`
  && {
    color: ${colors.brandLight};
  }
`;

export const CampaignPlayIcon = styled(PlayArrowIcon)`
  && {
    font-size: 18px;
  }
`;
