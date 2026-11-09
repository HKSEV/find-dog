"use client";

import { NotificationsOutlined as NotificationsNoneIcon, PersonOutlined as PersonOutlineIcon } from "@mui/icons-material";
import styled from "styled-components";
import { None } from "@/assets/css/common/Placeholder.styles";

export const HeaderActions = styled.div`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const HeaderAccountIcon = styled(PersonOutlineIcon)`
  && {
    cursor: pointer;
    color: #8A4E4B;
    font-size: 30px;
  }
`;

export const NotificationIcon = styled(NotificationsNoneIcon)`
  && {
    cursor: pointer;
    color: #8A4E4B;
    font-size: 28px;
  }
`;

export const HeaderSpacer = styled(None)`
  && {
    width: 60px;
  }
`;
