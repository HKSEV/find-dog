"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import AdminRegistrationList from "./AdminRegistrationList";
import AdminRegistrationEditModal from "./AdminRegistrationEditModal";
import type { AdminOperation } from "@/lib/adminOperations";
import * as S from "@/assets/css/Style.styles";

export default function AdminOperationPage({operation}: {operation: AdminOperation}) {
  const {kind, area, title, description} = operation;
  const [isCreating, setIsCreating] = useState(false);
  const canCreate = kind === "needHelp" || kind === "volunteer";

  return (
    <S.AdminSettingPage>
      <S.AdminSettingHeader>
        <S.AdminSettingCaption>관리자 / {area}</S.AdminSettingCaption>
        <S.AdminSettingTitle>{title} 관리</S.AdminSettingTitle>
        <S.AdminSettingDescription>{description}</S.AdminSettingDescription>
      </S.AdminSettingHeader>
      {canCreate && (
        <S.AdminSettingCard>
          <S.AdminSettingCardHeader>
            <S.AdminSettingCardTitle>신규 {title}</S.AdminSettingCardTitle>
          </S.AdminSettingCardHeader>
          <S.AdminSettingCardBody>
            <S.AdminSettingSubmit type="button" onClick={() => setIsCreating(true)}>
              <FiPlus aria-hidden="true"/>
              {title} 등록
            </S.AdminSettingSubmit>
          </S.AdminSettingCardBody>
        </S.AdminSettingCard>
      )}
      <AdminRegistrationList kind={kind}/>
      {canCreate && isCreating && (
        <AdminRegistrationEditModal mode="create" kind={kind} onClose={() => setIsCreating(false)}/>
      )}
    </S.AdminSettingPage>
  );
};
