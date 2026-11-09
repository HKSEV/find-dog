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
      <S.AdminSettingPage>
        <S.AdminSettingHeader>
          <S.AdminSettingCaption>관리자 / 보호소 설정</S.AdminSettingCaption>
          <S.AdminSettingTitle>보호소 데이터 관리</S.AdminSettingTitle>
          <S.AdminSettingDescription>보호 동물의 공고와 사진, 상세 정보를 등록하고 관리하세요.</S.AdminSettingDescription>
        </S.AdminSettingHeader>

        <S.AdminSettingGrid>
          <S.AdminSettingCard aria-labelledby="shelter-form-title">
            <S.AdminSettingCardHeader>
              <S.AdminSettingCardTitle id="shelter-form-title">신규 보호 동물 등록</S.AdminSettingCardTitle>
            </S.AdminSettingCardHeader>
            <S.AdminSettingCardBody>
              <S.AdminSettingForm onSubmit={handleSubmit}>
                <S.AdminSettingInset>
                  <S.AdminSettingFieldGrid>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="shelter-status">공고상태</S.AdminSettingLabel>
                      <S.AdminSettingSelect id="shelter-status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="ACTIVE">공고중 (보호중)</option>
                        <option value="COMPLETED">입양 완료 / 종료</option>
                      </S.AdminSettingSelect>
                    </S.AdminSettingField>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="shelter-gender">성별</S.AdminSettingLabel>
                      <S.AdminSettingSelect id="shelter-gender" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="UNKNOWN">성별 미상</option>
                        <option value="MALE">수컷</option>
                        <option value="FEMALE">암컷</option>
                      </S.AdminSettingSelect>
                    </S.AdminSettingField>
                  </S.AdminSettingFieldGrid>
                </S.AdminSettingInset>

                <S.AdminSettingFieldGrid>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="shelter-breed">품종</S.AdminSettingLabel>
                    <S.AdminSettingInput
                    id="shelter-breed"
                    name="breed"
                    placeholder="예: [개] 푸들, [고양이] 코숏"
                    value={formData.breed}
                    onChange={handleChange}
                    required/>
                  </S.AdminSettingField>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="shelter-notice">공고번호</S.AdminSettingLabel>
                    <S.AdminSettingInput
                    id="shelter-notice"
                    name="noticeNo"
                    placeholder="예: 충북 청주-2026-00001"
                    value={formData.noticeNo}
                    onChange={handleChange}
                    required/>
                  </S.AdminSettingField>
                </S.AdminSettingFieldGrid>

                <S.AdminSettingFieldGrid>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="shelter-date">등록날짜</S.AdminSettingLabel>
                    <S.AdminSettingInput id="shelter-date" type="date" name="regDate" value={formData.regDate} onChange={handleChange} required/>
                  </S.AdminSettingField>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="shelter-location">구조장소</S.AdminSettingLabel>
                    <S.AdminSettingInput
                    id="shelter-location"
                    name="rescueLocation"
                    placeholder="예: 용암삼일무지개아파트"
                    value={formData.rescueLocation}
                    onChange={handleChange}
                    required/>
                  </S.AdminSettingField>
                </S.AdminSettingFieldGrid>

                <S.AdminSettingChoiceField>
                  <S.AdminSettingLegend>대표 사진 (필수)</S.AdminSettingLegend>
                  <S.AdminSettingFields>
                    <S.AdminSettingOptions>
                      <S.AdminSettingOption>
                        <input
                        type="radio"
                        name="imageInputType"
                        checked={imageInputType === "LINK"}
                        onChange={() => dispatch(setImageInputType("LINK"))}/>
                        URL(링크)로 입력
                      </S.AdminSettingOption>
                      <S.AdminSettingOption>
                        <input
                        type="radio"
                        name="imageInputType"
                        checked={imageInputType === "UPLOAD"}
                        onChange={() => dispatch(setImageInputType("UPLOAD"))}/>
                        직접 업로드
                      </S.AdminSettingOption>
                    </S.AdminSettingOptions>

                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="shelter-image">
                        {imageInputType === "LINK" ? "사진 URL" : "사진 파일"}
                      </S.AdminSettingLabel>
                      {imageInputType === "LINK" ? (
                        <S.AdminSettingInput
                        id="shelter-image"
                        type="url"
                        name="imageUrl"
                        placeholder="이미지 링크를 붙여 넣어 주세요"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required/>
                      ) : (
                        <S.AdminSettingInput
                        id="shelter-image"
                        type="file"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleFileChange}
                        required/>
                      )}
                    </S.AdminSettingField>
                  </S.AdminSettingFields>
                </S.AdminSettingChoiceField>

                {(formData.imageUrl || imageFile) && (
                  <S.AdminSettingPreview>
                    <S.AdminSettingPreviewImage
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.imageUrl}
                    alt="대표사진 미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </S.AdminSettingPreview>
                )}

                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="shelter-content">특이사항 및 상세 설명</S.AdminSettingLabel>
                  <S.AdminSettingTextarea
                  id="shelter-content"
                  rows={5}
                  name="content"
                  placeholder="동물의 건강 상태, 성격, 발견 당시 상황 등을 적어주세요."
                  value={formData.content}
                  onChange={handleChange}
                  required/>
                </S.AdminSettingField>

                <S.AdminSettingSubmit type="submit" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "보호 동물 등록하기"}
                </S.AdminSettingSubmit>
              </S.AdminSettingForm>
            </S.AdminSettingCardBody>
          </S.AdminSettingCard>

          <S.AdminSettingGuide aria-labelledby="shelter-guide-title">
            <S.AdminSettingCardHeader>
              <S.AdminSettingCardTitle id="shelter-guide-title">등록 및 관리 안내</S.AdminSettingCardTitle>
            </S.AdminSettingCardHeader>
            <S.AdminSettingGuideBody>
              <p>
                <strong>공고 상태 관리</strong>
                <br/>
                기본값은 &apos;공고중&apos;입니다. 입양처가 정해지거나 보호가 종료되면 상태를
                <strong> &apos;입양 완료 / 종료&apos;</strong>로 변경해 주세요. 앱 화면에서 완료 상태로 표시됩니다.
              </p>
            </S.AdminSettingGuideBody>
          </S.AdminSettingGuide>
        </S.AdminSettingGrid>

        <AdminRegistrationList kind="shelter"/>
      </S.AdminSettingPage>
    </Layout>
  );
};
