"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { changeMyPassword, fetchMyAccount, toAccountError } from "../../accountApi";
import { queueToast } from "../../../components/Toast";
import { loginHref } from "../../../components/loginLink";
import { useImeSafeSubmit } from "../../../components/imeSafeSubmit";
import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

const MIN = 8;

// 💡 마이 > 설정 > 비밀번호 변경 (이메일로 가입한 회원만, 카카오 가입은 메뉴가 안 보임)
export default function PasswordChangePage() {
  const router = useRouter();
  const [form, setForm] = useState({current: "", next: "", confirm: ""});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const imeSafeSubmit = useImeSafeSubmit();

  // 들어오자마자 확인: 로그인 안 했으면 로그인 화면으로, 카카오 가입이면 비밀번호가 없어서 설정으로
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace(loginHref("/mypage/settings/password"));
      return;
    };
    fetchMyAccount()
      .then((me) => {
        if (me.provider !== "KAKAO") return;
        queueToast("카카오로 가입한 계정은 비밀번호가 없어요");
        router.replace("/mypage/settings");
      })
      .catch((error) => {
        if (toAccountError(error, "") === "UNAUTHORIZED") router.replace(loginHref("/mypage/settings/password"));
      });
  }, [router]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({...prev, [field]: value}));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return setError("지금 비밀번호를 적어 주세요.");
    if (form.next.length < MIN) return setError(`새 비밀번호는 ${MIN}자 이상으로 적어 주세요.`);
    if (form.next !== form.confirm) return setError("새 비밀번호가 서로 달라요.");
    setSaving(true);
    try {
      queueToast(await changeMyPassword(form.current, form.next));
      router.replace("/mypage/settings");
    } catch (err) {
      const message = toAccountError(err, "바꾸지 못했어요. 잠시 후 다시 시도해 주세요.");
      if (message === "UNAUTHORIZED") return router.replace(loginHref("/mypage/settings/password"));
      setError(message);
      setSaving(false);
    };
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="비밀번호 변경"/>
        <S.HeaderOffset/>
        <S.WriteForm onSubmit={handleSubmit} noValidate>
          <S.WriteField>
            <S.WriteLabel htmlFor="pw-current">지금 비밀번호</S.WriteLabel>
            <S.WriteInput id="pw-current" type="password" autoComplete="current-password" value={form.current} onChange={(e) => setField("current", e.target.value)}/>
          </S.WriteField>
          <S.WriteField>
            <S.WriteLabel htmlFor="pw-next">새 비밀번호</S.WriteLabel>
            <S.WriteInput id="pw-next" type="password" autoComplete="new-password" placeholder={`${MIN}자 이상`} value={form.next} onChange={(e) => setField("next", e.target.value)}/>
          </S.WriteField>
          <S.WriteField>
            <S.WriteLabel htmlFor="pw-confirm">새 비밀번호 확인</S.WriteLabel>
            <S.WriteInput id="pw-confirm" type="password" autoComplete="new-password" placeholder="한 번 더 입력" value={form.confirm} onChange={(e) => setField("confirm", e.target.value)}/>
          </S.WriteField>
          <S.WriteBar>
            {error && <S.WriteError as="p" role="alert">{error}</S.WriteError>}
            <S.WriteSubmit type="submit" disabled={saving} {...imeSafeSubmit}>{saving ? "바꾸는 중..." : "비밀번호 바꾸기"}</S.WriteSubmit>
          </S.WriteBar>
        </S.WriteForm>
      </S.Container>
    </S.AppWrapper>
  );
};
