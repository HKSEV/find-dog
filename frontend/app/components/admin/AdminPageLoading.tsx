"use client";

import * as S from "@/assets/css/Style.styles";

export default function AdminPageLoading() {
  return (
    <S.AdminPageLoadingPanel role="status" aria-live="polite" aria-busy="true">
      <S.AdminPageSpinner aria-hidden="true"/>
      <S.AdminPageLoadingText>관리자 화면을 불러오는 중입니다.</S.AdminPageLoadingText>
    </S.AdminPageLoadingPanel>
  );
};
