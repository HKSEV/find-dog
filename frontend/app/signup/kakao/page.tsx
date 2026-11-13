"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { AppDispatch } from "../../store/store";
import { loadUserFromStorage } from "../../redux/userSlice";
import { completeKakaoSignup } from "../../mypage/accountApi";
import { queueToast, showToast } from "../../components/Toast";
import { clearPending, KakaoPending, readPending, saveKakaoLogin, takeKakaoNext } from "../../oauth/kakao/kakaoLogin";
import Header from "../../components/Header";
import { agreements, Check } from "../signupParts";
import * as S from "@/assets/css/Style.styles";

type Agree = "agreeTerms" | "agreePrivacy" | "agreeAge" | "marketingAgreed";
type Field = "nickname" | "name" | "phone";

const userTypes = [{label: "일반 회원", value: "GENERAL"}, {label: "업체 (보호소·병원 등)", value: "BUSINESS"}];

// ==========================================
// 💡 카카오로 처음 가입: 약관 동의 + 이름·휴대폰·닉네임
//    카카오는 이름·휴대폰을 주지 않아서 여기서 받음. 마쳐야 로그인 상태가 됨
// ==========================================
export default function KakaoSignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [pending, setPending] = useState<KakaoPending | null>(null);
  const [agree, setAgree] = useState<Record<Agree, boolean>>({agreeTerms: false, agreePrivacy: false, agreeAge: false, marketingAgreed: false});
  const [openTerms, setOpenTerms] = useState<Agree | null>(null);
  const [form, setForm] = useState({userType: "GENERAL", nickname: "", name: "", phone: ""});
  const [errors, setErrors] = useState<Partial<Record<Field | "agree", string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // 카카오 로그인을 거치지 않고 들어오면 로그인 화면으로
  useEffect(() => {
    const value = readPending();
    if (!value) {
      router.replace("/login");
      return;
    };
    const timer = setTimeout(() => {
      setPending(value);
      setForm((prev) => ({...prev, nickname: value.nickname}));
    }, 0);
    return () => clearTimeout(timer);
  }, [router]);

  const allAgreed = Object.values(agree).every(Boolean);

  const setField = (field: Field | "userType", value: string) => {
    setForm((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, [field]: undefined}));
  };

  const setAgreeField = (field: Agree, value: boolean) => {
    setAgree((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, agree: undefined}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending || submitting) return;

    const next: Partial<Record<Field | "agree", string>> = {};
    const nickname = form.nickname.trim();
    const phone = form.phone.replace(/-/g, "");
    if (!agree.agreeTerms || !agree.agreePrivacy || !agree.agreeAge) next.agree = "필수 약관에 모두 동의해 주세요.";
    if (!form.name.trim()) next.name = "이름을 적어 주세요.";
    if (!/^\d{9,11}$/.test(phone)) next.phone = "휴대폰 번호를 숫자로 적어 주세요.";
    if (!nickname) next.nickname = "닉네임을 적어 주세요.";
    else if (nickname.length > 20) next.nickname = "닉네임은 20자까지 쓸 수 있어요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      // 맨 위 약관이 빠졌으면 위로, 아니면 처음 틀린 칸으로 (아래 고정 버튼에 가려 오류를 못 보는 일 막기)
      setTimeout(() => {
        if (next.agree) window.scrollTo(0, 0);
        else document.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus();
      }, 0);
      return;
    };

    setSubmitting(true);
    try {
      const account = await completeKakaoSignup(pending.token, {
        nickname, name: form.name.trim(), phone, userType: form.userType,
        agreed: true, marketingAgreed: agree.marketingAgreed
      });
      clearPending();
      saveKakaoLogin(pending.token, account.nickname);
      dispatch(loadUserFromStorage());
      queueToast(`가입이 끝났어요. ${account.nickname}님, 반가워요`);
      router.replace(takeKakaoNext());
    } catch (error) {
      setSubmitting(false);
      if (axios.isAxiosError(error)) {
        const message = typeof error.response?.data === "string" ? error.response.data : "";
        if (error.response?.status === 409 && message.includes("닉네임")) {
          setErrors({nickname: message});
          return;
        };
        if (error.response?.status === 401 || error.response?.status === 409) {
          // 시간이 지났거나 이미 가입을 마침: 카카오 로그인부터 다시
          clearPending();
          queueToast(error.response.status === 409 ? "이미 가입을 마쳤어요. 다시 로그인해 주세요" : "시간이 지나서 다시 로그인해야 해요");
          router.replace("/login");
          return;
        };
        if (message) {
          showToast(message);
          return;
        };
      };
      showToast("가입하지 못했어요. 잠시 후 다시 시도해 주세요.");
    };
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header
        title="카카오로 가입"
        isModal
        onClose={() => {
          // 그만두면 로그인하지 않은 상태로. 다음에 카카오로 로그인하면 이 화면이 다시 나옴
          clearPending();
          router.replace("/");
        }}/>
        <S.HeaderOffset/>

        {pending && (
          <S.SignupBody as="form" onSubmit={handleSubmit} noValidate>
            <S.SignupTitle>가입을 마치려면<br/>몇 가지만 알려 주세요</S.SignupTitle>

            <S.SignupAgreeAll>
              <Check
              checked={allAgreed}
              label="모두 동의해요"
              onChange={(value) => {
                setAgree({agreeTerms: value, agreePrivacy: value, agreeAge: value, marketingAgreed: value});
                setErrors((prev) => ({...prev, agree: undefined}));
              }}/>
              모두 동의해요
            </S.SignupAgreeAll>

            <S.SignupAgreeList>
              {agreements.map(({field, label, text}) => {
                const key = field as Agree;
                return (
                  <S.SignupAgreeItem key={key}>
                    <S.SignupAgreeRow>
                      <label>
                        <Check checked={agree[key]} onChange={(value) => setAgreeField(key, value)}/>
                        {label}
                      </label>
                      {text && (
                        <S.SignupViewButton
                        type="button"
                        aria-expanded={openTerms === key}
                        onClick={() => setOpenTerms(openTerms === key ? null : key)}>
                          {openTerms === key ? "닫기" : "보기 ›"}
                        </S.SignupViewButton>
                      )}
                    </S.SignupAgreeRow>
                    {text && openTerms === key && <S.SignupTermsText>{text}</S.SignupTermsText>}
                  </S.SignupAgreeItem>
                );
              })}
            </S.SignupAgreeList>
            {errors.agree && <S.WriteError as="p">{errors.agree}</S.WriteError>}

            <S.WriteField>
              <S.WriteLabel as="span" id="kakao-type-title">가입 유형</S.WriteLabel>
              <S.ApplyChoiceGroup $columns={2} role="radiogroup" aria-labelledby="kakao-type-title">
                {userTypes.map((option) => (
                  <S.WriteChoice
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={form.userType === option.value}
                  $checked={form.userType === option.value}
                  onClick={() => setField("userType", option.value)}>
                    {option.label}
                  </S.WriteChoice>
                ))}
              </S.ApplyChoiceGroup>
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="kakao-nickname">닉네임</S.WriteLabel>
              <S.WriteInput
              id="kakao-nickname"
              value={form.nickname}
              $invalid={Boolean(errors.nickname)}
              aria-invalid={Boolean(errors.nickname)}
              onChange={(e) => setField("nickname", e.target.value)}/>
              {errors.nickname
                ? <S.WriteError>{errors.nickname}</S.WriteError>
                : <S.SignupHint>다른 회원에게 보이는 이름이에요</S.SignupHint>}
            </S.WriteField>

            <S.SignupGroupHint>아래 정보는 입양 신청서에 미리 채워져요</S.SignupGroupHint>
            <S.WriteField>
              <S.WriteLabel htmlFor="kakao-name">이름 (실명)</S.WriteLabel>
              <S.WriteInput
              id="kakao-name"
              autoComplete="name"
              placeholder="홍길동"
              value={form.name}
              $invalid={Boolean(errors.name)}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => setField("name", e.target.value)}/>
              {errors.name && <S.WriteError>{errors.name}</S.WriteError>}
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="kakao-phone">휴대폰 번호</S.WriteLabel>
              <S.WriteInput
              id="kakao-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01012345678"
              value={form.phone}
              $invalid={Boolean(errors.phone)}
              aria-invalid={Boolean(errors.phone)}
              onChange={(e) => setField("phone", e.target.value)}/>
              {errors.phone && <S.WriteError>{errors.phone}</S.WriteError>}
            </S.WriteField>

            <S.WriteBar>
              <S.WriteSubmit type="submit" disabled={submitting}>{submitting ? "가입하는 중..." : "가입 완료"}</S.WriteSubmit>
            </S.WriteBar>
          </S.SignupBody>
        )}
      </S.Container>
    </S.AppWrapper>
  );
}
