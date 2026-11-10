"use client";

import styled from "styled-components";
import { colors } from "./theme";
import { MapPin, Calendar, Plus } from "lucide-react";

export const LocationIcon = styled(MapPin).attrs({size: 14, color: colors.gray500})``;
export const DateIcon = styled(Calendar).attrs({size: 14, color: colors.gray500})``;
export const MissingWriteIcon = styled(Plus).attrs({size: 20, color: colors.white})``;
