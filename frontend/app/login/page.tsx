"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setEmail, setPassword, submitLogin } from "../redux/loginSlice";

import Header from "../components/Header";
import { CustomAlert } from "../components/CustomAlert";
import * as S from "@/assets/css/Style.styles";

interface AnimatedInputProps {
  type?: React.HTMLInputTypeAttribute;
  label: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

// 💡 AnimatedInput 컴포넌트에 onKeyDown 프롭스 추가 허용
const AnimatedInput = ({type, label, value, onChange, onKeyDown}: AnimatedInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <S.LoginInputWrapper>
      <S.LoginFloatingLabel $isActive={isActive}>{label}</S.LoginFloatingLabel>
      <S.LoginFloatingInput
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown} // 💡 onKeyDown 이벤트 연결
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={label}/>
    </S.LoginInputWrapper>
  );
};

// ==========================================
// 💡 3. 메인 로그인 페이지 컴포넌트
// ==========================================
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const {email, password, isLoading} = useSelector((state: RootState) => state.login);

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
    onConfirm: () => {}
  });

  const closeAlert = () => {
    setAlertConfig((prev) => ({...prev, isOpen: false}));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setAlertConfig({
        isOpen: true,
        message: "이메일과 비밀번호를 입력해주세요.",
        type: "error",
        onConfirm: closeAlert
      });
      return;
    };

    const resultAction = await dispatch(submitLogin({email, password}));

    if (submitLogin.fulfilled.match(resultAction)) {
      setAlertConfig({
        isOpen: true,
        message: "로그인 성공!",
        type: "success",
        onConfirm: () => {
          closeAlert();
          router.push("/");
        }
      });
    } else {
      setAlertConfig({
        isOpen: true,
        message: `로그인 실패: ${resultAction.payload}`,
        type: "error",
        onConfirm: closeAlert
      });
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
    <S.AppWrapper>
      <S.Container>
        <S.LoginAnimItem $delay={0} $isSlideDown={true}>
          <Header title="로그인" onBackClick={() => router.back()}/>
        </S.LoginAnimItem>

        <S.HeaderOffset/>

        <S.LayOutPadding>
          <S.LoginAnimItem $delay={0.1}>
            <AnimatedInput
            type="email"
            label="이메일"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setEmail(e.target.value))}
            onKeyDown={handleKeyDown} // 💡 Enter 입력 감지
          />
          </S.LoginAnimItem>

          <S.HB10/>

          <S.LoginAnimItem $delay={0.2}>
            <AnimatedInput
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch(setPassword(e.target.value))}
            onKeyDown={handleKeyDown} // 💡 Enter 입력 감지
          />
          </S.LoginAnimItem>
        </S.LayOutPadding>

        <S.BtnBottomWrap>
          <S.LoginAnimItem $delay={0.3}>
            <S.BaseBtn $variant="primary" onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "로그인 중..." : "Login"}
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
      </S.Container>

      <CustomAlert
      isOpen={alertConfig.isOpen}
      message={alertConfig.message}
      type={alertConfig.type}
      onConfirm={alertConfig.onConfirm}/>
    </S.AppWrapper>
  );
};
