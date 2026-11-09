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

import { Layout } from "../../components/layout/Layout";
import AdminRegistrationList from "../../components/admin/AdminRegistrationList";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";
// 💡 앞서 정의한 쿨그레이 믹스인 및 레이아웃 요소 임포트

import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

// ==========================================
// 💡 메인 컴포넌트
// ==========================================
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
      openAlertModal("데이터를 파싱하는 과정에서 기본 예시 데이터가 적용되었습니다.");
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
    <Layout>
      <S.AdminShellPageHeading>추천 입양 동물 관리</S.AdminShellPageHeading>
      <AdminRegistrationList kind="recommended"/>

      <S.PickGridWrap>
        {/* 좌측 폼 영역 */}
        <div>
          <S.AdminShellDataCard>
            <div className="card-header">신규 추천 동물 등록</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* 라디오 버튼 그룹 */}
                <S.PickFormGroup>
                  <S.FormLabel>등록 출처 선택</S.FormLabel>
                  <S.PickRadioGroup>
                    <S.PickRadioLabel>
                      <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "DIRECT"}
                      onChange={() => dispatch(setSourceType("DIRECT"))}/>
                      자체 직접 등록
                    </S.PickRadioLabel>
                    <S.PickRadioLabel>
                      <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "FACEBOOK"}
                      onChange={() => dispatch(setSourceType("FACEBOOK"))}/>
                      페이스북 링크
                    </S.PickRadioLabel>
                    <S.PickRadioLabel>
                      <input
                      type="radio"
                      name="sourceType"
                      checked={sourceType === "INSTAGRAM"}
                      onChange={() => dispatch(setSourceType("INSTAGRAM"))}/>
                      인스타그램 링크
                    </S.PickRadioLabel>
                  </S.PickRadioGroup>
                </S.PickFormGroup>

                <S.PickFormDivider/>

                {/* SNS 파싱 인풋 */}
                {sourceType !== "DIRECT" && (
                  <S.PickFormGroup>
                    <S.UrlLabel>SNS 포스팅 URL 주소</S.UrlLabel>
                    <S.PickInputGroup>
                      <S.FormInput
                      type="url"
                      name="sourceUrl"
                      placeholder={`${sourceType === "FACEBOOK" ? "페이스북" : "인스타그램"} 주소를 입력하세요`}
                      value={formData.sourceUrl}
                      onChange={handleChange}
                      required/>
                      <S.FetchButton type="button" onClick={handleParseUrl} disabled={isParsing}>
                        {isParsing ? "분석 중..." : "데이터 자동 불러오기 ⚡"}
                      </S.FetchButton>
                    </S.PickInputGroup>
                    <S.PickHelpText>
                      주소를 입력하고 불러오기 버튼을 누르면 아래 정보가 자동으로 채워집니다.
                    </S.PickHelpText>
                  </S.PickFormGroup>
                )}

                {/* 동물 정보 입력 */}
                <S.InnerGridRow2>
                  <S.PickFormGroup>
                    <S.FormLabel>지역 (예: 강릉시)</S.FormLabel>
                    <S.FormInput name="region" value={formData.region} onChange={handleChange} required/>
                  </S.PickFormGroup>
                  <S.PickFormGroup>
                    <S.FormLabel>공고번호 / 이름</S.FormLabel>
                    <S.FormInput name="noticeNo" value={formData.noticeNo} onChange={handleChange} required/>
                  </S.PickFormGroup>
                </S.InnerGridRow2>

                <S.InnerGridRow3>
                  <S.PickFormGroup>
                    <S.FormLabel>출생년도 (예: 2023)</S.FormLabel>
                    <S.FormInput name="birthYear" value={formData.birthYear} onChange={handleChange} required/>
                  </S.PickFormGroup>
                  <S.PickFormGroup>
                    <S.FormLabel>성별</S.FormLabel>
                    <S.FormSelect name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="M">수컷 (M)</option>
                      <option value="F">암컷 (F)</option>
                    </S.FormSelect>
                  </S.PickFormGroup>
                  <S.PickFormGroup>
                    <S.FormLabel>체중 (kg)</S.FormLabel>
                    <S.FormInput
                    type="number"
                    step="0.1"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required/>
                  </S.PickFormGroup>
                </S.InnerGridRow3>

                <S.PickFormGroup>
                  <S.FormLabel>동물 사진 URL</S.FormLabel>
                  <S.FormInput
                  type="url"
                  name="imageUrl"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required/>
                </S.PickFormGroup>

                {formData.imageUrl && (
                  <S.PickPreviewBox>
                    <S.AnimalPreviewImage
                    src={formData.imageUrl}
                    alt="미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </S.PickPreviewBox>
                )}

                <S.PickSubmitButton type="submit" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "최종 등록하기"}
                </S.PickSubmitButton>
              </form>
            </div>
          </S.AdminShellDataCard>
        </div>

        {/* 우측 안내 영역 */}
        <div>
          <S.AdminShellDataCard>
            <div className="card-header">등록 안내</div>
            <div className="card-body">
              <S.InfoText>
                <strong>직접등록:</strong>
                <br/>
                센터에서 보호중인 동물을 직접 등록합니다.
              </S.InfoText>
              <S.InfoText>
                <strong>페이스북 / 인스타:</strong>
                <br/>
                외부 SNS에서 화제가 된 입양 홍보글을 연동할 때 사용합니다. 추후 사용자 화면에서 해당 동물을 클릭하면
                입력하신 SNS 주소로 이동하도록 개발할 수 있습니다.
              </S.InfoText>
            </div>
          </S.AdminShellDataCard>
        </div>
      </S.PickGridWrap>
    </Layout>
  );
};
