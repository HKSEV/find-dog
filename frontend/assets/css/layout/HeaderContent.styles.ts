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

// 💡 하단 탭 첫 화면용 헤더 제목 (뒤로 버튼 없이 왼쪽에 큰 제목, 높이는 메인 헤더 로고와 같게)
//    글자 크기는 메인 로고 글자·서브 헤더 제목과 같은 20px
export const HeaderTabTitle = styled.h1`
  && {
    margin: 0;
    font-size: 20px;
    font-weight: 800;
    line-height: 36px;
    letter-spacing: -0.5px;
    color: #222;
  }
`;

export const HeaderSpacer = styled(None)`
  && {
    width: 60px;
  }
`;
