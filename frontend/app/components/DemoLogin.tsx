"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loadUserFromStorage } from "../redux/userSlice";
import { apiUrl } from "@/lib/deploymentPath";
import ActionSheet from "./ActionSheet";
import { queueToast, showToast } from "./Toast";

const HOLD_MS = 800; // 이만큼 누르고 있으면 시연 계정 고르기

// 💡 시연 계정으로 들어가기: 홈 로고를 길게 누르면 (발표·시연 때 회원가입 없이 바로 둘러보기)
//    보호자(콩이찾는중): 실종 글·전단지·목격자와의 채팅·알림 / 목격자(사직동주민): 목격 글·채팅·입양·봉사 신청 내역
//    서버가 데모 데이터를 켠 경우에만 동작 (아니면 "쓸 수 없어요")
export function useDemoLogin() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);
  const [open, setOpen] = useState(false);

  const cancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const handlers = {
    onPointerDown: () => {
      firedRef.current = false;
      cancel();
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        setOpen(true);
      }, HOLD_MS);
    },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(), // 휴대폰에서 길게 누르면 뜨는 메뉴 막기
    // 길게 눌러서 시트가 열렸으면 이어지는 클릭(홈으로)은 무시
    onClickCapture: (e: React.MouseEvent) => {
      if (!firedRef.current) return;
      firedRef.current = false;
      e.stopPropagation();
      e.preventDefault();
    }
  };

  const loginAs = async (role: "owner" | "finder") => {
    try {
      const res = await fetch(apiUrl("/api/members/demo-login"), {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({role})
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as {token: string; nickname: string; email: string};
      localStorage.setItem("token", data.token);
      localStorage.setItem("nickname", data.nickname);
      localStorage.setItem("email", data.email);
      localStorage.removeItem("profileImage"); // 다른 계정 사진이 잠깐 보이지 않게
      dispatch(loadUserFromStorage());
      queueToast(`시연 계정(${data.nickname})으로 둘러봐요`);
      router.push(role === "owner" ? "/chat" : "/mypage");
    } catch {
      showToast("지금은 시연 계정을 쓸 수 없어요");
    };
  };

  const sheet = open ? (
    <ActionSheet
    onClose={() => setOpen(false)}
    items={[
      {label: "보호자로 둘러보기 (콩이찾는중)", onSelect: () => loginAs("owner")},
      {label: "목격자로 둘러보기 (사직동주민)", onSelect: () => loginAs("finder")}
    ]}/>
  ) : null;

  return {handlers, sheet};
};
