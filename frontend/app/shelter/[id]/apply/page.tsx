"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { fetchShelterAnimals } from "../../../redux/shelterSlice";
import { genderLabel, toImageUrl, toMonthDay } from "../../animalFormat";
import { HousingType, fetchApplyPrefill, submitApplication, toApplicationError } from "../../adoptionApi";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

const housingOptions: {label: string; value: HousingType}[] = [
  {label: "아파트", value: "APARTMENT"},
  {label: "주택", value: "HOUSE"},
  {label: "기타", value: "OTHER"}
];

type Errors = Partial<Record<"name" | "phone" | "housing" | "experience" | "family" | "agree" | "submit", string>>;

// 로그인 여부 (localStorage의 token). 서버에서 그릴 때는 아직 모름(null)
const subscribeStorage = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};
const getHasToken = () => Boolean(localStorage.getItem("token"));
const getServerHasToken = () => null;

// 💡 입양 신청서 (/shelter/[id]/apply). 신청서는 운영팀이 받아 보호소에 전달
export default function AdoptionApplyPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams<{id: string}>();
  const animalId = Number(params.id);
  const hasToken = useSyncExternalStore(subscribeStorage, getHasToken, getServerHasToken);

  const {animals, loading} = useSelector((state: RootState) => state.shelter);
  const animal = animals.find((item) => item.id === animalId);

  const [form, setForm] = useState({name: "", phone: "", message: ""});
  const [housing, setHousing] = useState<HousingType | null>(null);
  const [experience, setExperience] = useState<boolean | null>(null);
  const [family, setFamily] = useState<boolean | null>(null);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (animals.length === 0) dispatch(fetchShelterAnimals());
  }, [dispatch, animals.length]);

  // 로그인한 회원의 이름·연락처를 미리 채움 (이미 적은 칸은 그대로)
  useEffect(() => {
    if (!hasToken) return;
    fetchApplyPrefill()
      .then(({name, phone}) => setForm((prev) => ({...prev, name: prev.name || name, phone: prev.phone || phone})))
      .catch(() => {});
  }, [hasToken]);

  const handleBack = () => (window.history.length > 1 ? router.back() : router.push(`/shelter/${animalId}`));

  const clearError = (key: keyof Errors) => setErrors((prev) => ({...prev, [key]: undefined, submit: undefined}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: Errors = {};
    if (!form.name.trim()) next.name = "이름을 적어 주세요.";
    if (!form.phone.trim()) next.phone = "연락처를 적어 주세요.";
    if (!housing) next.housing = "주거 형태를 골라 주세요.";
    if (experience === null) next.experience = "하나를 골라 주세요.";
    if (family === null) next.family = "하나를 골라 주세요.";
    if (!agree) next.agree = "신청서를 보호소에 전달하려면 동의가 필요해요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    };

    setSubmitting(true);
    try {
      await submitApplication({
        shelterAnimalId: animalId,
        applicantName: form.name.trim(),
        applicantPhone: form.phone.trim(),
        housingType: housing!,
        hasPetExperience: experience!,
        familyAgreed: family!,
        message: form.message.trim(),
        agreeToShare: agree
      });
      setDone(true);
      window.scrollTo(0, 0);
    } catch (error) {
      const message = toApplicationError(error, "신청하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setErrors({submit: message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요." : message});
    } finally {
      setSubmitting(false);
    };
  };

  const renderBody = () => {
    if (hasToken === false) {
      return (
        <S.WriteLoginNotice>
          <p>로그인하면 입양 신청서를<br/>보낼 수 있어요</p>
          <Link href="/login">로그인</Link>
        </S.WriteLoginNotice>
      );
    };

    if (!animal) {
      return <S.AdoptEmpty>{loading || animals.length === 0 ? "불러오는 중이에요" : "공고가 끝났거나 없는 친구예요"}</S.AdoptEmpty>;
    };

    if (animal.status === "COMPLETED") {
      return <S.AdoptEmpty>이미 입양이 끝난 친구예요</S.AdoptEmpty>;
    };

    if (done) {
      return (
        <S.ApplyDone>
          <S.ApplyDoneIcon aria-hidden="true"/>
          <h2>신청서를 보냈어요</h2>
          <p>운영팀이 확인한 뒤 보호소에 전달해요.<br/>보호소에서 적어 주신 연락처로 직접 연락드려요.</p>
          <S.ApplyDoneButtons>
            <S.ApplyButton as={Link} href="/mypage/applications" $primary>신청 내역 보기</S.ApplyButton>
            <S.ApplyButton as={Link} href="/shelter">다른 친구 보러 가기</S.ApplyButton>
          </S.ApplyDoneButtons>
        </S.ApplyDone>
      );
    };

    const imageUrl = toImageUrl(animal.imageUrl);

    return (
      <S.WriteForm onSubmit={handleSubmit} noValidate>
        <S.ApplyAnimal>
          {imageUrl ? <S.ApplyThumb src={imageUrl} alt=""/> : <S.ApplyThumbEmpty/>}
          <span>
            <strong>{animal.breed} · {genderLabel[animal.gender] ?? animal.gender} 아이에게 신청해요</strong>
            <small>{animal.rescueLocation} · 공고 {toMonthDay(animal.regDate)}</small>
          </span>
        </S.ApplyAnimal>

        <S.ApplyNotice>로그인한 계정 정보로 미리 채웠어요. 신청서는 운영팀이 보호소에 그대로 전달해요.</S.ApplyNotice>

        <S.WriteField>
          <S.WriteLabel htmlFor="apply-name">이름</S.WriteLabel>
          <S.WriteInput
          id="apply-name"
          autoComplete="name"
          value={form.name}
          $invalid={Boolean(errors.name)}
          aria-invalid={Boolean(errors.name)}
          onChange={(e) => {
            setForm((prev) => ({...prev, name: e.target.value}));
            clearError("name");
          }}/>
          {errors.name && <S.WriteError>{errors.name}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="apply-phone">연락처</S.WriteLabel>
          <S.WriteInput
          id="apply-phone"
          type="tel"
          autoComplete="tel"
          placeholder="010-0000-0000"
          value={form.phone}
          $invalid={Boolean(errors.phone)}
          aria-invalid={Boolean(errors.phone)}
          onChange={(e) => {
            setForm((prev) => ({...prev, phone: e.target.value}));
            clearError("phone");
          }}/>
          {errors.phone && <S.WriteError>{errors.phone}</S.WriteError>}
        </S.WriteField>

        <S.WriteField role="radiogroup" aria-labelledby="apply-housing-label">
          <S.WriteLabel as="span" id="apply-housing-label">주거 형태</S.WriteLabel>
          <S.ApplyChoiceGroup $columns={3}>
            {housingOptions.map((option) => (
              <S.WriteChoice
              key={option.value}
              type="button"
              role="radio"
              aria-checked={housing === option.value}
              $checked={housing === option.value}
              onClick={() => {
                setHousing(option.value);
                clearError("housing");
              }}>
                {option.label}
              </S.WriteChoice>
            ))}
          </S.ApplyChoiceGroup>
          {errors.housing && <S.WriteError>{errors.housing}</S.WriteError>}
        </S.WriteField>

        <S.WriteField role="radiogroup" aria-labelledby="apply-exp-label">
          <S.WriteLabel as="span" id="apply-exp-label">반려동물을 키워 본 적이 있나요?</S.WriteLabel>
          <S.ApplyChoiceGroup $columns={2}>
            {[{label: "있어요", value: true}, {label: "처음이에요", value: false}].map((option) => (
              <S.WriteChoice
              key={option.label}
              type="button"
              role="radio"
              aria-checked={experience === option.value}
              $checked={experience === option.value}
              onClick={() => {
                setExperience(option.value);
                clearError("experience");
              }}>
                {option.label}
              </S.WriteChoice>
            ))}
          </S.ApplyChoiceGroup>
          {errors.experience && <S.WriteError>{errors.experience}</S.WriteError>}
        </S.WriteField>

        <S.WriteField role="radiogroup" aria-labelledby="apply-family-label">
          <S.WriteLabel as="span" id="apply-family-label">함께 사는 가족 모두 입양에 동의했나요?</S.WriteLabel>
          <S.ApplyChoiceGroup $columns={2}>
            {[{label: "네", value: true}, {label: "아직이요", value: false}].map((option) => (
              <S.WriteChoice
              key={option.label}
              type="button"
              role="radio"
              aria-checked={family === option.value}
              $checked={family === option.value}
              onClick={() => {
                setFamily(option.value);
                clearError("family");
              }}>
                {option.label}
              </S.WriteChoice>
            ))}
          </S.ApplyChoiceGroup>
          {errors.family && <S.WriteError>{errors.family}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="apply-note">보호소에 전하고 싶은 말 <span>(선택)</span></S.WriteLabel>
          <S.WriteTextArea
          id="apply-note"
          rows={4}
          placeholder="입양을 결심한 이유나 궁금한 점을 적어 주세요"
          value={form.message}
          onChange={(e) => setForm((prev) => ({...prev, message: e.target.value}))}/>
        </S.WriteField>

        <S.WriteField>
          <S.ApplyAgree>
            <input
            type="checkbox"
            checked={agree}
            onChange={(e) => {
              setAgree(e.target.checked);
              clearError("agree");
            }}/>
            신청서 내용을 보호소에 전달하는 데 동의해요 (필수)
          </S.ApplyAgree>
          {errors.agree && <S.WriteError>{errors.agree}</S.WriteError>}
        </S.WriteField>

        <S.WriteBar>
          {errors.submit ? <S.WriteError as="p">{errors.submit}</S.WriteError> : <p>보호소에서 적어 주신 연락처로 직접 연락드려요.</p>}
          <S.WriteSubmit type="submit" disabled={submitting}>{submitting ? "보내는 중..." : "신청하기"}</S.WriteSubmit>
        </S.WriteBar>
      </S.WriteForm>
    );
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="입양 신청" onBackClick={handleBack}/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>
    </S.AppWrapper>
  );
};
