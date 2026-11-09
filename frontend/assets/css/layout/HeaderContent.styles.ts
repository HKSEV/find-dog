import * as S from "@/assets/css/Style.styles";
import { NotificationsOutlined as NotificationsNoneIcon, PersonOutlined as PersonOutlineIcon } from "@mui/icons-material";
import styled from "styled-components";

export const HeaderActions = styled.div`
  && {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const AccountIcon = styled(PersonOutlineIcon)`
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

export const HeaderSpacer = styled(S.None)`
  && {
    width: 60px;
  }
`;
