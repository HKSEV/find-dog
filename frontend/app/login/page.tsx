"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setEmail, setPassword, submitLogin } from "../redux/loginSlice";
import { SIGNUP_EMAIL_KEY, safeNext } from "../components/loginLink";
import { queueToast } from "../components/Toast";

import Header from "../components/Header";
import * as S from "@/assets/css/Style.styles";

interface AnimatedInputProps {
  type?: React.HTMLInputTypeAttribute;
  label: string;
  value: string;
  invalid?: boolean;
  autoComplete?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

// 💡 AnimatedInput 컴포넌트에 onKeyDown 프롭스 추가 허용
const AnimatedInput = ({type, label, value, invalid, autoComplete, onChange, onKeyDown}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <S.LoginInputWrapper>
      <S.LoginFloatingLabel $isActive={isActive}>{label}</S.LoginFloatingLabel>
      <S.LoginFloatingInput
      type={type}
      value={value}
      autoComplete={autoComplete}
      aria-label={label}
      aria-invalid={invalid}
      $invalid={invalid}
      onChange={onChange}
      onKeyDown={onKeyDown} // 💡 onKeyDown 이벤트 연결
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={label}/>
    </S.LoginInputWrapper>
  );
};

type LoginErrors = {email?: string; password?: string};

// ==========================================
// 💡 3. 메인 로그인 페이지 컴포넌트
//    성공: 모달 없이 하려던 화면(?next=)이나 홈으로 이동하고, 그 화면에서 "○○님, 반가워요" 토스트
//    실패: 모달 대신 칸 아래 빨간 한 줄
// ==========================================
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const {email, password, isLoading} = useSelector((state: RootState) => state.login);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [joined, setJoined] = useState(false); // 회원가입을 마치고 온 경우

  // 회원가입에서 넘어왔으면 이메일을 채우고 안내 배너를 보여줌
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const joinedEmail = sessionStorage.getItem(SIGNUP_EMAIL_KEY);
        if (joinedEmail) {
          sessionStorage.removeItem(SIGNUP_EMAIL_KEY);
          dispatch(setEmail(joinedEmail));
          setJoined(true);
        };
      } catch {
        // 무시
      };
    }, 0);
    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleLogin = async () => {
    const next: LoginErrors = {};
    if (!email.trim()) next.email = "이메일을 적어 주세요.";
    if (!password) next.password = "비밀번호를 적어 주세요.";
    if (next.email || next.password) {
      setErrors(next);
      return;
    };

    const resultAction = await dispatch(submitLogin({email: email.trim(), password}));

    if (submitLogin.fulfilled.match(resultAction)) {
      const nickname = localStorage.getItem("nickname");
      queueToast(nickname ? `${nickname}님, 반가워요` : "반가워요");
      dispatch(setPassword(""));
      router.replace(safeNext(searchParams.get("next")));
    } else {
      setErrors({password: "이메일 또는 비밀번호가 맞지 않아요."});
    };
  };

  // 💡 Enter 키 입력 감지 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    };
  };

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <>
      <S.LayOutPadding>
        {joined && <S.NoticeBanner>가입이 끝났어요. 로그인해 주세요.</S.NoticeBanner>}

        <S.LoginAnimItem $delay={0.1}>
          <AnimatedInput
          type="email"
          label="이메일"
          autoComplete="email"
          value={email}
          invalid={Boolean(errors.email)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setEmail(e.target.value));
            setErrors((prev) => ({...prev, email: undefined}));
          }}
          onKeyDown={handleKeyDown} // 💡 Enter 입력 감지
        />
          {errors.email && <S.LoginError>{errors.email}</S.LoginError>}
        </S.LoginAnimItem>

        <S.HB10/>

        <S.LoginAnimItem $delay={0.2}>
          <AnimatedInput
          type="password"
          label="비밀번호"
          autoComplete="current-password"
          value={password}
          invalid={Boolean(errors.password)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setPassword(e.target.value));
            setErrors((prev) => ({...prev, password: undefined}));
          }}
          onKeyDown={handleKeyDown} // 💡 Enter 입력 감지
        />
          {errors.password && <S.LoginError role="alert">{errors.password}</S.LoginError>}
        </S.LoginAnimItem>
      </S.LayOutPadding>

      <S.BtnBottomWrap>
        <S.LoginAnimItem $delay={0.3}>
          <S.BaseBtn $variant="primary" onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </S.BaseBtn>
        </S.LoginAnimItem>
        <br/>

        <S.LoginAnimItem $delay={0.4}>
          <S.BaseBtn $variant="kakao" onClick={handleKakaoLogin}>
            카카오톡으로 간편하게 시작하기
          </S.BaseBtn>
        </S.LoginAnimItem>
        <br/>

        <S.LoginAnimItem $delay={0.5}>
          <S.BaseBtn $variant="local">Apple로 로그인</S.BaseBtn>
        </S.LoginAnimItem>

        <S.LoginAnimItem $delay={0.6}>
          <S.SignupPrompt>
            아직 계정이 없으시다고요? <S.SignupLink onClick={() => router.push("/signup")}>회원가입</S.SignupLink>
          </S.SignupPrompt>
        </S.LoginAnimItem>
      </S.BtnBottomWrap>
    </>
  );
};

export default function LoginPage() {
  return (
    <S.AppWrapper>
      <S.Container>
        <S.LoginAnimItem $delay={0} $isSlideDown={true}>
          <Header title="로그인" isModal/>
        </S.LoginAnimItem>

        <S.HeaderOffset/>

        <Suspense>
          <LoginForm/>
        </Suspense>
      </S.Container>
    </S.AppWrapper>
  );
};
