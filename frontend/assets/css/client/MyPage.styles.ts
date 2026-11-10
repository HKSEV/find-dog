"use client";

import {
  WorkspacePremiumOutlined as PremiumIcon,
  EditNoteOutlined as EditNoteIcon,
  MailOutlined as MailIcon,
  PersonOutlined as PersonIcon,
  PetsOutlined as PetsIcon,
  InfoOutlined as InfoIcon,
  HelpOutlined as HelpIcon,
  ChatBubbleOutlined as ChatIcon,
  CameraAltOutlined as CameraIcon,
  CreateOutlined as PenIcon,
  PlayCircleOutlined as PlayIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import styled from "styled-components";
import { colors } from "./theme";

export const MembershipIcon = styled(PremiumIcon)`
  && {
    color: ${colors.accent};
    font-size: 32px;
  }
`;

export const ApplicationIcon = styled(EditNoteIcon)`
  && {
    color: ${colors.accent};
    font-size: 32px;
  }
`;

export const MessageIcon = styled(MailIcon)`
  && {
    color: ${colors.accent};
    font-size: 32px;
  }
`;

export const MyPageAccountIcon = styled(PersonIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const FavoriteIcon = styled(PetsIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const NoticeIcon = styled(InfoIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const HelpMenuIcon = styled(HelpIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const ContactIcon = styled(ChatIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const InstagramIcon = styled(CameraIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const BlogIcon = styled(PenIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const VideoIcon = styled(PlayIcon)`
  && {
    color: ${colors.gray500};
  }
`;

export const ListChevron = styled(ChevronRightIcon)`
  && {
    color: ${colors.gray400};
  }
`;
