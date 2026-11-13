"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DaumPostcodeEmbed, { Address } from "react-daum-postcode";
import { MyAccount, fetchMyAccount, toAccountError, updateMyAccount, uploadProfileImage } from "../../accountApi";
import { compressImage } from "../../../missing/compressImage";
import { toImageUrl } from "../../../shelter/animalFormat";
import { showToast } from "../../../components/Toast";
import { loginHref } from "../../../components/loginLink";

import Header from "@/app/components/Header";
import * as S from "@/assets/css/Style.styles";

type Errors = Partial<Record<"nickname" | "name" | "phone" | "submit", string>>;

// 💡 마이 > 설정 > 정보 수정: 사진, 닉네임, 이름, 휴대폰, 주소 (이메일은 바꿀 수 없음)
export default function ProfileEditPage() {
  const router = useRouter();
  const [account, setAccount] = useState<MyAccount | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "error">("loading");
  const [form, setForm] = useState({nickname: "", name: "", phone: "", address: ""});
  const [checkedNickname, setCheckedNickname] = useState(""); // 중복 확인을 통과한 새 닉네임
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      const timer = setTimeout(() => setStatus("login"), 0);
      return () => clearTimeout(timer);
    };
    fetchMyAccount()
      .then((me) => {
        setAccount(me);
        setForm({nickname: me.nickname ?? "", name: me.name ?? "", phone: me.phone ?? "", address: me.address ?? ""});
        setStatus("ready");
      })
      .catch((error) => setStatus(toAccountError(error, "") === "UNAUTHORIZED" ? "login" : "error"));
  }, []);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({...prev, [field]: value}));
    setErrors((prev) => ({...prev, [field]: undefined, submit: undefined}));
  };

  const nicknameChanged = account !== null && form.nickname.trim() !== account.nickname;
  const nicknameOk = !nicknameChanged || checkedNickname === form.nickname.trim();

  const handleCheckNickname = async () => {
    const value = form.nickname.trim();
    if (!value) {
      setErrors((prev) => ({...prev, nickname: "닉네임을 적어 주세요."}));
      return;
    };
    try {
      const res = await fetch(`/api/members/check-nickname?nickname=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error();
      if (await res.json()) {
        setErrors((prev) => ({...prev, nickname: "이미 누군가 쓰고 있는 닉네임이에요."}));
      } else {
        setCheckedNickname(value);
      };
    } catch {
      setErrors((prev) => ({...prev, nickname: "확인하지 못했어요. 잠시 후 다시 시도해 주세요."}));
    };
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setPhotoRemoved(false);
  };

  const handleAddress = (data: Address) => {
    setField("address", data.address + (data.buildingName ? ` (${data.buildingName})` : ""));
    setPostcodeOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.nickname.trim()) next.nickname = "닉네임을 적어 주세요.";
    else if (!nicknameOk) next.nickname = "닉네임 중복 확인을 눌러 주세요.";
    if (!form.name.trim()) next.name = "이름을 적어 주세요.";
    if (!/^\d{9,11}$/.test(form.phone.replace(/-/g, ""))) next.phone = "휴대폰 번호를 숫자로 적어 주세요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    };

    setSaving(true);
    try {
      let profileImageUrl: string | null = null; // 그대로
      if (photoFile) profileImageUrl = await uploadProfileImage(await compressImage(photoFile));
      else if (photoRemoved) profileImageUrl = "";

      const saved = await updateMyAccount({
        nickname: form.nickname.trim(),
        name: form.name.trim(),
        phone: form.phone.replace(/-/g, ""),
        address: form.address.trim(),
        profileImageUrl
      });
      localStorage.setItem("nickname", saved.nickname); // 마이·인사 토스트에 바로 반영
      showToast("저장했어요");
      // replace로 설정 화면을 하나 더 쌓으면 뒤로가기를 두 번 눌러야 해서, 왔던 설정 화면으로 돌아감
      if (window.history.length > 1) router.back();
      else router.replace("/mypage/settings");
    } catch (error) {
      const message = toAccountError(error, "저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setErrors({submit: message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요." : message});
      setSaving(false);
    };
  };

  const renderBody = () => {
    if (status === "loading") return <S.AdoptEmpty>불러오는 중이에요</S.AdoptEmpty>;
    if (status === "login") {
      return (
        <S.WriteLoginNotice>
          <p>로그인하면 내 정보를<br/>고칠 수 있어요</p>
          <Link href={loginHref("/mypage/settings/profile")}>로그인</Link>
        </S.WriteLoginNotice>
      );
    };
    if (status === "error" || !account) return <S.AdoptEmpty>정보를 불러오지 못했어요</S.AdoptEmpty>;

    const photo = photoPreview ?? (photoRemoved ? null : toImageUrl(account.profileImageUrl) ?? null);

    return (
      <S.WriteForm onSubmit={handleSubmit} noValidate>
        <S.SignupAvatar>
          <S.SignupAvatarButton aria-label="프로필 사진 고르기">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {photo ? <img src={photo} alt="프로필 사진"/> : <S.SignupAvatarIcon aria-hidden="true"/>}
            <S.SignupAvatarBadge aria-hidden="true"><S.SignupCameraIcon/></S.SignupAvatarBadge>
            <input type="file" accept="image/*" onChange={handlePhoto}/>
          </S.SignupAvatarButton>
          {photo ? (
            <S.SignupAvatarRemove
            type="button"
            onClick={() => {
              setPhotoFile(null);
              setPhotoPreview(null);
              setPhotoRemoved(true);
            }}>
              사진 빼기
            </S.SignupAvatarRemove>
          ) : (
            <span>사진 (선택)</span>
          )}
        </S.SignupAvatar>

        <S.WriteField>
          <S.WriteLabel as="span">{account.provider === "KAKAO" ? "계정" : "이메일"}</S.WriteLabel>
          <S.SignupHint>{account.provider === "KAKAO" ? "카카오 계정으로 가입했어요" : `${account.email} (바꿀 수 없어요)`}</S.SignupHint>
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="pe-nickname">닉네임</S.WriteLabel>
          <S.SignupInputRow>
            <S.WriteInput
            id="pe-nickname"
            value={form.nickname}
            $invalid={Boolean(errors.nickname)}
            aria-invalid={Boolean(errors.nickname)}
            onChange={(e) => setField("nickname", e.target.value)}/>
            {nicknameChanged && (
              <S.SignupSideButton type="button" $done={nicknameOk} onClick={handleCheckNickname}>
                {nicknameOk ? "확인됨" : "중복 확인"}
              </S.SignupSideButton>
            )}
          </S.SignupInputRow>
          {errors.nickname
            ? <S.WriteError>{errors.nickname}</S.WriteError>
            : nicknameChanged && nicknameOk && <S.SignupHint $ok>사용할 수 있는 닉네임이에요.</S.SignupHint>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="pe-name">이름 (실명)</S.WriteLabel>
          <S.WriteInput
          id="pe-name"
          autoComplete="name"
          value={form.name}
          $invalid={Boolean(errors.name)}
          aria-invalid={Boolean(errors.name)}
          onChange={(e) => setField("name", e.target.value)}/>
          {errors.name && <S.WriteError>{errors.name}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="pe-phone">휴대폰 번호</S.WriteLabel>
          <S.WriteInput
          id="pe-phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={form.phone}
          $invalid={Boolean(errors.phone)}
          aria-invalid={Boolean(errors.phone)}
          onChange={(e) => setField("phone", e.target.value)}/>
          {errors.phone && <S.WriteError>{errors.phone}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="pe-address">주소 <span>(선택)</span></S.WriteLabel>
          <S.SignupInputRow>
            <S.WriteInput id="pe-address" value={form.address} onChange={(e) => setField("address", e.target.value)}/>
            <S.SignupSideButton type="button" onClick={() => setPostcodeOpen(true)}>검색</S.SignupSideButton>
          </S.SignupInputRow>
        </S.WriteField>

        <S.WriteBar>
          {errors.submit && <S.WriteError as="p">{errors.submit}</S.WriteError>}
          <S.WriteSubmit type="submit" disabled={saving}>{saving ? "저장하는 중..." : "저장하기"}</S.WriteSubmit>
        </S.WriteBar>
      </S.WriteForm>
    );
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="정보 수정"/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>

      {postcodeOpen && (
        <S.SignupPostcode role="dialog" aria-modal="true" aria-label="주소 검색">
          <S.SignupPostcodeSheet>
            <S.SignupPostcodeHead>
              주소 검색
              <button type="button" aria-label="닫기" onClick={() => setPostcodeOpen(false)}><S.SignupCloseIcon/></button>
            </S.SignupPostcodeHead>
            <DaumPostcodeEmbed onComplete={handleAddress}/>
          </S.SignupPostcodeSheet>
        </S.SignupPostcode>
      )}
    </S.AppWrapper>
  );
};
