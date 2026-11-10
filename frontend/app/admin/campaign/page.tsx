"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateCampaignField, setMediaType, submitCampaign } from "../../redux/campaignAdminSlice";

import AdminRegistrationList from "../../components/admin/AdminRegistrationList";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";

import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

export default function AdoptionCampaignAdmin() {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();

  // Redux Store 상태 조회
  const {formData, isLoading} = useSelector((state: RootState) => state.campaignAdmin);

  // 일반 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    dispatch(updateCampaignField({name: name as keyof RootState["campaignAdmin"]["formData"], value}));
  };

  // 미디어 타입(라디오버튼) 변경 핸들러
  const handleMediaTypeChange = (type: string) => {
    dispatch(setMediaType(type));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(submitCampaign(formData));

    if (submitCampaign.fulfilled.match(resultAction)) {
      dispatch(fetchAdminRegistrations("campaign"));
      openAlertModal(resultAction.payload || "입양 캠페인이 성공적으로 등록되었습니다!", undefined, {
        variant: "success"
      });
    } else {
      openAlertModal(resultAction.payload || "서버 오류가 발생했습니다. 잠시후 다시 시도해 주세요", undefined, {
        variant: "error"
      });
    };
  };

  const HASHTAG_LIST = ["#제주입양", "#임시보호", "#치료지원", "#입양홍보", "#구조스토리"];

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / 캠페인 설정</S.AdminSettingCaption>
        <S.AdminSettingTitle>입양 캠페인 관리</S.AdminSettingTitle>
        <S.AdminSettingDescription>입양 캠페인의 내용과 미디어를 등록하고 게시 현황을 확인하세요.</S.AdminSettingDescription>
      </S.AdminSettingHeader>

      <S.AdminSettingGrid>
        <S.AdminSettingCard aria-labelledby="campaign-form-title">
          <S.AdminSettingCardHeader>
            <S.AdminSettingCardTitle id="campaign-form-title">신규 캠페인 등록</S.AdminSettingCardTitle>
          </S.AdminSettingCardHeader>
          <S.AdminSettingCardBody>
            <S.AdminSettingForm onSubmit={handleSubmit}>
              <S.AdminSettingChoiceField>
                <S.AdminSettingLegend>미디어 타입 설정</S.AdminSettingLegend>
                <S.AdminSettingOptions>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="mediaType"
                    checked={formData.mediaType === "IMAGE"}
                    onChange={() => handleMediaTypeChange("IMAGE")}/>
                    이미지형
                  </S.AdminSettingOption>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="mediaType"
                    checked={formData.mediaType === "YOUTUBE"}
                    onChange={() => handleMediaTypeChange("YOUTUBE")}/>
                    유튜브 링크형
                  </S.AdminSettingOption>
                  <S.AdminSettingOption>
                    <input
                    type="radio"
                    name="mediaType"
                    checked={formData.mediaType === "DIRECT_VIDEO"}
                    onChange={() => handleMediaTypeChange("DIRECT_VIDEO")}/>
                    서버 직접 업로드형
                  </S.AdminSettingOption>
                </S.AdminSettingOptions>
              </S.AdminSettingChoiceField>

              <S.CampaignTitleFields>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="campaign-hashtag">해시태그 (말머리)</S.AdminSettingLabel>
                  <S.AdminSettingSelect id="campaign-hashtag" name="hashtag" value={formData.hashtag} onChange={handleChange} required>
                    <option value="">-- 필수 선택 --</option>
                    {HASHTAG_LIST.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </S.AdminSettingSelect>
                </S.AdminSettingField>
                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="campaign-title">캠페인 제목</S.AdminSettingLabel>
                  <S.AdminSettingInput
                  id="campaign-title"
                  name="title"
                  placeholder="목록에 노출될 제목을 적어주세요"
                  value={formData.title}
                  onChange={handleChange}
                  required/>
                </S.AdminSettingField>
              </S.CampaignTitleFields>

              <S.AdminSettingField>
                <S.AdminSettingLabel htmlFor="campaign-content">상세 내용</S.AdminSettingLabel>
                <S.AdminSettingTextarea
                id="campaign-content"
                rows={5}
                name="content"
                placeholder="캠페인의 자세한 사연이나 설명을 적어주세요"
                value={formData.content}
                onChange={handleChange}
                required/>
              </S.AdminSettingField>

              {formData.mediaType !== "IMAGE" && (
                <S.AdminSettingInset>
                  <S.AdminSettingField>
                    <S.AdminSettingLabel htmlFor="campaign-media-url">
                      {formData.mediaType === "YOUTUBE" ? "유튜브 링크(URL)" : "서버 동영상 파일 경로"}
                    </S.AdminSettingLabel>
                    <S.AdminSettingInput
                    id="campaign-media-url"
                    type="text"
                    name="mediaUrl"
                    placeholder={formData.mediaType === "YOUTUBE" ? "https://youtube.com/.." : "/uploads/videos/campaign_"}
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    required/>
                  </S.AdminSettingField>
                </S.AdminSettingInset>
              )}

              <S.AdminSettingField>
                <S.AdminSettingLabel htmlFor="campaign-thumbnail">썸네일 이미지 URL(최대 2MB)</S.AdminSettingLabel>
                <S.AdminSettingInput
                id="campaign-thumbnail"
                type="url"
                name="thumbnailUrl"
                placeholder="목록에 보여질 썸네일 주소를 입력하세요"
                value={formData.thumbnailUrl}
                onChange={handleChange}
                required/>
              </S.AdminSettingField>

              {formData.thumbnailUrl && (
                <S.AdminSettingPreview>
                  <S.AdminSettingPreviewImage
                  src={formData.thumbnailUrl}
                  alt="썸네일 미리보기"
                  width={0}
                  height={0}
                  unoptimized
                  loading="eager"/>
                </S.AdminSettingPreview>
              )}

              <S.AdminSettingSubmit type="submit" disabled={isLoading}>
                {isLoading ? "등록 중..." : "캠페인 최종 등록하기"}
              </S.AdminSettingSubmit>
            </S.AdminSettingForm>
          </S.AdminSettingCardBody>
        </S.AdminSettingCard>

        <S.AdminSettingGuide aria-labelledby="campaign-guide-title">
          <S.AdminSettingCardHeader>
            <S.AdminSettingCardTitle id="campaign-guide-title">등록 안내 가이드</S.AdminSettingCardTitle>
          </S.AdminSettingCardHeader>
          <S.AdminSettingGuideBody>
            <p>
              <strong>1. 해시태그(말머리) 필수</strong>
              <br/>
              말머리를 선택하면 사용자 페이지에서 해당 카테고리로 묶여 노출됩니다.
            </p>
            <hr/>
            <p>
              <strong>2. 유튜브 링크 활용</strong>
              <br/>
              원활한 동영상 재생을 위해 가급적 유튜브 링크 연동을 권장합니다.
            </p>
            <hr/>
            <p>
              <strong>3. 직접 동영상 업로드 시 주의</strong>
              <br/>
              최대 2MB 용량, 30초 이내의 ogg 또는 mp4 파일로 변환한 뒤 업로드 경로를 입력해 주세요.
            </p>
          </S.AdminSettingGuideBody>
        </S.AdminSettingGuide>
      </S.AdminSettingGrid>

      <AdminRegistrationList kind="campaign"/>
    </S.AdminSettingPage>
  );
};
