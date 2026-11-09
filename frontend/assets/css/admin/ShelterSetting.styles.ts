"use client";

import Image from "next/image";

import styled from "styled-components";
import {
  AdminFormCard,
  AdminFormCardHeader,
  Row,
  AdminFormColumn,
  AdminFormButton,
  AdminFormCardBody
} from "@/assets/css/admin/AdminForm.styles";

export const ShelterSettingPageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  color: #1E2939;
`;

export const ShelterSettingFormCard = styled(AdminFormCard)`
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  margin-bottom: 1.5rem !important;
`;

export const ShelterSettingFormCardHeader = styled(AdminFormCardHeader)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`;

export const WarningCardTitle = styled.h6`
  margin: 0 !important;
  font-weight: 700 !important;
  color: #FFC107 !important;
`;

export const ShelterSettingInsetFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
  padding: 1rem !important;
  background-color: #F8F9FA !important;
  border-radius: 0.25rem !important;
`;

export const ShelterSettingFieldLabel = styled.label`
  font-weight: 700 !important;
  color: #1E2939;
`;

export const FieldRow = styled(Row)`
  margin-bottom: 1rem !important;
`;

export const ShelterSettingFieldColumn = styled(AdminFormColumn)`
  margin-bottom: 1rem;
`;

export const ShelterSettingEmphasizedLabel = styled.label`
  font-weight: 700 !important;
`;

export const ShelterSettingFormDivider = styled.hr`
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
`;

export const ShelterSettingFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const ShelterSettingPrimaryLabel = styled.label`
  font-weight: 700 !important;
  color: #007BFF !important;
`;

export const ImageSourceOptions = styled.div`
  display: flex !important;
  gap: 1rem;
  margin-bottom: 1rem !important;
  margin-top: 0.5rem !important;
`;

export const ShelterSettingPreviewBox = styled.div`
  margin-bottom: 1.5rem !important;
  text-align: center !important;
`;

export const ShelterPreviewImage = styled(Image)`
  padding: 0.25rem;
  background-color: #FFF;
  border: 1px solid #DEE2E6;
  border-radius: 0.25rem;
  max-width: 100%;
  height: auto;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
  && {
    width: auto;
    height: auto;
    max-height: 200px;
  }
`;

export const ShelterSettingFormSection = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
`;

export const ShelterSettingSubmitButton = styled(AdminFormButton)`
  display: block;
  width: 100%;
  width: 100% !important;
  font-weight: 700 !important;
  padding: 1rem !important;
  margin-top: 1.5rem !important;
  color: #343A40 !important;
`;

export const ShelterSettingGuideBody = styled(AdminFormCardBody)`
  color: #1E2939;
`;
