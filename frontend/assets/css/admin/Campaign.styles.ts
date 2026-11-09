import Image from "next/image";
import * as F from "@/assets/css/admin/AdminForm.styles";
import styled from "styled-components";

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  color: #1E2939;
`;

export const FormCard = styled(F.Card)`
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  margin-bottom: 1.5rem !important;
`;

export const FormCardHeader = styled(F.CardHeader)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`;

export const CardTitle = styled.h6`
  margin: 0 !important;
  font-weight: 700 !important;
  color: #007BFF !important;
`;

export const FormSection = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
`;

export const FieldLabel = styled.label`
  color: #1E2939;
`;

export const CategoryOptions = styled.div`
  display: flex !important;
  gap: 0.75rem;
  margin-top: 0.5rem !important;
`;

export const RadioOption = styled.div`
  position: relative;
  display: block;
  min-height: 1.5rem;
  padding-left: 1.5rem;
  margin-right: 1rem !important;
`;

export const RadioLabel = styled.label`
  position: relative;
  margin-bottom: 0;
  vertical-align: top;
`;

export const FieldColumn = styled(F.Column)`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const EmphasizedLabel = styled.label`
  font-weight: 700 !important;
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

export const InsetFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
  padding: 1rem !important;
  background-color: #F8F9FA !important;
  border-radius: 0.25rem !important;
`;

export const PrimaryLabel = styled.label`
  font-weight: 700 !important;
  color: #007BFF !important;
`;

export const PreviewBox = styled.div`
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

export const SubmitButton = styled(F.Button)`
  display: block;
  width: 100%;
`;

export const GuideBody = styled(F.CardBody)`
  color: #1E2939;
`;
