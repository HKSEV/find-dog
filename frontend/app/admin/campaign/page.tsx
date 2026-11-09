"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateCampaignField, setMediaType, submitCampaign } from "../../redux/campaignAdminSlice";

import { Layout } from "../../components/layout/Layout";

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
    <Layout>
      <S.PageHeader>
        <S.AdminCampaignPageTitle>입양 캠페인 관리</S.AdminCampaignPageTitle>
      </S.PageHeader>

      <S.GridRow>
        <S.AdminFormColumn $lg={8}>
          <S.AdminCampaignFormCard>
            <S.AdminCampaignFormCardHeader>
              <S.AdminCampaignCardTitle>신규 캠페인 등록</S.AdminCampaignCardTitle>
            </S.AdminCampaignFormCardHeader>
            <S.AdminFormCardBody>
              <form onSubmit={handleSubmit}>
                <S.AdminCampaignFormSection>
                  <S.AdminCampaignFieldLabel>미디어 타입 설정</S.AdminCampaignFieldLabel>

                  <S.AdminCampaignCategoryOptions>
                    <S.AdminCampaignRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="mediaImage"
                        name="mediaType"
                        checked={formData.mediaType === "IMAGE"}
                        onChange={() => handleMediaTypeChange("IMAGE")}/>
                      </S.CheckWrapper>
                      <S.AdminCampaignRadioLabel htmlFor="mediaImage">이미지형</S.AdminCampaignRadioLabel>
                    </S.AdminCampaignRadioOption>
                    <S.AdminCampaignRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="mediaYoutube"
                        name="mediaType"
                        checked={formData.mediaType === "YOUTUBE"}
                        onChange={() => handleMediaTypeChange("YOUTUBE")}/>
                      </S.CheckWrapper>
                      <S.AdminCampaignRadioLabel htmlFor="mediaYoutube">유튜브 링크형</S.AdminCampaignRadioLabel>
                    </S.AdminCampaignRadioOption>

                    <S.AdminCampaignRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="mediaDirect"
                        name="mediaType"
                        checked={formData.mediaType === "DIRECT_VIDEO"}
                        onChange={() => handleMediaTypeChange("DIRECT_VIDEO")}/>
                      </S.CheckWrapper>
                      <S.AdminCampaignRadioLabel htmlFor="mediaDirect">서버 직접 업로드형</S.AdminCampaignRadioLabel>
                    </S.AdminCampaignRadioOption>
                  </S.AdminCampaignCategoryOptions>
                </S.AdminCampaignFormSection>

                <hr/>
                {/*해시태그 및 제목 입력 구역 */}
                <S.Row>
                  <S.AdminCampaignFieldColumn $md={4}>
                    <p>
                      <S.AdminCampaignEmphasizedLabel>해시태그 (말머리)</S.AdminCampaignEmphasizedLabel>
                    </p>
                    <S.AdminFormSelect name="hashtag" value={formData.hashtag} onChange={handleChange} required>
                      <option value="">-- 필수 선택 --</option>
                      {HASHTAG_LIST.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </S.AdminFormSelect>
                  </S.AdminCampaignFieldColumn>

                  <S.AdminCampaignFieldColumn $md={8}>
                    <S.AdminCampaignEmphasizedLabel>캠페인 제목</S.AdminCampaignEmphasizedLabel>
                    <S.Control
                    name="title"
                    placeholder="목록에 노출될 제목을 적어주세요"
                    value={formData.title}
                    onChange={handleChange}
                    required/>
                  </S.AdminCampaignFieldColumn>
                </S.Row>

                {/*상세 내용구역 */}
                <S.AdminCampaignFormGroup>
                  <S.AdminCampaignEmphasizedLabel>상세 내용</S.AdminCampaignEmphasizedLabel>
                  <S.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  placeholder="캠페인의 자세한 사연이나 설명을 적어주세요"
                  value={formData.content}
                  onChange={handleChange}
                  required/>
                </S.AdminCampaignFormGroup>

                {/*동영상 링크 / 경로 */}
                {formData.mediaType !== "IMAGE" && (
                  <S.AdminCampaignInsetFormGroup>
                    <S.AdminCampaignPrimaryLabel>
                      {formData.mediaType === "YOUTUBE" ? "유튜브 링크(URL)" : "서버동영상 파일경로"}
                    </S.AdminCampaignPrimaryLabel>
                    <S.Control
                    type="text"
                    name="mediaUrl"
                    placeholder={
                      formData.mediaType === "YOUTUBE" ? "https://youtube.com/.." : "/uploads/videos/campaign_"
                    }
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    required={formData.mediaType !== "IMAGE"}/>
                  </S.AdminCampaignInsetFormGroup>
                )}

                {/*썸네일 구역 */}
                <S.AdminCampaignFormSection>
                  <S.AdminCampaignEmphasizedLabel>썸네일 이미지 URL(최대 2MB)</S.AdminCampaignEmphasizedLabel>
                  <S.Control
                  type="url"
                  name="thumbnailUrl"
                  placeholder="목록에 보여질 썸네일 주소를 입력하세요"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  required/>
                </S.AdminCampaignFormSection>

                {/*썸네일 미리보기*/}
                {formData.thumbnailUrl && (
                  <S.AdminCampaignPreviewBox>
                    <S.CampaignPreviewImage
                    src={formData.thumbnailUrl}
                    alt="썸네일 미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </S.AdminCampaignPreviewBox>
                )}
                <S.AdminCampaignSubmitButton type="submit" $variant="primary" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "캠페인 최종 등록하기"}
                </S.AdminCampaignSubmitButton>
              </form>
            </S.AdminFormCardBody>
          </S.AdminCampaignFormCard>
        </S.AdminFormColumn>

        <S.AdminFormColumn $lg={4}>
          <S.AdminCampaignFormCard>
            <S.AdminCampaignFormCardHeader>
              <S.AdminCampaignCardTitle>등록 안내 가이드</S.AdminCampaignCardTitle>
            </S.AdminCampaignFormCardHeader>
            <S.AdminCampaignGuideBody>
              <p>
                <strong>1. 해시태그(말머리) 필수:</strong>
                <br/>
                말머리를 정확히 선택해야 사용자 페이지에서 해당 카테고리로 묶여서 노출됩니다.
              </p>
              <hr/>
              <p>
                <strong>2. 유튜브 링크 활용:</strong>
                <br/>
                서버 트래픽 절감 및 원활한 스트리밍을 위해 가급적 유튜브 링크 연동을 권장합니다. 상세 페이지에서
                Iframe으로 노출됩니다.
              </p>
              <hr/>
              <p>
                <strong>3. 직접 동영상 업로드 시 주의:</strong>
                <br/>
                외부 통제가 불가능한 상황을 대비한 기능입니다 트래픽 폭주를 막기위해 최대 2MB 용량, 30초 이내의 ogg 또는
                mp4 파일로 변환하여 업로드
              </p>
            </S.AdminCampaignGuideBody>
          </S.AdminCampaignFormCard>
        </S.AdminFormColumn>
      </S.GridRow>
    </Layout>
  );
};
