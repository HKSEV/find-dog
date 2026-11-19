"use client";

import React, { useRef } from "react";

// 💡 한글 입력 중 바로 제출 버튼을 눌러도 한 번에 제출되게
//    macOS(특히 Safari)는 한글 조합 중에 버튼을 누르면 첫 클릭을 조합을 끝내는 데 써 버려서
//    mousedown·click 이 페이지에 오지 않아 "두 번 눌러야 등록되는" 문제가 생김
//    1) 마우스가 버튼 위에 올라오는 순간(pointerenter) 입력칸을 빠져나와 글자를 먼저 확정
//       -> 실제 클릭은 조합이 끝난 뒤라 한 번에 전달됨
//    2) 그래도 입력칸에 있는 채로 눌리면(mousedown) 확정 후 폼을 직접 제출하고, 뒤따르는 click 은 무시
//    사용: const imeSafeSubmit = useImeSafeSubmit(); <S.WriteSubmit type="submit" {...imeSafeSubmit}>
const typingElement = () => {
  const active = document.activeElement;
  return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement ? active : null;
};

export function useImeSafeSubmit() {
  const handledRef = useRef(false);

  const onPointerEnter = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse" || e.currentTarget.disabled) return;
    typingElement()?.blur(); // 조합 중인 글자를 확정 (입력칸 onChange 가 먼저 반영됨)
  };

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    handledRef.current = false;
    const button = e.currentTarget;
    const active = typingElement();
    if (e.button !== 0 || button.disabled || !active || !button.form) return;

    const form = button.form;
    handledRef.current = true;
    active.blur();
    setTimeout(() => form.requestSubmit(), 0); // 확정된 값으로 다시 그려진 뒤 제출
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!handledRef.current) return;
    handledRef.current = false;
    e.preventDefault(); // 위에서 이미 제출함
  };

  return {onPointerEnter, onMouseDown, onClick};
};
