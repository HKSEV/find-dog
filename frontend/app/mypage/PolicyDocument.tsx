"use client";

import React from "react";
import Header from "@/app/components/Header";
import { PolicySection, POLICY_EFFECTIVE_DATE } from "./policyTexts";
import * as S from "@/assets/css/Style.styles";

// 💡 이용약관 · 개인정보처리방침 공용 화면 (제목 + 조항 목록)
export default function PolicyDocument({title, lead, sections}: {title: string; lead: string; sections: PolicySection[]}) {
  return (
    <S.AppWrapper>
      <S.Container>
        <Header title={title}/>
        <S.HeaderOffset/>
        <S.PolicyPage>
          <S.PolicyLead>{lead} (시행일 {POLICY_EFFECTIVE_DATE})</S.PolicyLead>
          {sections.map((section) => (
            <S.PolicySection key={section.title}>
              <S.PolicyHeading>{section.title}</S.PolicyHeading>
              <S.PolicyBody>{section.body}</S.PolicyBody>
            </S.PolicySection>
          ))}
        </S.PolicyPage>
      </S.Container>
    </S.AppWrapper>
  );
};
