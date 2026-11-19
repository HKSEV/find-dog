"use client";

import React, { useRef } from "react";

// 💡 한글 입력 중 바로 제출 버튼을 눌러도 한 번에 제출되게
//    macOS(특히 Safari)는 한글 조합 중에 버튼을 누르면 첫 클릭이 조합을 끝내는 데만 쓰이고
//    click 이 오지 않아 "두 번 눌러야 등록되는" 문제가 생김
//    -> 버튼을 누르는 순간(mousedown) 입력칸을 빠져나와 글자를 확정하고 폼을 직접 제출,
//       뒤따라 click 이 오면(Chrome 등) 두 번 제출되지 않게 무시
//    사용: const imeSafeSubmit = useImeSafeSubmit(); <S.WriteSubmit type="submit" {...imeSafeSubmit}>
export function useImeSafeSubmit() {
  const handledRef = useRef(false);

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    handledRef.current = false;
    const button = e.currentTarget;
    const active = document.activeElement;
    const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
    if (e.button !== 0 || button.disabled || !typing || !button.form) return;

    const form = button.form;
    handledRef.current = true;
    active.blur(); // 조합 중인 글자를 확정 (입력칸 onChange 가 먼저 반영됨)
    setTimeout(() => form.requestSubmit(), 0); // 확정된 값으로 다시 그려진 뒤 제출
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!handledRef.current) return;
    handledRef.current = false;
    e.preventDefault(); // 위에서 이미 제출함
  };

  return {onMouseDown, onClick};
};
