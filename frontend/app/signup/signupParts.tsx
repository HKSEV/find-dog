"use client";

import { RootState } from "../store/store";
import * as S from "@/assets/css/Style.styles";
import { signupMarketingSummary, signupPrivacySummary, signupTermsSummary } from "../mypage/policyTexts";

type FormField = keyof RootState["signup"]["formData"];

// 💡 약관 (필수 3개 + 선택 1개). "보기"에는 요약, 전문은 마이 > 이용안내 (mypage/policyTexts.ts)
export const agreements: {field: FormField; label: string; text?: string}[] = [
  {field: "agreeTerms", label: "이용약관 (필수)", text: signupTermsSummary},
  {field: "agreePrivacy", label: "개인정보 수집·이용 (필수)", text: signupPrivacySummary},
  {field: "agreeAge", label: "만 14세 이상이에요 (필수)"},
  {field: "marketingAgreed", label: "마케팅 정보 메일·문자 수신 (선택)", text: signupMarketingSummary}
];

// 네모 체크 (진짜 checkbox + 모양)
export const Check = ({checked, onChange, label}: {checked: boolean; onChange: (checked: boolean) => void; label?: string}) => (
  <S.SignupCheck>
    <input type="checkbox" checked={checked} aria-label={label} onChange={(e) => onChange(e.target.checked)}/>
    <i><S.SignupCheckIcon/></i>
  </S.SignupCheck>
);
