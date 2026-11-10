"use client";

import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import {
  setSourceType,
  updateRecommendedField,
  parseAnimalUrl,
  submitRecommendedAnimal
} from "../../redux/recommendedAdminSlice";

import AdminRegistrationList from "../../components/admin/AdminRegistrationList";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";

import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

export default function RecommendedAnimalAdmin() {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();

  const {sourceType, formData, isParsing, isLoading} = useSelector((state: RootState) => state.recommendedAdmin);

  const handleParseUrl = async () => {
    if (!formData.sourceUrl) {
      openAlertModal("SNS 주소를 먼저 입력해 주세요!");
      return;
    };
    const resultAction = await dispatch(parseAnimalUrl({url: formData.sourceUrl, sourceType}));
    if (parseAnimalUrl.fulfilled.match(resultAction)) {
      openAlertModal("데이터를 성공적으로 불러왔습니다! 빈칸이나 틀린 부분을 수정해 주세요.", undefined, {
        variant: "success"
      });
    } else {
      openAlertModal(resultAction.payload || "링크 정보를 불러오지 못했습니다.", undefined, {variant: "error"});
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    dispatch(updateRecommendedField({name: name as keyof RootState["recommendedAdmin"]["formData"], value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(submitRecommendedAnimal({sourceType, formData}));

    if (submitRecommendedAnimal.fulfilled.match(resultAction)) {
      dispatch(fetchAdminRegistrations("recommended"));
      openAlertModal("추천 동물이 성공적으로 등록되었습니다!", undefined, {variant: "success"});
    } else {
      openAlertModal(resultAction.payload || "등록에 실패했습니다. 다시 시도해 주세요.", undefined, {variant: "error"});
    };
  };

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / 추천 동물 설정</S.AdminSettingCaption>
        <S.AdminSettingTitle>추천 입양 동물 관리</S.AdminSettingTitle>
        <S.AdminSettingDescription>추천 동물을 등록하고 입양 홍보에 필요한 정보를 관리하세요.</S.AdminSettingDescription>
      </S.AdminSettingHeader>

      <S.AdminSettingGrid>
        <S.AdminSettingCard aria-labelledby="recommended-form-title">
          <S.AdminSettingCardHeader>
            <S.AdminSettingCardTitle id="recommended-form-title">신규 추천 동물 등록</S.AdminSettingCardTitle>
          </S.AdminSettingCardHeader>
          <S.AdminSettingCardBody>
            <S.AdminSettingForm onSubmit={handleSubmit}>
              <S.AdminSettingChoiceField>
                <S.AdminSettingLegend>등록 출처 선택</S.AdminSettingLegend>
                <S.AdminSettingOptions>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === "DIRECT"}
                    onChange={() => dispatch(setSourceType("DIRECT"))}/>
                    자체 직접 등록
                  </S.AdminSettingOption>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === "FACEBOOK"}
                    onChange={() => dispatch(setSourceType("FACEBOOK"))}/>
                    페이스북 링크
                  </S.AdminSettingOption>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="sourceType"
                    checked={sourceType === "INSTAGRAM"}
                    onChange={() => dispatch(setSourceType("INSTAGRAM"))}/>
                    인스타그램 링크
                  </S.AdminSettingOption>
                </S.AdminSettingOptions>
              </S.AdminSettingChoiceField>

              {sourceType !== "DIRECT" && (
                <S.AdminSettingInset>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="recommended-source-url">SNS 포스팅 URL 주소</S.AdminSettingLabel>
                    <S.PickInputGroup>
                      <S.AdminSettingInput
                      id="recommended-source-url"
                      type="url"
                      name="sourceUrl"
                      placeholder={`${sourceType === "FACEBOOK" ? "페이스북" : "인스타그램"} 주소를 입력하세요`}
                      value={formData.sourceUrl}
                      onChange={handleChange}
                      required/>
                      <S.PickFetchButton type="button" onClick={handleParseUrl} disabled={isParsing}>
                        {isParsing ? "분석 중..." : "데이터 자동 불러오기"}
                      </S.PickFetchButton>
                    </S.PickInputGroup>
                    <S.AdminSettingHelp>주소를 입력하고 불러오기 버튼을 누르면 아래 정보가 자동으로 채워집니다.</S.AdminSettingHelp>
                  </S.AdminSettingField>
                </S.AdminSettingInset>
              )}

              <S.AdminSettingFieldGrid>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="recommended-region">지역 (예: 강릉시)</S.AdminSettingLabel>
                  <S.AdminSettingInput id="recommended-region" name="region" value={formData.region} onChange={handleChange} required/>
                </S.AdminSettingField>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="recommended-notice">공고번호 / 이름</S.AdminSettingLabel>
                  <S.AdminSettingInput id="recommended-notice" name="noticeNo" value={formData.noticeNo} onChange={handleChange} required/>
                </S.AdminSettingField>
              </S.AdminSettingFieldGrid>

              <S.AdminSettingFieldGrid $columns={3}>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="recommended-birth-year">출생년도 (예: 2023)</S.AdminSettingLabel>
                  <S.AdminSettingInput id="recommended-birth-year" name="birthYear" value={formData.birthYear} onChange={handleChange} required/>
                </S.AdminSettingField>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="recommended-gender">성별</S.AdminSettingLabel>
                  <S.AdminSettingSelect id="recommended-gender" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="M">수컷 (M)</option>
                    <option value="F">암컷 (F)</option>
                  </S.AdminSettingSelect>
                </S.AdminSettingField>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="recommended-weight">체중 (kg)</S.AdminSettingLabel>
                  <S.AdminSettingInput
                  id="recommended-weight"
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required/>
                </S.AdminSettingField>
              </S.AdminSettingFieldGrid>

              <S.AdminSettingField>
                <S.AdminSettingLabel htmlFor="recommended-image-url">동물 사진 URL</S.AdminSettingLabel>
                <S.AdminSettingInput
                id="recommended-image-url"
                type="url"
                name="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
                required/>
              </S.AdminSettingField>

              {formData.imageUrl && (
                <S.AdminSettingPreview>
                  <S.AdminSettingPreviewImage
                  src={formData.imageUrl}
                  alt="미리보기"
                  width={0}
                  height={0}
                  unoptimized
                  loading="eager"/>
                </S.AdminSettingPreview>
              )}

              <S.AdminSettingSubmit type="submit" disabled={isLoading}>
                {isLoading ? "등록 중..." : "최종 등록하기"}
              </S.AdminSettingSubmit>
            </S.AdminSettingForm>
          </S.AdminSettingCardBody>
        </S.AdminSettingCard>

        <S.AdminSettingGuide aria-labelledby="recommended-guide-title">
          <S.AdminSettingCardHeader>
            <S.AdminSettingCardTitle id="recommended-guide-title">등록 안내</S.AdminSettingCardTitle>
          </S.AdminSettingCardHeader>
          <S.AdminSettingGuideBody>
            <p>
              <strong>직접 등록</strong>
              <br/>
              센터에서 보호 중인 동물의 정보를 직접 입력해 등록합니다.
            </p>
            <hr/>
            <p>
              <strong>페이스북 / 인스타그램</strong>
              <br/>
              외부 SNS의 입양 홍보글을 불러올 때 사용합니다. 불러온 사진과 동물 정보를 등록 전에 확인해 주세요.
            </p>
          </S.AdminSettingGuideBody>
        </S.AdminSettingGuide>
      </S.AdminSettingGrid>

      <AdminRegistrationList kind="recommended"/>
    </S.AdminSettingPage>
  );
};
