"use client";

import Image from "next/image";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setImageInputType, updateShelterField, submitShelterAnimal } from "../../redux/shelterAdminSlice";

import { Layout } from "../../components/layout/Layout";
import * as A from "@/assets/css/style.styles";
import * as F from "@/assets/css/admin/AdminForm.styles";
import styled from "styled-components";

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0 !important;
  color: #1e2939;
`;

const FormCard = styled(F.Card)`
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  margin-bottom: 1.5rem !important;
`;

const FormCardHeader = styled(F.CardHeader)`
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
`;

const WarningCardTitle = styled.h6`
  margin: 0 !important;
  font-weight: 700 !important;
  color: #ffc107 !important;
`;

const InsetFormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
  padding: 1rem !important;
  background-color: #f8f9fa !important;
  border-radius: 0.25rem !important;
`;

const FieldLabel = styled.label`
  font-weight: 700 !important;
  color: #1e2939;
`;

const FieldRow = styled(F.Row)`
  margin-bottom: 1rem !important;
`;

const FieldColumn = styled(F.Column)`
  margin-bottom: 1rem;
`;

const EmphasizedLabel = styled.label`
  font-weight: 700 !important;
`;

const FormDivider = styled.hr`
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1rem !important;
`;

const PrimaryLabel = styled.label`
  font-weight: 700 !important;
  color: #007bff !important;
`;

const ImageSourceOptions = styled.div`
  display: flex !important;
  gap: 1rem;
  margin-bottom: 1rem !important;
  margin-top: 0.5rem !important;
`;

const PreviewBox = styled.div`
  margin-bottom: 1.5rem !important;
  text-align: center !important;
`;

const ShelterPreviewImage = styled(Image)`
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
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

const FormSection = styled.div`
  margin-bottom: 1rem;
  margin-bottom: 1.5rem !important;
`;

const SubmitButton = styled(F.Button)`
  display: block;
  width: 100%;
  width: 100% !important;
  font-weight: 700 !important;
  padding: 1rem !important;
  margin-top: 1.5rem !important;
  color: #343a40 !important;
`;

const GuideBody = styled(F.CardBody)`
  color: #1e2939;
`;

export default function ShelterAdmin() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {imageInputType, formData, isLoading} = useSelector((state: RootState) => state.shelterAdmin);

  // 파일 객체는 직렬화 이슈로 로컬 상태 유지
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      dispatch(updateShelterField({name: "imageUrl", value: ""})); // 파일 업로드 시 링크 초기화
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    dispatch(updateShelterField({name: name as keyof RootState["shelterAdmin"]["formData"], value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(submitShelterAnimal({formData, imageFile}));

    if (submitShelterAnimal.fulfilled.match(resultAction)) {
      alert("보호 동물이 성공적으로 등록되었습니다.");
      setImageFile(null); // 등록 성공 시 파일 상태 초기화
    } else {
      alert(resultAction.payload || "서버 오류가 발생했습니다. 잠시후 다시 시도해 주세요");
    };
  };

  return (
    <Layout>
      <A.PageHeader>
        <PageTitle>보호소 데이터 관리</PageTitle>
      </A.PageHeader>
      <A.GridRow>
        <F.Column $lg={8}>
          <FormCard>
            <FormCardHeader>
              <WarningCardTitle>신규 보호 동물 등록</WarningCardTitle>
            </FormCardHeader>
            <F.CardBody>
              <form onSubmit={handleSubmit}>
                <InsetFormGroup>
                  <F.Row>
                    <F.Column $md={6}>
                      <FieldLabel>공고상태</FieldLabel>
                      <F.Select name="status" value={formData.status} onChange={handleChange}>
                        <option value="ACTIVE">공고중 (보호중)</option>
                        <option value="COMPLETED">입양 완료 / 종료</option>
                      </F.Select>
                    </F.Column>
                    <F.Column $md={6}>
                      <FieldLabel>성별</FieldLabel>
                      <F.Select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="UNKNOWN">성별 미상</option>
                        <option value="MALE">수컷</option>
                        <option value="FEMALE">암컷</option>
                      </F.Select>
                    </F.Column>
                  </F.Row>
                </InsetFormGroup>

                {/* 2. 기본 정보 입력 */}
                <FieldRow>
                  <FieldColumn $md={6}>
                    <EmphasizedLabel>품종</EmphasizedLabel>
                    <F.Control
                    name="breed"
                    placeholder="예: [개] 푸들, [고양이] 코숏"
                    value={formData.breed}
                    onChange={handleChange}
                    required/>
                  </FieldColumn>
                  <FieldColumn $md={6}>
                    <EmphasizedLabel>공고번호</EmphasizedLabel>
                    <F.Control
                    name="noticeNo"
                    placeholder="예: 충북 청주-2026-00001"
                    value={formData.noticeNo}
                    onChange={handleChange}
                    required/>
                  </FieldColumn>
                </FieldRow>
                <FieldRow>
                  <FieldColumn $md={6}>
                    <EmphasizedLabel>등록날짜</EmphasizedLabel>
                    <F.Control type="date" name="regDate" value={formData.regDate} onChange={handleChange} required/>
                  </FieldColumn>
                  <FieldColumn $md={6}>
                    <EmphasizedLabel>구조장소</EmphasizedLabel>
                    <F.Control
                    name="rescueLocation"
                    placeholder="예: 용암삼일무지개아파트"
                    value={formData.rescueLocation}
                    onChange={handleChange}
                    required/>
                  </FieldColumn>
                </FieldRow>

                <FormDivider/>

                {/* 3. 이미지 및 상세 내용 */}
                <FormGroup>
                  <PrimaryLabel>대표 사진 (필수)</PrimaryLabel>
                  <ImageSourceOptions>
                    <F.CheckWrapper $hasLabel>
                      <F.CheckInput
                      type="radio"
                      id="imgLink"
                      name="imageInputType"
                      checked={imageInputType === "LINK"}
                      onChange={() => dispatch(setImageInputType("LINK"))}/>
                      <F.CheckLabel htmlFor="imgLink">URL(링크)로 입력</F.CheckLabel>
                    </F.CheckWrapper>
                    <F.CheckWrapper $hasLabel>
                      <F.CheckInput
                      type="radio"
                      id="imgUpload"
                      name="imageInputType"
                      checked={imageInputType === "UPLOAD"}
                      onChange={() => dispatch(setImageInputType("UPLOAD"))}/>
                      <F.CheckLabel htmlFor="imgUpload">직접 업로드</F.CheckLabel>
                    </F.CheckWrapper>
                  </ImageSourceOptions>

                  {imageInputType === "LINK" ? (
                    <F.Control
                    type="url"
                    name="imageUrl"
                    placeholder="이미지 링크를 붙여 넣어 주세요"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required={imageInputType === "LINK"}/>
                  ) : (
                    <F.Control
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={imageInputType === "UPLOAD"}/>
                  )}
                </FormGroup>

                {(formData.imageUrl || imageFile) && (
                  <PreviewBox>
                    <ShelterPreviewImage
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                    alt="대표사진 미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </PreviewBox>
                )}

                <FormSection>
                  <EmphasizedLabel>특이사항 및 상세 설명</EmphasizedLabel>
                  <F.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  placeholder="동물의 건강 상태, 성격, 발견 당시 상황 등을 적어주세요."
                  value={formData.content}
                  onChange={handleChange}
                  required/>
                </FormSection>

                <SubmitButton
                type="submit"
                $variant="warning"
                disabled={isLoading}>
                  {isLoading ? "등록 중..." : "보호 동물 등록하기"}
                </SubmitButton>
              </form>
            </F.CardBody>
          </FormCard>
        </F.Column>
        <F.Column $lg={4}>
          <FormCard>
            <FormCardHeader>
              <WarningCardTitle>등록 및 관리 안내</WarningCardTitle>
            </FormCardHeader>
            <GuideBody>
              <p>
                <strong>공고 상태 관리</strong>
              </p>
              기본값은 &apos;공고중&apos;입니다. 입양처가 정해지거나 보호가 종료되면 상태를
              <strong>&apos;입양완료&apos;</strong>로 변경해 주세요. 앱 화면에서 회색 &apos;완료&apos; 뱃지로 자동
              전환됩니다.
            </GuideBody>
          </FormCard>
        </F.Column>
      </A.GridRow>
    </Layout>
  );
};
