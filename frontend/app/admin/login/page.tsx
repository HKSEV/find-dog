'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { setAdminEmail, setAdminPassword, submitAdminLogin } from '../../redux/adminLoginSlice';

import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import * as S from '@/assets/css/style.styles';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux Store 상태 조회
  const {email, password, isLoading} = useSelector((state: RootState) => state.adminLogin);
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 버튼을 누를 때 실행되는 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해 주세요');
      return;
    };

    const resultAction = await dispatch(submitAdminLogin({email, password}));

    if (submitAdminLogin.fulfilled.match(resultAction)) {
      const data = resultAction.payload;
      alert(`${data.name}님, ${data.message}`);
      router.push('/admin');
    } else {
      alert(resultAction.payload || '로그인 중 오류가 발생했습니다');
    };
  };

  return (
    <S.MemberContainer>
    <S.MemberCard aria-labelledby="admin-login-title">
      <S.MemberHeader>
        <S.MemberIcon aria-hidden="true">
          <FaUser/>
        </S.MemberIcon>
        <S.MemberTitle id="admin-login-title">Welcome Back!</S.MemberTitle>
        <S.MemberDescription>관리자 계정에 로그인하세요</S.MemberDescription>
      </S.MemberHeader>

      <S.MemberForm onSubmit={handleSubmit}>
        <S.MemberField>
          <S.MemberInputLabel htmlFor="admin-email">이메일</S.MemberInputLabel>
          <S.MemberInputWrapper>
            <FiMail aria-hidden="true"/>
            <S.MemberInput
            id="admin-email"
            name="email"
            type="email"
            placeholder="Enter Email Address..."
            autoComplete="username"
            value={email}
            onChange={(e) => dispatch(setAdminEmail(e.target.value))}
            required/>
          </S.MemberInputWrapper>
        </S.MemberField>

        <S.MemberField>
          <S.MemberInputLabel htmlFor="admin-password">비밀번호</S.MemberInputLabel>
          <S.MemberInputWrapper>
            <FiLock aria-hidden="true"/>
            <S.MemberInput
            id="admin-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => dispatch(setAdminPassword(e.target.value))}
            required/>
            <S.MemberPasswordToggle
            type="button"
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            aria-controls="admin-password"
            onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FiEyeOff aria-hidden="true"/> : <FiEye aria-hidden="true"/>}
            </S.MemberPasswordToggle>
          </S.MemberInputWrapper>
        </S.MemberField>

        <S.MemberButton type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "Login"}
        </S.MemberButton>
      </S.MemberForm>
    </S.MemberCard>
  </S.MemberContainer>
  );
};
