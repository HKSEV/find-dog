"use client";

import styled from "styled-components";
import { AdminSettingFieldGrid } from "@/assets/css/admin/AdminBase.styles";

export const CampaignTitleFields = styled(AdminSettingFieldGrid)`
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);

  @media (max-width: 767px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
