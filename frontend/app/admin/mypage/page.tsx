"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAdminProfile } from "../../redux/adminProfileSlice";
import { Layout } from "../../components/layout/Layout";
import AdminProfileAvatar from "../../components/AdminProfileAvatar";
import * as S from "@/assets/css/Style.styles";

export default function AdminMyPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {profile, status, error} = useSelector((state: RootState) => state.adminProfile);
  const fields = profile
    ? [
        {label: "이름", value: profile.name},
        {label: "닉네임", value: profile.nickname},
        {label: "이메일", value: profile.email},
        {label: "연락처", value: profile.phone},
        {label: "관리자 등급", value: profile.adminLevel},
        {label: "부서", value: profile.department}
      ]
    : [];

  return (
    <Layout>
      <S.AdminProfilePage>
        <S.AdminProfileTitle>마이페이지</S.AdminProfileTitle>
        <S.AdminProfileDescription>내 계정 정보와 관리자 정보를 확인하세요.</S.AdminProfileDescription>
        <S.AdminProfileCard aria-label="관리자 회원 정보" aria-busy={status === "loading"}>
          {profile ? (
            <div>
              <S.AdminProfileIdentity>
                <AdminProfileAvatar profile={profile} large/>
                <div>
                  <h2>{profile.name}님</h2>
                  <p>{profile.email}</p>
                </div>
              </S.AdminProfileIdentity>
              <S.AdminProfileDetails>
                {fields.map(({label, value}) => (
                  <S.AdminProfileField key={label}>
                    <dt>{label}</dt>
                    <dd>{value || "미설정"}</dd>
                  </S.AdminProfileField>
                ))}
              </S.AdminProfileDetails>
            </div>
          ) : (
            <S.AdminProfileEmpty role={status === "failed" ? "alert" : "status"}>
              {status === "failed" ? error || "관리자 로그인이 필요합니다." : "회원 정보를 불러오는 중입니다."}
              <S.AdminProfileActions>
                <S.AdminProfileLink href="/admin/login">관리자 로그인</S.AdminProfileLink>
                {status === "failed" && (
                  <S.AdminProfileRetry type="button" onClick={() => dispatch(fetchAdminProfile())}>
                    다시 불러오기
                  </S.AdminProfileRetry>
                )}
              </S.AdminProfileActions>
            </S.AdminProfileEmpty>
          )}
        </S.AdminProfileCard>
        <S.AdminProfileActions>
          <S.AdminProfileLink href="/admin">대시보드로 돌아가기</S.AdminProfileLink>
        </S.AdminProfileActions>
      </S.AdminProfilePage>
    </Layout>
  );
};
