"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setStep, updateFormField, setAllAgreed, submitSignup } from "../redux/signupSlice";

import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import {
  CampaignOutlined as SpeakerIcon,
  FavoriteBorderRounded as HeartIcon,
  DescriptionOutlined as FormIcon
} from "@mui/icons-material";
import Header from "../components/Header";
import { CustomAlert } from "../components/CustomAlert";
import { SIGNUP_EMAIL_KEY } from "../components/loginLink";
import { queueToast } from "../components/Toast";
import * as S from "@/assets/css/Style.styles";

type FormField = keyof RootState["signup"]["formData"];
type ErrorKey = "email" | "nickname" | "password" | "passwordConfirm" | "name" | "phone";

// 입력하면 그 칸의 오류 문구를 지움
const errorsKeys: Record<ErrorKey, true> = {email: true, nickname: true, password: true, passwordConfirm: true, name: true, phone: true};


// 💡 약관 (필수 3개 + 선택 1개). 본문은 아직 임시 문구
const agreements: {field: FormField; label: string; text?: string}[] = [
  {field: "agreeTerms", label: "이용약관 (필수)", text: "제 1조 (목적) ..."},
  {field: "agreePrivacy", label: "개인정보 수집·이용 (필수)", text: "수집 항목: 이메일..."},
  {field: "agreeAge", label: "만 14세 이상이에요 (필수)"},
  {field: "marketingAgreed", label: "마케팅 정보 메일·문자 수신 (선택)"}
];

// 로고와 같은 강아지 얼굴 (흰 배경에서도 보이게 얼굴 테두리)
const DogMark = () => (
  <svg width="64" height="64" viewBox="0 0 36 36" aria-hidden="true">
    <ellipse cx="18" cy="18" rx="14" ry="13" fill="#fff" stroke="#c17f4a" strokeWidth="1.5"/>
    <ellipse cx="8" cy="14" rx="6.5" ry="11" transform="rotate(-25 8 14)" fill="#c17f4a"/>
    <ellipse cx="28" cy="14" rx="6.5" ry="11" transform="rotate(25 28 14)" fill="#c17f4a"/>
    <ellipse cx="14" cy="16" rx="1.5" ry="2.2" fill="#2c2522"/>
    <ellipse cx="22" cy="16" rx="1.5" ry="2.2" fill="#2c2522"/>
    <ellipse cx="18" cy="20" rx="3" ry="2" fill="#2c2522"/>
    <circle cx="12.5" cy="31" r="5.5" fill="#fff" stroke="#c17f4a" strokeWidth="1.5"/>
    <circle cx="23.5" cy="31" r="5.5" fill="#fff" stroke="#c17f4a" strokeWidth="1.5"/>
  </svg>
);

// 네모 체크 (진짜 checkbox + 모양)
const Check = ({checked, onChange, label}: {checked: boolean; onChange: (checked: boolean) => void; label?: string}) => (
  <S.SignupCheck>
    <input type="checkbox" checked={checked} aria-label={label} onChange={(e) => onChange(e.target.checked)}/>
    <i><S.SignupCheckIcon/></i>
  </S.SignupCheck>
);

// ==========================================
// 💡 회원가입: 0 시작 → 1 약관 동의 → 2 정보 입력 → 3 프로필
// ==========================================
export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const {step, formData, isLoading} = useSelector((state: RootState) => state.signup);

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isOpenPostcode, setIsOpenPostcode] = useState(false);
  const [openTerms, setOpenTerms] = useState<FormField | null>(null);
  const [agreeError, setAgreeError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  // 중복 확인을 통과한 값 (값을 바꾸면 다시 확인해야 함)
  const [checked, setChecked] = useState<{email: string; nickname: string}>({email: "", nickname: ""});

  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    message: "",
    type: "info" as "success" | "error" | "info",
    onConfirm: () => {}
  });

  const closeAlert = () => setAlertConfig((prev) => ({...prev, isOpen: false}));
  const showAlert = (message: string, type: "success" | "error" | "info" = "info", customConfirm?: () => void) => {
    setAlertConfig({isOpen: true, message, type, onConfirm: customConfirm || closeAlert});
  };

  // 단계가 바뀌면 화면 맨 위로
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // 미리보기 주소 정리
  useEffect(() => () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  }, [profilePreview]);

  const setField = (field: FormField, value: string | boolean) => {
    dispatch(updateFormField({field, value}));
    if (field in errorsKeys) setErrors((prev) => ({...prev, [field]: undefined}));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleCompletePostcode = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";
    if (data.addressType === "R") {
      if (data.bname !== "") extraAddress += data.bname;
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      };
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    };
    dispatch(updateFormField({field: "address", value: fullAddress}));
    setIsOpenPostcode(false);
  };

  const isAllAgreed = formData.agreeTerms && formData.agreePrivacy && formData.agreeAge && formData.marketingAgreed;

  const handleKakaoSignup = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  const goNextFromAgree = () => {
    if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreeAge) {
      setAgreeError("필수 약관에 모두 동의해 주세요.");
      return;
    };
    dispatch(setStep(2));
  };

  // 중복 확인 (이메일 / 닉네임)
  const handleCheck = async (kind: "email" | "nickname") => {
    const value = formData[kind].trim();
    if (!value) {
      setErrors((prev) => ({...prev, [kind]: kind === "email" ? "이메일을 먼저 적어 주세요." : "닉네임을 먼저 적어 주세요."}));
      return;
    };
    if (kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({...prev, email: "이메일 형식을 확인해 주세요."}));
      return;
    };
    try {
      const res = await fetch(`/api/members/check-${kind}?${kind}=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error();
      if (await res.json()) {
        setErrors((prev) => ({...prev, [kind]: kind === "email" ? "이미 가입된 이메일이에요." : "이미 누군가 쓰고 있는 닉네임이에요."}));
      } else {
        setChecked((prev) => ({...prev, [kind]: value}));
        setErrors((prev) => ({...prev, [kind]: undefined}));
      };
    } catch {
      showAlert("서버와 연결하지 못했어요. 잠시 후 다시 시도해 주세요.", "error");
    };
  };

  // 2/3 정보 입력 → 3/3 프로필
  const handleNextFromInfo = (e: React.FormEvent) => {
    e.preventDefault();

    const next: Partial<Record<ErrorKey, string>> = {};
    const email = formData.email.trim();
    if (!email) next.email = "이메일을 적어 주세요.";
    else if (checked.email !== email) next.email = "이메일 중복 확인을 눌러 주세요.";
    if (formData.password.length < 8) next.password = "비밀번호는 8자 이상이어야 해요.";
    if (formData.password !== formData.passwordConfirm) next.passwordConfirm = "비밀번호가 서로 달라요.";
    if (!formData.name.trim()) next.name = "이름을 적어 주세요.";
    if (!/^\d{9,11}$/.test(formData.phone.replace(/-/g, ""))) next.phone = "휴대폰 번호를 숫자로 적어 주세요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    };
    dispatch(setStep(3));
  };

  // 3/3 프로필 → 가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nickname = formData.nickname.trim();
    if (!nickname || checked.nickname !== nickname) {
      setErrors({nickname: nickname ? "닉네임 중복 확인을 눌러 주세요." : "닉네임을 적어 주세요."});
      return;
    };

    const resultAction = await dispatch(submitSignup({
      formData: {...formData, email: formData.email.trim(), nickname, phone: formData.phone.replace(/-/g, "")},
      profileFile
    }));
    if (submitSignup.fulfilled.match(resultAction)) {
      // 모달 없이 로그인 화면으로. 로그인 화면에서 "가입이 끝났어요" 토스트 + 이메일 채움
      queueToast("가입이 끝났어요. 로그인해 주세요");
      try {
        sessionStorage.setItem(SIGNUP_EMAIL_KEY, formData.email.trim());
      } catch {
        // 저장이 막힌 브라우저에서는 배너 없이 이동
      };
      dispatch(setStep(0));
      router.replace("/login");
    } else {
      showAlert(`가입하지 못했어요. ${resultAction.payload ?? ""}`, "error");
    };
  };

  // 시작 화면은 닫기(X), 약관·정보 입력·프로필은 이전 단계로(<)
  const header = step === 0
    ? <Header title="회원가입" isModal/>
    : <Header title="회원가입" onBackClick={() => dispatch(setStep(step - 1))}/>;

  return (
    <S.AppWrapper>
      <S.Container>
        {header}
        <S.HeaderOffset/>

        {/* 0. 시작 */}
        {step === 0 && (
          <>
            <S.SignupIntro>
              <DogMark/>
              <S.SignupTitle as="h2">잃어버린 아이와<br/>새 가족을 이어 줘요</S.SignupTitle>
              <S.SignupIntroList>
                <li><SpeakerIcon aria-hidden="true"/>실종 신고와 목격 제보</li>
                <li><FormIcon aria-hidden="true"/>입양·봉사 신청과 진행 상황 확인</li>
                <li><HeartIcon aria-hidden="true"/>커뮤니티에 이야기 나누기</li>
              </S.SignupIntroList>
            </S.SignupIntro>

            <S.SignupBottom>
              <S.SignupButton type="button" $variant="kakao" onClick={handleKakaoSignup}>카카오로 시작하기</S.SignupButton>
              <S.SignupButton type="button" onClick={() => dispatch(setStep(1))}>이메일로 가입하기</S.SignupButton>
              <S.SignupLoginLink>이미 계정이 있나요? <Link href="/login">로그인</Link></S.SignupLoginLink>
            </S.SignupBottom>
          </>
        )}

        {/* 1. 약관 동의 */}
        {step === 1 && (
          <S.SignupBody>
            <S.SignupStep><b>1</b> / 3 약관 동의</S.SignupStep>
            <S.SignupProgress $percent={33}/>
            <S.SignupTitle>서비스 이용 약관에<br/>동의해 주세요</S.SignupTitle>

            <S.SignupAgreeAll>
              <Check
              checked={isAllAgreed}
              label="모두 동의해요"
              onChange={(value) => {
                dispatch(setAllAgreed(value));
                setAgreeError("");
              }}/>
              모두 동의해요
            </S.SignupAgreeAll>

            <S.SignupAgreeList>
              {agreements.map(({field, label, text}) => (
                <S.SignupAgreeItem key={field}>
                  <S.SignupAgreeRow>
                    <label>
                      <Check
                      checked={Boolean(formData[field])}
                      onChange={(value) => {
                        setField(field, value);
                        setAgreeError("");
                      }}/>
                      {label}
                    </label>
                    {text && (
                      <S.SignupViewButton
                      type="button"
                      aria-expanded={openTerms === field}
                      onClick={() => setOpenTerms(openTerms === field ? null : field)}>
                        {openTerms === field ? "닫기" : "보기 ›"}
                      </S.SignupViewButton>
                    )}
                  </S.SignupAgreeRow>
                  {text && openTerms === field && <S.SignupTermsText>{text}</S.SignupTermsText>}
                </S.SignupAgreeItem>
              ))}
            </S.SignupAgreeList>

            <S.WriteBar>
              {agreeError && <S.WriteError as="p">{agreeError}</S.WriteError>}
              <S.WriteSubmit type="button" onClick={goNextFromAgree}>다음</S.WriteSubmit>
            </S.WriteBar>
          </S.SignupBody>
        )}

        {/* 2. 정보 입력 (계정 + 연락처) */}
        {step === 2 && (
          <S.SignupBody as="form" onSubmit={handleNextFromInfo} noValidate>
            <S.SignupStep><b>2</b> / 3 정보 입력</S.SignupStep>
            <S.SignupProgress $percent={67}/>

            <S.WriteField>
              <S.WriteLabel as="span" id="signup-type-title">가입 유형</S.WriteLabel>
              <S.ApplyChoiceGroup $columns={2} role="radiogroup" aria-labelledby="signup-type-title">
              {[{label: "일반 회원", value: "GENERAL"}, {label: "업체 (보호소·병원 등)", value: "BUSINESS"}].map((option) => (
                <S.WriteChoice
                key={option.value}
                type="button"
                role="radio"
                aria-checked={formData.userType === option.value}
                $checked={formData.userType === option.value}
                onClick={() => setField("userType", option.value)}>
                  {option.label}
                </S.WriteChoice>
              ))}
              </S.ApplyChoiceGroup>
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-email">이메일</S.WriteLabel>
              <S.SignupInputRow>
                <S.WriteInput
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={formData.email}
                $invalid={Boolean(errors.email)}
                aria-invalid={Boolean(errors.email)}
                onChange={(e) => setField("email", e.target.value)}/>
                <S.SignupSideButton type="button" $done={checked.email !== "" && checked.email === formData.email.trim()} onClick={() => handleCheck("email")}>
                  {checked.email !== "" && checked.email === formData.email.trim() ? "확인됨" : "중복 확인"}
                </S.SignupSideButton>
              </S.SignupInputRow>
              {errors.email
                ? <S.WriteError>{errors.email}</S.WriteError>
                : checked.email !== "" && checked.email === formData.email.trim() && <S.SignupHint $ok>사용할 수 있는 이메일이에요.</S.SignupHint>}
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-password">비밀번호</S.WriteLabel>
              <S.WriteInput
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              value={formData.password}
              $invalid={Boolean(errors.password)}
              aria-invalid={Boolean(errors.password)}
              onChange={(e) => setField("password", e.target.value)}/>
              {errors.password && <S.WriteError>{errors.password}</S.WriteError>}
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-password-confirm">비밀번호 확인</S.WriteLabel>
              <S.WriteInput
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="한 번 더 입력"
              value={formData.passwordConfirm}
              $invalid={Boolean(errors.passwordConfirm)}
              aria-invalid={Boolean(errors.passwordConfirm)}
              onChange={(e) => setField("passwordConfirm", e.target.value)}/>
              {errors.passwordConfirm && <S.WriteError>{errors.passwordConfirm}</S.WriteError>}
            </S.WriteField>

            <S.SignupGroupHint>아래 정보는 입양 신청서에 미리 채워져요</S.SignupGroupHint>
            <S.WriteField>
              <S.WriteLabel htmlFor="signup-name">이름 (실명)</S.WriteLabel>
              <S.WriteInput
              id="signup-name"
              autoComplete="name"
              placeholder="홍길동"
              value={formData.name}
              $invalid={Boolean(errors.name)}
              aria-invalid={Boolean(errors.name)}
              onChange={(e) => setField("name", e.target.value)}/>
              {errors.name && <S.WriteError>{errors.name}</S.WriteError>}
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-phone">휴대폰 번호</S.WriteLabel>
              <S.WriteInput
              id="signup-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01012345678"
              value={formData.phone}
              $invalid={Boolean(errors.phone)}
              aria-invalid={Boolean(errors.phone)}
              onChange={(e) => setField("phone", e.target.value)}/>
              {errors.phone && <S.WriteError>{errors.phone}</S.WriteError>}
            </S.WriteField>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-address">주소 <span>(선택)</span></S.WriteLabel>
              <S.SignupInputRow>
                <S.WriteInput
                id="signup-address"
                placeholder="주소 검색"
                value={formData.address}
                readOnly
                onClick={() => setIsOpenPostcode(true)}/>
                <S.SignupSideButton type="button" onClick={() => setIsOpenPostcode(true)}>검색</S.SignupSideButton>
              </S.SignupInputRow>
              <S.WriteInput
              aria-label="상세 주소"
              placeholder="상세 주소"
              value={formData.detailAddress}
              onChange={(e) => setField("detailAddress", e.target.value)}/>
            </S.WriteField>

            <S.WriteBar>
              <S.WriteSubmit type="submit">다음</S.WriteSubmit>
            </S.WriteBar>
          </S.SignupBody>
        )}

        {/* 3. 프로필 (사진 + 닉네임). 다른 회원에게 보이는 정보라 따로 받음 */}
        {step === 3 && (
          <S.SignupBody as="form" onSubmit={handleSubmit} noValidate>
            <S.SignupStep><b>3</b> / 3 프로필</S.SignupStep>
            <S.SignupProgress $percent={100}/>
            <S.SignupTitle>다른 회원에게 보일<br/>프로필을 만들어 주세요</S.SignupTitle>

            <S.SignupAvatar>
              <S.SignupAvatarButton aria-label="프로필 사진 고르기">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {profilePreview ? <img src={profilePreview} alt="고른 프로필 사진"/> : <S.SignupAvatarIcon aria-hidden="true"/>}
                <S.SignupAvatarBadge aria-hidden="true"><S.SignupCameraIcon/></S.SignupAvatarBadge>
                <input type="file" accept="image/*" onChange={handleImageChange}/>
              </S.SignupAvatarButton>
              {profilePreview ? (
                <S.SignupAvatarRemove
                type="button"
                onClick={() => {
                  setProfileFile(null);
                  setProfilePreview(null);
                }}>
                  사진 빼기
                </S.SignupAvatarRemove>
              ) : (
                <span>사진 (선택)</span>
              )}
            </S.SignupAvatar>

            <S.WriteField>
              <S.WriteLabel htmlFor="signup-nickname">닉네임</S.WriteLabel>
              <S.SignupInputRow>
                <S.WriteInput
                id="signup-nickname"
                placeholder="예: 보리아빠"
                value={formData.nickname}
                $invalid={Boolean(errors.nickname)}
                aria-invalid={Boolean(errors.nickname)}
                onChange={(e) => setField("nickname", e.target.value)}/>
                <S.SignupSideButton type="button" $done={checked.nickname !== "" && checked.nickname === formData.nickname.trim()} onClick={() => handleCheck("nickname")}>
                  {checked.nickname !== "" && checked.nickname === formData.nickname.trim() ? "확인됨" : "중복 확인"}
                </S.SignupSideButton>
              </S.SignupInputRow>
              {errors.nickname
                ? <S.WriteError>{errors.nickname}</S.WriteError>
                : checked.nickname !== "" && checked.nickname === formData.nickname.trim() && <S.SignupHint $ok>사용할 수 있는 닉네임이에요.</S.SignupHint>}
            </S.WriteField>

            <S.WriteBar>
              <S.WriteSubmit type="submit" disabled={isLoading}>{isLoading ? "가입하는 중..." : "가입 완료"}</S.WriteSubmit>
            </S.WriteBar>
          </S.SignupBody>
        )}
      </S.Container>

      {isOpenPostcode && (
        <S.SignupPostcode role="dialog" aria-modal="true" aria-label="주소 검색">
          <S.SignupPostcodeSheet>
            <S.SignupPostcodeHead>
              주소 검색
              <button type="button" aria-label="닫기" onClick={() => setIsOpenPostcode(false)}><S.SignupCloseIcon/></button>
            </S.SignupPostcodeHead>
            <DaumPostcodeEmbed onComplete={handleCompletePostcode}/>
          </S.SignupPostcodeSheet>
        </S.SignupPostcode>
      )}

      <CustomAlert
      isOpen={alertConfig.isOpen}
      message={alertConfig.message}
      type={alertConfig.type}
      onConfirm={alertConfig.onConfirm}/>
    </S.AppWrapper>
  );
};

