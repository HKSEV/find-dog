"use client";

import Image from "next/image";

import styled from "styled-components";
import { coolGray, adminColors } from "@/assets/css/admin/AdminBase.styles";
import {
  AdminFormCard,
  AdminFormCardHeader,
  AdminFormColumn,
  AdminFormButton,
  AdminFormCardBody
} from "@/assets/css/admin/AdminForm.styles";

export const IntegratePageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  color: ${coolGray[800]};
`;

export const IntegrateFormCard = styled(AdminFormCard)`
  box-shadow: ${adminColors.cardShadow} !important;
  margin-bottom: 1.5rem !important;
`;

export const IntegrateFormCardHeader = styled(AdminFormCardHeader)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`;

export const IntegrateCardTitle = styled.h6`
  margin: 0 !important;
  font-weight: 700 !important;
  color: ${adminColors.primary} !important;
`;

export const IntegrateInsetFormGroup = styled.div`
  margin-bottom: 1.5rem !important;
  padding: 1rem !important;
  background-color: ${coolGray[50]} !important;
  border-radius: 0.25rem !important;
`;

export const IntegrateFieldLabel = styled.label`
  font-weight: 700 !important;
  color: ${coolGray[800]};
`;

export const IntegrateCategoryOptions = styled.div`
  display: flex !important;
  gap: 0.75rem;
  margin-top: 0.5rem !important;
`;

export const IntegrateRadioOption = styled.div`
  position: relative;
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5rem;
  margin-right: 1rem !important;
`;

export const CategoryLabel = styled.label`
  position: relative;
  margin-bottom: 0;
  vertical-align: top;
  font-weight: 700 !important;
  color: ${adminColors.primary} !important;
`;

export const IntegrateFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const IntegrateEmphasizedLabel = styled.label`
  font-weight: 700 !important;
`;

export const IntegrateHelpText = styled.small`
  display: block;
  margin-top: 0.25rem;
  color: ${coolGray[500]} !important;
`;

export const IntegrateFormSection = styled.div`
  margin-bottom: 1.5rem !important;
`;

export const IntegratePreviewBox = styled.div`
  margin-bottom: 1.5rem !important;
  text-align: center !important;
`;

export const VideoThumbnail = styled(Image)`
  padding: 0.25rem;
  background-color: #FFF;
  border: 1px solid ${coolGray[200]};
  border-radius: 0.25rem;
  max-width: 100%;
  height: auto;
  && {
    width: auto;
    height: auto;
  }
`;

export const IntegratePrimaryLabel = styled.label`
  font-weight: 700 !important;
  color: ${adminColors.primary} !important;
`;

export const AttachmentColumn = styled(AdminFormColumn)`
  margin-bottom: 1.5rem !important;
`;

export const IntegrateSubmitButton = styled(AdminFormButton)`
  display: block;
  width: 100%;
  width: 100% !important;
  font-weight: 700 !important;
  padding: 1rem !important;
  margin-top: 1.5rem !important;
`;

export const IntegrateGuideBody = styled(AdminFormCardBody)`
  color: ${coolGray[800]};
`;
