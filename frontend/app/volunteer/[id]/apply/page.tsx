"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { VolunteerPost, applyVolunteer, dateParts, fetchVolunteer, formatVolunteerWhen, toVolunteerError } from "../../volunteerApi";
import { fetchApplyPrefill } from "../../../shelter/adoptionApi";

import Header from "@/app/components/Header";
import { loginHref } from "@/app/components/loginLink";
import * as S from "@/assets/css/Style.styles";

type Errors = Partial<Record<"name" | "phone" | "submit", string>>;

// 💡 봉사 신청 (/volunteer/[id]/apply). 이름·연락처는 회원 정보로 미리 채움
export default function VolunteerApplyPage() {
  const router = useRouter();
  const params = useParams<{id: string}>();
  const id = Number(params.id);

  const [post, setPost] = useState<VolunteerPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "login" | "missing">("loading");
  const [form, setForm] = useState({name: "", phone: "", message: ""});
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!localStorage.getItem("token")) {
        setStatus("login");
        return;
      };
      try {
        const data = await fetchVolunteer(id);
        if (!alive) return;
        setPost(data);
        setStatus("ready");
        const prefill = await fetchApplyPrefill().catch(() => null);
        if (alive && prefill) setForm((prev) => ({...prev, name: prev.name || prefill.name, phone: prev.phone || prefill.phone}));
      } catch {
        if (alive) setStatus("missing");
      };
    };
    const timer = setTimeout(load, 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [id]);

  const handleBack = () => (window.history.length > 1 ? router.back() : router.push(`/volunteer/${id}`));

  const setField = (key: "name" | "phone" | "message", value: string) => {
    setForm((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key]: undefined, submit: undefined}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!form.name.trim()) next.name = "이름을 적어 주세요.";
    if (!/^\d{9,11}$/.test(form.phone.replace(/[^0-9]/g, ""))) next.phone = "연락처를 숫자로 적어 주세요.";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    };

    setSubmitting(true);
    try {
      await applyVolunteer(id, {applicantName: form.name.trim(), applicantPhone: form.phone.trim(), message: form.message.trim()});
      setDone(true);
      window.scrollTo(0, 0);
    } catch (error) {
      const message = toVolunteerError(error, "신청하지 못했어요. 잠시 후 다시 시도해 주세요.");
      setErrors({submit: message === "UNAUTHORIZED" ? "로그인이 끝났어요. 다시 로그인해 주세요." : message});
    } finally {
      setSubmitting(false);
    };
  };

  const renderBody = () => {
    if (status === "login") {
      return (
        <S.WriteLoginNotice>
          <p>로그인하면 봉사를<br/>신청할 수 있어요</p>
          <Link href={loginHref(`/volunteer/${id}/apply`)}>로그인</Link>
        </S.WriteLoginNotice>
      );
    };
    if (status === "loading") return <S.AdoptEmpty>불러오는 중이에요</S.AdoptEmpty>;
    if (!post) return <S.AdoptEmpty>삭제됐거나 없는 봉사예요</S.AdoptEmpty>;

    if (done) {
      return (
        <S.ApplyDone>
          <S.ApplyDoneIcon aria-hidden="true"/>
          <h2>신청이 확정됐어요</h2>
          <p>{formatVolunteerWhen(post)}<br/>{post.place}에서 만나요.</p>
          <S.ApplyDoneButtons>
            <S.ApplyButton as={Link} href="/mypage/volunteers" $primary>신청 내역 보기</S.ApplyButton>
            <S.ApplyButton as={Link} href="/shelter">다른 봉사 보러 가기</S.ApplyButton>
          </S.ApplyDoneButtons>
        </S.ApplyDone>
      );
    };

    if (post.myApplicationId) return <S.AdoptEmpty>이미 신청한 봉사예요. <Link href="/mypage/volunteers">신청 내역 보기</Link></S.AdoptEmpty>;
    if (post.state !== "OPEN") return <S.AdoptEmpty>{post.state === "FULL" ? "아쉽지만 정원이 다 찼어요" : "모집이 끝난 봉사예요"}</S.AdoptEmpty>;

    const {month, day, weekday} = dateParts(post.activityDate);

    return (
      <S.WriteForm onSubmit={handleSubmit} noValidate>
        <S.ApplyAnimal>
          <S.VolunteerDate aria-hidden="true">
            <small>{month}</small>
            <strong>{day}</strong>
            <small>{weekday}</small>
          </S.VolunteerDate>
          <span>
            <strong>{post.title}</strong>
            <small>{post.startTime}~{post.endTime} · {post.place}</small>
          </span>
        </S.ApplyAnimal>

        <S.ApplyNotice>로그인한 계정 정보로 미리 채웠어요. 보호소에 이 이름과 연락처로 전달해요.</S.ApplyNotice>

        <S.WriteField>
          <S.WriteLabel htmlFor="vol-name">이름</S.WriteLabel>
          <S.WriteInput
          id="vol-name"
          autoComplete="name"
          value={form.name}
          $invalid={Boolean(errors.name)}
          aria-invalid={Boolean(errors.name)}
          onChange={(e) => setField("name", e.target.value)}/>
          {errors.name && <S.WriteError>{errors.name}</S.WriteError>}
        </S.WriteField>

        <S.WriteField>
          <S.WriteLabel htmlFor="vol-phone">연락처</S.WriteLabel>
          <S.WriteInput
          id="vol-phone"
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

        <S.WriteField>
          <S.WriteLabel htmlFor="vol-note">보호소에 전하고 싶은 말 <span>(선택)</span></S.WriteLabel>
          <S.WriteTextArea
          id="vol-note"
          rows={3}
          maxLength={500}
          placeholder="봉사 경험이나 궁금한 점을 적어 주세요"
          value={form.message}
          onChange={(e) => setField("message", e.target.value)}/>
        </S.WriteField>

        <S.WriteBar>
          {errors.submit ? <S.WriteError as="p">{errors.submit}</S.WriteError> : <p>선착순이라 신청하면 바로 확정돼요.</p>}
          <S.WriteSubmit type="submit" disabled={submitting}>{submitting ? "신청하는 중..." : "신청하기"}</S.WriteSubmit>
        </S.WriteBar>
      </S.WriteForm>
    );
  };

  return (
    <S.AppWrapper>
      <S.Container>
        <Header title="봉사 신청" onBackClick={handleBack}/>
        <S.HeaderOffset/>
        {renderBody()}
      </S.Container>
    </S.AppWrapper>
  );
};
