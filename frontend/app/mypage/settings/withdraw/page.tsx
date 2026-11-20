"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { logoutUser } from "../../../redux/userSlice";
import { MyAccount, fetchMyAccount, toAccountError, withdrawMyAccount } from "../../accountApi";
import { queueToast } from "../../../components/Toast";
import { loginHref } from "../../../components/loginLink";
import { useImeSafeSubmit } from "../../../components/imeSafeSubmit";
import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

// 💡 마이 > 설정 > 회원 탈퇴
//    지워지는 것을 먼저 보여 주고, 이메일 가입은 비밀번호로 한 번 더 확인 (카카오 가입은 확인 체크만)
export default function WithdrawPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [account, setAccount] = useState<MyAccount | null>(null);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const imeSafeSubmit = useImeSafeSubmit();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.replace(loginHref("/mypage/settings/withdraw"));
      return;
    };
    fetchMyAccount().then(setAccount).catch(() => router.replace(loginHref("/mypage/settings/withdraw")));
  }, [router]);

  const kakao = account?.provider === "KAKAO";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return setError("안내를 확인했다고 체크해 주세요.");
    if (!kakao && !password) return setError("비밀번호를 적어 주세요.");
    setBusy(true);
    try {
      const message = await withdrawMyAccount(kakao ? undefined : password);
      dispatch(logoutUser());
      queueToast(message);
      router.replace("/");
    } catch (err) {
      setError(toAccountError(err, "탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요."));
      setBusy(false);
    };
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="회원 탈퇴"/>
        <S.HeaderOffset/>
        <S.WriteForm onSubmit={handleSubmit} noValidate>
          <S.WriteField>
            <S.WriteLabel as="span">탈퇴하면 이렇게 돼요</S.WriteLabel>
            <S.WithdrawNotice>
              <li>내가 쓴 실종·제보 글과 이야기 글, 그 글의 채팅, 남의 글에 단 댓글과 공감이 지워져요.</li>
              <li>다른 글에서 시작한 채팅은 나가기 처리되고, 상대는 더 이상 메시지를 보낼 수 없어요.</li>
              <li>입양·봉사 신청 내역과 알림이 지워져요.</li>
              <li>이름·연락처·이메일·프로필 사진은 지워지고 되돌릴 수 없어요.</li>
              <li>같은 이메일이나 카카오 계정으로 다시 가입할 수 있어요.</li>
            </S.WithdrawNotice>
          </S.WriteField>

          {account && !kakao && (
            <S.WriteField>
              <S.WriteLabel htmlFor="wd-password">비밀번호 확인</S.WriteLabel>
              <S.WriteInput id="wd-password" type="password" autoComplete="current-password" value={password} onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}/>
            </S.WriteField>
          )}

          <S.ChatReportBlock>
            <input type="checkbox" checked={agreed} onChange={(e) => {
              setAgreed(e.target.checked);
              setError("");
            }}/>
            <span>위 안내를 확인했고 탈퇴할게요</span>
          </S.ChatReportBlock>

          <S.WriteBar>
            {error && <S.WriteError as="p" role="alert">{error}</S.WriteError>}
            <S.WriteSubmit type="submit" disabled={busy || !account} {...imeSafeSubmit}>{busy ? "탈퇴하는 중..." : "탈퇴하기"}</S.WriteSubmit>
          </S.WriteBar>
        </S.WriteForm>
      </S.Container>
    </S.AppWrapper>
  );
};
