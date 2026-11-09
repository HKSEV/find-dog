import styled from "styled-components";
import { Grid } from "../common/Common.styles";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { StatLabel } from "../common/Input.styles";

// 💡 홈 유튜브 / 펠로우 소식 / 도움이 필요해요 목록
export const HomeGrid = styled.div<{$cols: number; $gap: string}>`
  ${Grid};
  grid-template-columns: repeat(${({$cols}) => $cols}, minmax(0, 1fr));
  column-gap: 30px;
  row-gap: ${({$gap}) => $gap};
  padding-bottom: ${({$gap}) => $gap};
`;

export const RescueLabel = styled(StatLabel).attrs({$color: "#198754"})``;
export const AdoptionLabel = styled(StatLabel).attrs({$color: "#0D6EFD"})``;
export const EuthanasiaLabel = styled(StatLabel).attrs({$color: "#DC3545"})``;

export const IntroductionIcon = styled(InfoOutlinedIcon)`
  && {
    color: #B5A196;
  }
`;

export const AdoptionIcon = styled(VolunteerActivismOutlinedIcon)`
  && {
    color: #B5A196;
  }
`;

export const DonationIcon = styled(SavingsOutlinedIcon)`
  && {
    color: #B5A196;
  }
`;

export const SupportIcon = styled(CardGiftcardOutlinedIcon)`
  && {
    color: #B5A196;
  }
`;

export const StoreIcon = styled(StorefrontOutlinedIcon)`
  && {
    color: #B5A196;
  }
`;

export const CampaignPlayIcon = styled(PlayArrowIcon)`
  && {
    font-size: 18px;
  }
`;
