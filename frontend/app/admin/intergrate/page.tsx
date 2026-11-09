"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setBoardType, updateIntegrateField, submitIntegrateContent } from "../../redux/integrateAdminSlice";

import { Layout } from "../../components/layout/Layout";
import AdminRegistrationList from "../../components/admin/AdminRegistrationList";
import { fetchAdminRegistrations } from "../../redux/registrationAdminSlice";

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
      dispatch(fetchAdminRegistrations("integrate"));
      openAlertModal(resultAction.payload || "성공적으로 등록되었습니다", undefined, {variant: "success"});
    } else {
      openAlertModal(resultAction.payload || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", undefined, {
        variant: "error"
      });
    };
  };

  return (
    <Layout>
      <S.AdminSettingPage>
        <S.AdminSettingHeader>
          <S.AdminSettingCaption>관리자 / 통합 게시물 설정</S.AdminSettingCaption>
          <S.AdminSettingTitle>통합 콘텐츠 등록관리</S.AdminSettingTitle>
          <S.AdminSettingDescription>유튜브 영상과 센터 소식, 도움이 필요한 사연을 한곳에서 관리하세요.</S.AdminSettingDescription>
        </S.AdminSettingHeader>

        <S.AdminSettingGrid>
          <S.AdminSettingCard aria-labelledby="integrate-form-title">
            <S.AdminSettingCardHeader>
              <S.AdminSettingCardTitle id="integrate-form-title">신규 콘텐츠 등록</S.AdminSettingCardTitle>
            </S.AdminSettingCardHeader>
            <S.AdminSettingCardBody>
              <S.AdminSettingForm onSubmit={handleSubmit}>
                <S.AdminSettingChoiceField>
                  <S.AdminSettingLegend>등록 카테고리 선택</S.AdminSettingLegend>
                  <S.AdminSettingOptions>
                    <S.AdminSettingOption>
                      <input
                      type="radio"
                      name="boardType"
                      checked={boardType === "YOUTUBE"}
                      onChange={() => handleBoardTypeChange("YOUTUBE")}/>
                      어서찾아주개 유튜브
                    </S.AdminSettingOption>
                    <S.AdminSettingOption>
                      <input
                      type="radio"
                      name="boardType"
                      checked={boardType === "FELLOW"}
                      onChange={() => handleBoardTypeChange("FELLOW")}/>
                      펠로우 소식
                    </S.AdminSettingOption>
                    <S.AdminSettingOption>
                      <input
                      type="radio"
                      name="boardType"
                      checked={boardType === "HELP"}
                      onChange={() => handleBoardTypeChange("HELP")}/>
                      도움이 필요해요
                    </S.AdminSettingOption>
                  </S.AdminSettingOptions>
                </S.AdminSettingChoiceField>

                <S.AdminSettingField>
                  <S.AdminSettingLabel htmlFor="integrate-title">제목</S.AdminSettingLabel>
                  <S.AdminSettingInput
                  id="integrate-title"
                  name="title"
                  placeholder="게시물 제목을 입력하세요"
                  value={formData.title}
                  onChange={handleChange}
                  required/>
                </S.AdminSettingField>

                {boardType === "YOUTUBE" && (
                  <S.AdminSettingFields>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="integrate-youtube-url">유튜브 영상 주소 (URL)</S.AdminSettingLabel>
                      <S.AdminSettingInput
                      id="integrate-youtube-url"
                      type="url"
                      name="youtubeUrl"
                      placeholder="유튜브 주소를 복사 붙여넣기 하세요"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      aria-describedby="integrate-youtube-help"
                      required/>
                      <S.AdminSettingHelp id="integrate-youtube-help">주소를 입력하면 아래 썸네일이 자동으로 채워집니다.</S.AdminSettingHelp>
                    </S.AdminSettingField>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="integrate-thumbnail">자동 추출된 썸네일 URL</S.AdminSettingLabel>
                      <S.AdminSettingInput
                      id="integrate-thumbnail"
                      type="url"
                      name="thumbnailUrl"
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
                  </S.AdminSettingFields>
                )}

                {(boardType === "FELLOW" || boardType === "HELP") && (
                  <S.AdminSettingFields>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="integrate-content">상세 내용 (본문 글)</S.AdminSettingLabel>
                      <S.AdminSettingTextarea
                      id="integrate-content"
                      rows={6}
                      name="content"
                      placeholder="자세한 사연이나 소식을 적어주세요."
                      value={formData.content}
                      onChange={handleChange}
                      required/>
                    </S.AdminSettingField>
                    <S.AdminSettingField>
                      <S.AdminSettingLabel htmlFor="integrate-image-url">대표 이미지 URL (필수)</S.AdminSettingLabel>
                      <S.AdminSettingInput
                      id="integrate-image-url"
                      type="url"
                      name="imageUrl"
                      placeholder="https://.."
                      value={formData.imageUrl}
                      onChange={handleChange}
                      required/>
                    </S.AdminSettingField>

                    {formData.imageUrl && (
                      <S.AdminSettingPreview>
                        <S.AdminSettingPreviewImage
                        src={formData.imageUrl}
                        alt="이미지 미리보기"
                        width={0}
                        height={0}
                        unoptimized
                        loading="eager"/>
                      </S.AdminSettingPreview>
                    )}

                    <S.AdminSettingFieldGrid>
                      <S.AdminSettingField>
                        <S.AdminSettingLabel htmlFor="integrate-video-url">동영상 첨부 URL (선택)</S.AdminSettingLabel>
                        <S.AdminSettingInput
                        id="integrate-video-url"
                        type="text"
                        name="videoUrl"
                        placeholder="/uploads/video.mp4"
                        value={formData.videoUrl}
                        onChange={handleChange}/>
                      </S.AdminSettingField>
                      <S.AdminSettingField>
                        <S.AdminSettingLabel htmlFor="integrate-attachment-url">기타 첨부파일 URL (선택)</S.AdminSettingLabel>
                        <S.AdminSettingInput
                        id="integrate-attachment-url"
                        type="text"
                        name="attachmentUrl"
                        placeholder="/uploads/file.pdf"
                        value={formData.attachmentUrl}
                        onChange={handleChange}/>
                      </S.AdminSettingField>
                    </S.AdminSettingFieldGrid>
                  </S.AdminSettingFields>
                )}

                <S.AdminSettingSubmit type="submit" disabled={isLoading}>
                  {isLoading
                    ? "등록 중..."
                    : boardType === "YOUTUBE"
                      ? "유튜브영상 등록하기"
                      : boardType === "FELLOW"
                        ? "펠로우 소식 등록하기"
                        : "도움 요청글 등록하기"}
                </S.AdminSettingSubmit>
              </S.AdminSettingForm>
            </S.AdminSettingCardBody>
          </S.AdminSettingCard>

          <S.AdminSettingGuide aria-labelledby="integrate-guide-title">
            <S.AdminSettingCardHeader>
              <S.AdminSettingCardTitle id="integrate-guide-title">카테고리별 등록 안내</S.AdminSettingCardTitle>
            </S.AdminSettingCardHeader>
            <S.AdminSettingGuideBody>
              <p>
                <strong>어서찾아주개 유튜브</strong>
                <br/>
                유튜브 영상 주소를 입력하면 썸네일과 함께 메인 화면에 노출됩니다.
              </p>
              <hr/>
              <p>
                <strong>펠로우 소식</strong>
                <br/>
                센터의 소식이나 근황을 등록합니다. 게시물에 사용할 대표 이미지를 함께 입력해 주세요.
              </p>
              <hr/>
              <p>
                <strong>도움이 필요해요</strong>
                <br/>
                긴급한 구조나 지원이 필요한 동물들의 사연을 등록합니다. 필요한 도움을 본문에 자세히 적어 주세요.
              </p>
            </S.AdminSettingGuideBody>
          </S.AdminSettingGuide>
        </S.AdminSettingGrid>

        <AdminRegistrationList kind="integrate"/>
      </S.AdminSettingPage>
    </Layout>
  );
};
