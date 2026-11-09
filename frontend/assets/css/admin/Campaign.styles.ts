"use client";

import Image from "next/image";

import styled from "styled-components";
import {
  AdminFormCard,
  AdminFormCardHeader,
  AdminFormColumn,
  AdminFormButton,
  AdminFormCardBody
} from "@/assets/css/admin/AdminForm.styles";

export const AdminCampaignPageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  color: #1E2939;
`;

export const AdminCampaignFormCard = styled(AdminFormCard)`
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  margin-bottom: 1.5rem !important;
`;

export const AdminCampaignFormCardHeader = styled(AdminFormCardHeader)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`;

export const AdminCampaignCardTitle = styled.h6`
  margin: 0 !important;
  font-weight: 700 !important;
  color: #007BFF !important;
`;

export const AdminCampaignFormSection = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
`;

export const AdminCampaignFieldLabel = styled.label`
  color: #1E2939;
`;

export const AdminCampaignCategoryOptions = styled.div`
  display: flex !important;
  gap: 0.75rem;
  margin-top: 0.5rem !important;
`;

export const AdminCampaignRadioOption = styled.div`
  position: relative;
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5rem;
  margin-right: 1rem !important;
`;

export const AdminCampaignRadioLabel = styled.label`
  position: relative;
  margin-bottom: 0;
  vertical-align: top;
`;

export const AdminCampaignFieldColumn = styled(AdminFormColumn)`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const AdminCampaignEmphasizedLabel = styled.label`
  font-weight: 700 !important;
`;

export const AdminCampaignFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const AdminCampaignInsetFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
  padding: 1rem !important;
  background-color: #F8F9FA !important;
  border-radius: 0.25rem !important;
`;

export const AdminCampaignPrimaryLabel = styled.label`
  font-weight: 700 !important;
  color: #007BFF !important;
`;

export const AdminCampaignPreviewBox = styled.div`
  margin-bottom: 1.5rem !important;
  text-align: center !important;
`;

export const CampaignPreviewImage = styled(Image)`
  && {
    width: auto;
    max-width: 100%;
    height: auto;
  }
`;

export const AdminCampaignSubmitButton = styled(AdminFormButton)`
  display: block;
  width: 100%;
`;

export const AdminCampaignGuideBody = styled(AdminFormCardBody)`
  color: #1E2939;
`;
