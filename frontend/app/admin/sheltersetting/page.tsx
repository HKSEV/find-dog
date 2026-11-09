"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setImageInputType, updateShelterField, submitShelterAnimal } from "../../redux/shelterAdminSlice";

import { Layout } from "../../components/layout/Layout";
import AdminRegistrationList from "../../components/admin/AdminRegistrationList";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";

import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

export default function ShelterAdmin() {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();

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
      dispatch(fetchAdminRegistrations("shelter"));
      // 알림을 확인한 뒤 업로드 파일 상태를 초기화합니다.
      openAlertModal("보호 동물이 성공적으로 등록되었습니다.", () => setImageFile(null), {variant: "success"});
    } else {
      openAlertModal(resultAction.payload || "서버 오류가 발생했습니다. 잠시후 다시 시도해 주세요", undefined, {
        variant: "error"
      });
    };
  };

  return (
    <Layout>
      <S.PageHeader>
        <S.ShelterSettingPageTitle>보호소 데이터 관리</S.ShelterSettingPageTitle>
      </S.PageHeader>
      <AdminRegistrationList kind="shelter"/>
      <S.GridRow>
        <S.AdminFormColumn $lg={8}>
          <S.ShelterSettingFormCard>
            <S.ShelterSettingFormCardHeader>
              <S.WarningCardTitle>신규 보호 동물 등록</S.WarningCardTitle>
            </S.ShelterSettingFormCardHeader>
            <S.AdminFormCardBody>
              <form onSubmit={handleSubmit}>
                <S.ShelterSettingInsetFormGroup>
                  <S.Row>
                    <S.AdminFormColumn $md={6}>
                      <S.ShelterSettingFieldLabel>공고상태</S.ShelterSettingFieldLabel>
                      <S.AdminFormSelect name="status" value={formData.status} onChange={handleChange}>
                        <option value="ACTIVE">공고중 (보호중)</option>
                        <option value="COMPLETED">입양 완료 / 종료</option>
                      </S.AdminFormSelect>
                    </S.AdminFormColumn>
                    <S.AdminFormColumn $md={6}>
                      <S.ShelterSettingFieldLabel>성별</S.ShelterSettingFieldLabel>
                      <S.AdminFormSelect name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="UNKNOWN">성별 미상</option>
                        <option value="MALE">수컷</option>
                        <option value="FEMALE">암컷</option>
                      </S.AdminFormSelect>
                    </S.AdminFormColumn>
                  </S.Row>
                </S.ShelterSettingInsetFormGroup>

                {/* 2. 기본 정보 입력 */}
                <S.FieldRow>
                  <S.ShelterSettingFieldColumn $md={6}>
                    <S.ShelterSettingEmphasizedLabel>품종</S.ShelterSettingEmphasizedLabel>
                    <S.Control
                    name="breed"
                    placeholder="예: [개] 푸들, [고양이] 코숏"
                    value={formData.breed}
                    onChange={handleChange}
                    required/>
                  </S.ShelterSettingFieldColumn>
                  <S.ShelterSettingFieldColumn $md={6}>
                    <S.ShelterSettingEmphasizedLabel>공고번호</S.ShelterSettingEmphasizedLabel>
                    <S.Control
                    name="noticeNo"
                    placeholder="예: 충북 청주-2026-00001"
                    value={formData.noticeNo}
                    onChange={handleChange}
                    required/>
                  </S.ShelterSettingFieldColumn>
                </S.FieldRow>
                <S.FieldRow>
                  <S.ShelterSettingFieldColumn $md={6}>
                    <S.ShelterSettingEmphasizedLabel>등록날짜</S.ShelterSettingEmphasizedLabel>
                    <S.Control type="date" name="regDate" value={formData.regDate} onChange={handleChange} required/>
                  </S.ShelterSettingFieldColumn>
                  <S.ShelterSettingFieldColumn $md={6}>
                    <S.ShelterSettingEmphasizedLabel>구조장소</S.ShelterSettingEmphasizedLabel>
                    <S.Control
                    name="rescueLocation"
                    placeholder="예: 용암삼일무지개아파트"
                    value={formData.rescueLocation}
                    onChange={handleChange}
                    required/>
                  </S.ShelterSettingFieldColumn>
                </S.FieldRow>

                <S.ShelterSettingFormDivider/>

                {/* 3. 이미지 및 상세 내용 */}
                <S.ShelterSettingFormGroup>
                  <S.ShelterSettingPrimaryLabel>대표 사진 (필수)</S.ShelterSettingPrimaryLabel>
                  <S.ImageSourceOptions>
                    <S.CheckWrapper $hasLabel>
                      <S.CheckInput
                      type="radio"
                      id="imgLink"
                      name="imageInputType"
                      checked={imageInputType === "LINK"}
                      onChange={() => dispatch(setImageInputType("LINK"))}/>
                      <S.CheckLabel htmlFor="imgLink">URL(링크)로 입력</S.CheckLabel>
                    </S.CheckWrapper>
                    <S.CheckWrapper $hasLabel>
                      <S.CheckInput
                      type="radio"
                      id="imgUpload"
                      name="imageInputType"
                      checked={imageInputType === "UPLOAD"}
                      onChange={() => dispatch(setImageInputType("UPLOAD"))}/>
                      <S.CheckLabel htmlFor="imgUpload">직접 업로드</S.CheckLabel>
                    </S.CheckWrapper>
                  </S.ImageSourceOptions>

                  {imageInputType === "LINK" ? (
                    <S.Control
                    type="url"
                    name="imageUrl"
                    placeholder="이미지 링크를 붙여 넣어 주세요"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    required={imageInputType === "LINK"}/>
                  ) : (
                    <S.Control
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={imageInputType === "UPLOAD"}/>
                  )}
                </S.ShelterSettingFormGroup>

                {(formData.imageUrl || imageFile) && (
                  <S.ShelterSettingPreviewBox>
                    <S.ShelterPreviewImage
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                    alt="대표사진 미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </S.ShelterSettingPreviewBox>
                )}

                <S.ShelterSettingFormSection>
                  <S.ShelterSettingEmphasizedLabel>특이사항 및 상세 설명</S.ShelterSettingEmphasizedLabel>
                  <S.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  placeholder="동물의 건강 상태, 성격, 발견 당시 상황 등을 적어주세요."
                  value={formData.content}
                  onChange={handleChange}
                  required/>
                </S.ShelterSettingFormSection>

                <S.ShelterSettingSubmitButton type="submit" $variant="warning" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "보호 동물 등록하기"}
                </S.ShelterSettingSubmitButton>
              </form>
            </S.AdminFormCardBody>
          </S.ShelterSettingFormCard>
        </S.AdminFormColumn>
        <S.AdminFormColumn $lg={4}>
          <S.ShelterSettingFormCard>
            <S.ShelterSettingFormCardHeader>
              <S.WarningCardTitle>등록 및 관리 안내</S.WarningCardTitle>
            </S.ShelterSettingFormCardHeader>
            <S.ShelterSettingGuideBody>
              <p>
                <strong>공고 상태 관리</strong>
              </p>
              기본값은 &apos;공고중&apos;입니다. 입양처가 정해지거나 보호가 종료되면 상태를
              <strong>&apos;입양완료&apos;</strong>로 변경해 주세요. 앱 화면에서 회색 &apos;완료&apos; 뱃지로 자동
              전환됩니다.
            </S.ShelterSettingGuideBody>
          </S.ShelterSettingFormCard>
        </S.AdminFormColumn>
      </S.GridRow>
    </Layout>
  );
};
