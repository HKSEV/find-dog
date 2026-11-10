"use client";

import * as S from "@/assets/css/Style.styles";

interface AdminPageLoadingProps {
  message?: string;
}

export default function AdminPageLoading({message = "관리자 화면을 불러오는 중입니다."}: AdminPageLoadingProps) {
  return (
    <S.AdminPageLoadingPanel role="status" aria-live="polite" aria-busy="true">
      <S.AdminPageSpinner aria-hidden="true"/>
      <S.AdminPageLoadingText>{message}</S.AdminPageLoadingText>
    </S.AdminPageLoadingPanel>
  );
};