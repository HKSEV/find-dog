"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { updateCampaignField, setMediaType, submitCampaign } from "../../redux/campaignAdminSlice";

import { Layout } from "../../components/layout/Layout";
import * as A from "@/assets/css/Style.styles";
import * as F from "@/assets/css/admin/AdminForm.styles";
import useAdminModal from "@/app/components/contexts/AdminModalContext";
import {
  PageTitle,
  FormCard,
  FormCardHeader,
  CardTitle,
  FormSection,
  FieldLabel,
  CategoryOptions,
  RadioOption,
  RadioLabel,
  FieldColumn,
  EmphasizedLabel,
  FormGroup,
  InsetFormGroup,
  PrimaryLabel,
  PreviewBox,
  CampaignPreviewImage,
  SubmitButton,
  GuideBody
} from "@/assets/css/admin/Campaign.styles";

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
      <A.PageHeader>
        <PageTitle>입양 캠페인 관리</PageTitle>
      </A.PageHeader>

      <A.GridRow>
        <F.Column $lg={8}>
          <FormCard>
            <FormCardHeader>
              <CardTitle>신규 캠페인 등록</CardTitle>
            </FormCardHeader>
            <F.CardBody>
              <form onSubmit={handleSubmit}>
                <FormSection>
                  <FieldLabel>미디어 타입 설정</FieldLabel>

                  <CategoryOptions>
                    <RadioOption>
                      <F.CheckWrapper>
                        <F.CheckInput
                        type="radio"
                        id="mediaImage"
                        name="mediaType"
                        checked={formData.mediaType === "IMAGE"}
                        onChange={() => handleMediaTypeChange("IMAGE")}/>
                      </F.CheckWrapper>
                      <RadioLabel htmlFor="mediaImage">이미지형</RadioLabel>
                    </RadioOption>
                    <RadioOption>
                      <F.CheckWrapper>
                        <F.CheckInput
                        type="radio"
                        id="mediaYoutube"
                        name="mediaType"
                        checked={formData.mediaType === "YOUTUBE"}
                        onChange={() => handleMediaTypeChange("YOUTUBE")}/>
                      </F.CheckWrapper>
                      <RadioLabel htmlFor="mediaYoutube">유튜브 링크형</RadioLabel>
                    </RadioOption>

                    <RadioOption>
                      <F.CheckWrapper>
                        <F.CheckInput
                        type="radio"
                        id="mediaDirect"
                        name="mediaType"
                        checked={formData.mediaType === "DIRECT_VIDEO"}
                        onChange={() => handleMediaTypeChange("DIRECT_VIDEO")}/>
                      </F.CheckWrapper>
                      <RadioLabel htmlFor="mediaDirect">서버 직접 업로드형</RadioLabel>
                    </RadioOption>
                  </CategoryOptions>
                </FormSection>

                <hr/>
                {/*해시태그 및 제목 입력 구역 */}
                <F.Row>
                  <FieldColumn $md={4}>
                    <p>
                      <EmphasizedLabel>해시태그 (말머리)</EmphasizedLabel>
                    </p>
                    <F.Select name="hashtag" value={formData.hashtag} onChange={handleChange} required>
                      <option value="">-- 필수 선택 --</option>
                      {HASHTAG_LIST.map((tag, index) => (
                        <option key={index} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </F.Select>
                  </FieldColumn>

                  <FieldColumn $md={8}>
                    <EmphasizedLabel>캠페인 제목</EmphasizedLabel>
                    <F.Control
                    name="title"
                    placeholder="목록에 노출될 제목을 적어주세요"
                    value={formData.title}
                    onChange={handleChange}
                    required/>
                  </FieldColumn>
                </F.Row>

                {/*상세 내용구역 */}
                <FormGroup>
                  <EmphasizedLabel>상세 내용</EmphasizedLabel>
                  <F.Control
                  as="textarea"
                  rows={5}
                  name="content"
                  placeholder="캠페인의 자세한 사연이나 설명을 적어주세요"
                  value={formData.content}
                  onChange={handleChange}
                  required/>
                </FormGroup>

                {/*동영상 링크 / 경로 */}
                {formData.mediaType !== "IMAGE" && (
                  <InsetFormGroup>
                    <PrimaryLabel>
                      {formData.mediaType === "YOUTUBE" ? "유튜브 링크(URL)" : "서버동영상 파일경로"}
                    </PrimaryLabel>
                    <F.Control
                    type="text"
                    name="mediaUrl"
                    placeholder={
                      formData.mediaType === "YOUTUBE" ? "https://youtube.com/.." : "/uploads/videos/campaign_"
                    }
                    value={formData.mediaUrl}
                    onChange={handleChange}
                    required={formData.mediaType !== "IMAGE"}/>
                  </InsetFormGroup>
                )}

                {/*썸네일 구역 */}
                <FormSection>
                  <EmphasizedLabel>썸네일 이미지 URL(최대 2MB)</EmphasizedLabel>
                  <F.Control
                  type="url"
                  name="thumbnailUrl"
                  placeholder="목록에 보여질 썸네일 주소를 입력하세요"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  required/>
                </FormSection>

                {/*썸네일 미리보기*/}
                {formData.thumbnailUrl && (
                  <PreviewBox>
                    <CampaignPreviewImage
                    src={formData.thumbnailUrl}
                    alt="썸네일 미리보기"
                    width={0}
                    height={0}
                    unoptimized
                    loading="eager"/>
                  </PreviewBox>
                )}
                <SubmitButton type="submit" $variant="primary" disabled={isLoading}>
                  {isLoading ? "등록 중..." : "캠페인 최종 등록하기"}
                </SubmitButton>
              </form>
            </F.CardBody>
          </FormCard>
        </F.Column>

        <F.Column $lg={4}>
          <FormCard>
            <FormCardHeader>
              <CardTitle>등록 안내 가이드</CardTitle>
            </FormCardHeader>
            <GuideBody>
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
            </GuideBody>
          </FormCard>
        </F.Column>
      </A.GridRow>
    </Layout>
  );
};
