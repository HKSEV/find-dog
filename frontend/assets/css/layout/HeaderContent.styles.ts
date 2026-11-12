"use client";

import {
  NotificationsOutlined as NotificationsNoneIcon,
  PersonOutlined as PersonOutlineIcon,
  ArrowBackIosNewRounded as BackIcon,
  CloseRounded as CloseIcon,
  SettingsOutlined as SettingsIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { None } from "@/assets/css/common/Placeholder.styles";
import { fluid, fontWeight } from "@/assets/css/client/theme";

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
    font-size: ${fluid(18, 20)};
    font-weight: ${fontWeight.bold};
    line-height: 36px;
    letter-spacing: -0.5px;
    color: #222;
  }
`;

// 💡 서브·닫기 헤더의 뒤로(<) / 닫기(X) 버튼
//    누르는 영역은 44px, 아이콘은 왼쪽(오른쪽) 여백 20px 선에 맞도록 바깥으로 10px 당김
export const HeaderIconButton = styled.button<{$side: "left" | "right"}>`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin: ${({$side}) => ($side === "left" ? "0 0 0 -10px" : "0 -10px 0 0")};
    padding: 0;
    border: 0;
    background: transparent;
    color: #222;
    cursor: pointer;
  }
`;

export const HeaderBackIcon = styled(BackIcon)`
  && {
    font-size: 20px;
  }
`;

export const HeaderSettingsIcon = styled(SettingsIcon)`
  && {
    font-size: 24px;
  }
`;

export const HeaderCloseIcon = styled(CloseIcon)`
  && {
    font-size: 26px;
  }
`;

// 가운데 제목이 정확히 가운데 오도록 반대쪽에 버튼과 같은 너비(44 - 10)를 비워 둠
export const HeaderSpacer = styled(None)`
  && {
    width: 34px;
  }
`;
