"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setBoardType, updateIntegrateField, submitIntegrateContent } from "../../redux/integrateAdminSlice";

import { Layout } from "../../components/layout/Layout";

import useAdminModal from "@/app/components/contexts/AdminModalContext";
import * as S from "@/assets/css/Style.styles";

export default function Intergrate() {
  const dispatch = useDispatch<AppDispatch>();
  const {openAlertModal} = useAdminModal();

  // Redux Store 상태 조회
  const {boardType, formData, isLoading} = useSelector((state: RootState) => state.integrateAdmin);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    dispatch(updateIntegrateField({name: name as keyof RootState["integrateAdmin"]["formData"], value}));
  };

  const handleBoardTypeChange = (type: "YOUTUBE" | "FELLOW" | "HELP") => {
    dispatch(setBoardType(type));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(submitIntegrateContent({boardType, formData}));

    if (submitIntegrateContent.fulfilled.match(resultAction)) {
      openAlertModal(resultAction.payload || "성공적으로 등록되었습니다", undefined, {variant: "success"});
    } else {
      openAlertModal(resultAction.payload || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", undefined, {
        variant: "error"
      });
    };
  };

  return (
    <Layout>
      <S.PageHeader>
        <S.IntegratePageTitle>통합 콘텐츠 등록관리</S.IntegratePageTitle>
      </S.PageHeader>

      <S.GridRow>
        <S.AdminFormColumn $lg={8}>
          <S.IntegrateFormCard>
            <S.IntegrateFormCardHeader>
              <S.IntegrateCardTitle>신규 콘텐츠 등록</S.IntegrateCardTitle>
            </S.IntegrateFormCardHeader>
            <S.AdminFormCardBody>
              <form onSubmit={handleSubmit}>
                <S.IntegrateInsetFormGroup>
                  <S.IntegrateFieldLabel>등록 카테고리 선택</S.IntegrateFieldLabel>

                  <S.IntegrateCategoryOptions>
                    <S.IntegrateRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="typeYoutube"
                        name="boardType"
                        checked={boardType === "YOUTUBE"}
                        onChange={() => handleBoardTypeChange("YOUTUBE")}/>
                      </S.CheckWrapper>
                      <S.CategoryLabel htmlFor="typeYoutube">🎥 어서찾아주개 유튜브</S.CategoryLabel>
                    </S.IntegrateRadioOption>

                    <S.IntegrateRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="typeFellow"
                        name="boardType"
                        checked={boardType === "FELLOW"}
                        onChange={() => handleBoardTypeChange("FELLOW")}/>
                      </S.CheckWrapper>
                      <S.CategoryLabel htmlFor="typeFellow">📰 펠로우 소식</S.CategoryLabel>
                    </S.IntegrateRadioOption>

                    <S.IntegrateRadioOption>
                      <S.CheckWrapper>
                        <S.CheckInput
                        type="radio"
                        id="typeHelp"
                        name="boardType"
                        checked={boardType === "HELP"}
                        onChange={() => handleBoardTypeChange("HELP")}/>
                      </S.CheckWrapper>
                      <S.CategoryLabel htmlFor="typeHelp">🚨 도움이 필요해요</S.CategoryLabel>
                    </S.IntegrateRadioOption>
                  </S.IntegrateCategoryOptions>
                </S.IntegrateInsetFormGroup>

                <hr/>

                {/* 공통입력 : 제목 */}
                <S.IntegrateFormGroup>
                  <S.IntegrateEmphasizedLabel>제목</S.IntegrateEmphasizedLabel>
                  <S.Control
                  name="title"
                  placeholder="게시물 제목을 입력하세요"
                  value={formData.title}
                  onChange={handleChange}
                  required/>
                </S.IntegrateFormGroup>

                {boardType === "YOUTUBE" && (
                  <>
                    <S.IntegrateFormGroup>
                      <S.IntegrateEmphasizedLabel>유튜브 영상 주소 (URL)</S.IntegrateEmphasizedLabel>
                      <S.Control
                      type="url"
                      name="youtubeUrl"
                      placeholder="유튜브 주소를 복사 붙여넣기 하세요"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      required/>
                      <S.IntegrateHelpText>주소를 입력하면 아래 썸네일이 자동으로 채워집니다.</S.IntegrateHelpText>
                    </S.IntegrateFormGroup>
                    <S.IntegrateFormSection>
                      <S.IntegrateEmphasizedLabel>자동 추출된 썸네일 URL</S.IntegrateEmphasizedLabel>
                      <S.Control
                      type="url"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleChange}
                      required/>
                    </S.IntegrateFormSection>
                    {formData.thumbnailUrl && (
                      <S.IntegratePreviewBox>
                        <S.VideoThumbnail
                        src={formData.thumbnailUrl}
                        alt="썸네일 미리보기"
                        width={0}
                        height={0}
                        unoptimized
                        loading="eager"/>
                      </S.IntegratePreviewBox>
                    )}
                  </>
                )}

                {(boardType === "FELLOW" || boardType === "HELP") && (
                  <>
                    <S.IntegrateFormGroup>
                      <S.IntegrateEmphasizedLabel>상세 내용 (본문 글)</S.IntegrateEmphasizedLabel>
                      <S.Control
                      as="textarea"
                      rows={6}
                      name="content"
                      placeholder="자세한 사연이나 소식을 적어주세요."
                      value={formData.content}
                      onChange={handleChange}
                      required/>
                    </S.IntegrateFormGroup>
                    <S.IntegrateFormGroup>
                      <S.IntegratePrimaryLabel>대표 이미지 URL (필수)</S.IntegratePrimaryLabel>
                      <S.Control
                      type="url"
                      name="imageUrl"
                      placeholder="https://.."
                      value={formData.imageUrl}
                      onChange={handleChange}
                      required/>
                    </S.IntegrateFormGroup>

                    {formData.imageUrl && (
                      <S.IntegratePreviewBox>
                        <S.VideoThumbnail
                        src={formData.imageUrl}
                        alt="이미지 미리보기"
                        width={0}
                        height={0}
                        unoptimized
                        loading="eager"/>
                      </S.IntegratePreviewBox>
                    )}

                    <S.Row>
                      <S.AttachmentColumn $md={6}>
                        <label>동영상 첨부 URL (선택)</label>
                        <S.Control
                        type="text"
                        name="videoUrl"
                        placeholder="/uploads/video.mp4"
                        value={formData.videoUrl}
                        onChange={handleChange}/>
                      </S.AttachmentColumn>
                      <S.AttachmentColumn $md={6}>
                        <label>기타 첨부파일 URL (선택)</label>
                        <S.Control
                        type="text"
                        name="attachmentUrl"
                        placeholder="/uploads/file.pdf"
                        value={formData.attachmentUrl}
                        onChange={handleChange}/>
                      </S.AttachmentColumn>
                    </S.Row>
                  </>
                )}

                <S.IntegrateSubmitButton type="submit" $variant="primary" disabled={isLoading}>
                  {isLoading
                    ? "등록 중..."
                    : boardType === "YOUTUBE"
                      ? "유튜브영상 등록하기"
                      : boardType === "FELLOW"
                        ? "펠로우 소식 등록하기"
                        : "도움 요청글 등록하기"}
                </S.IntegrateSubmitButton>
              </form>
            </S.AdminFormCardBody>
          </S.IntegrateFormCard>
        </S.AdminFormColumn>

        {/*안내 가이드 패널 */}
        <S.AdminFormColumn $lg={4}>
          <S.IntegrateFormCard>
            <S.IntegrateFormCardHeader>
              <S.IntegrateCardTitle>💡 카테고리별 등록 안내</S.IntegrateCardTitle>
            </S.IntegrateFormCardHeader>
            <S.IntegrateGuideBody>
              <p>
                <strong>🎥 어서찾아주개 유튜브</strong>
                <br/>
                유튜브 영상 주소만 붙여넣으면 메인 화면의 &apos;2단 그리드&apos; 영역에 썸네일과 함께 노출됩니다.
              </p>
              <hr/>
              <p>
                <strong>📰 펠로우 소식</strong>
                <br/>
                센터의 훈훈한 소식이나 근황을 올립니다. 메인 화면의 &apos;3단 그리드&apos;에 정방형으로 예쁘게
                렌더링됩니다. 대표 이미지는 필수입니다!
              </p>
              <hr/>
              <p>
                <strong>🚨 도움이 필요해요</strong>
                <br/>
                긴급한 구조나 지원이 필요한 동물들의 사연을 올립니다. 메인 화면의 &apos;4단 그리드&apos;에 노출되어 가장
                많은 이미지를 한눈에 보여줍니다.
              </p>
            </S.IntegrateGuideBody>
          </S.IntegrateFormCard>
        </S.AdminFormColumn>
      </S.GridRow>
    </Layout>
  );
};
