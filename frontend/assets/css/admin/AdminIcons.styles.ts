"use client";

import styled, { css } from "styled-components";
import {
  FaTachometerAlt,
  FaUsers,
  FaCogs,
  FaImage,
  FaInfoCircle,
  FaBriefcase,
  FaBlog,
  FaMapMarkerAlt,
  FaEnvelope,
  FaAngleRight,
  FaAngleLeft,
  FaBars,
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaDownload,
  FaCalendar
} from "react-icons/fa";

const icon = css`
  display: inline-block;
  width: 1.25em;
  height: 1em;
  vertical-align: -0.125em;
  flex-shrink: 0;
`;

export const Dashboard = styled(FaTachometerAlt)`
  ${icon}
`;
export const Users = styled(FaUsers)`
  ${icon}
`;
export const Settings = styled(FaCogs)`
  ${icon}
`;
export const Image = styled(FaImage)`
  ${icon}
`;
export const Info = styled(FaInfoCircle)`
  ${icon}
`;
export const Work = styled(FaBriefcase)`
  ${icon}
`;
export const Blog = styled(FaBlog)`
  ${icon}
`;
export const Location = styled(FaMapMarkerAlt)`
  ${icon}
`;
export const Contact = styled(FaEnvelope)`
  ${icon}
`;
export const Expand = styled(FaAngleRight)`
  ${icon}
`;
export const Collapse = styled(FaAngleLeft)`
  ${icon}
`;
export const Menu = styled(FaBars)`
  ${icon}
`;
export const Search = styled(FaSearch)`
  ${icon}
`;
export const User = styled(FaUser)`
  ${icon}
`;
export const SignOut = styled(FaSignOutAlt)`
  ${icon}
`;
export const Download = styled(FaDownload)`
  ${icon}
`;
export const Calendar = styled(FaCalendar)`
  ${icon}
`;
