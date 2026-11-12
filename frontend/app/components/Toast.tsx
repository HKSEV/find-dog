"use client";

import React, { useEffect, useState } from "react";
import * as S from "@/assets/css/Style.styles";

// 💡 토스트 (아이콘 없이 문장만, 2초 뒤 사라짐)
//    - showToast: 지금 화면에 바로 띄움
//    - queueToast: 다른 화면으로 이동하면서 띄움 (예: 로그인하고 홈으로 가서 "○○님, 반가워요")
//    ToastHost는 app/layout.tsx에 하나만 있어서 화면이 바뀌어도 사라지지 않음

const EVENT = "app-toast";
const PENDING_KEY = "pending-toast";
const DURATION = 2000;

export const showToast = (message: string) => {
  window.dispatchEvent(new CustomEvent<string>(EVENT, {detail: message}));
};

// ToastHost가 app/layout.tsx에 하나만 있어서 화면을 옮겨도(router.push/replace) 그대로 남음
// → 이동하기 직전에 바로 띄우면 됨. 새로고침으로 이동할 때만 세션에 남겨 다음 화면에서 띄움
export const queueToast = (message: string, options?: {afterReload?: boolean}) => {
  if (!options?.afterReload) {
    showToast(message);
    return;
  };
  try {
    sessionStorage.setItem(PENDING_KEY, message);
  } catch {
    // 저장이 막힌 브라우저에서는 토스트 없이 이동
  };
};

export function ToastHost() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = (text: string) => {
      clearTimeout(timer);
      setMessage(text);
      timer = setTimeout(() => setMessage(""), DURATION);
    };

    const onToast = (e: Event) => show((e as CustomEvent<string>).detail);
    window.addEventListener(EVENT, onToast);

    // 이전 화면에서 남겨 둔 토스트가 있으면 한 번 보여주고 지움
    const pendingTimer = setTimeout(() => {
      try {
        const pending = sessionStorage.getItem(PENDING_KEY);
        if (pending) {
          sessionStorage.removeItem(PENDING_KEY);
          show(pending);
        };
      } catch {
        // 무시
      };
    }, 0);

    return () => {
      window.removeEventListener(EVENT, onToast);
      clearTimeout(timer);
      clearTimeout(pendingTimer);
    };
  }, []);

  if (!message) return null;
  return <S.ToastBox role="status" aria-live="polite">{message}</S.ToastBox>;
};
