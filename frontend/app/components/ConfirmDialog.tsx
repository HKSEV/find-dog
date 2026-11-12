"use client";

import React, { useEffect, useRef } from "react";
import * as S from "@/assets/css/Style.styles";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText: string;
  cancelText?: string;
  danger?: boolean; // 삭제처럼 되돌릴 수 없는 일은 빨간 버튼
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// 💡 확인 창 (아이콘 없이 글자만, 버튼 2개). Esc나 바깥을 누르면 닫힘
export default function ConfirmDialog({
  isOpen, title, message, confirmText, cancelText = "닫기", danger, busy, onConfirm, onCancel
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus(); // 실수로 Enter를 눌러도 진행되지 않게 "닫기"에 포커스
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <S.DialogOverlay onClick={onCancel}>
      <S.DialogBox role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onClick={(e) => e.stopPropagation()}>
        <S.DialogTitle id="confirm-title">{title}</S.DialogTitle>
        {message && <S.DialogText>{message}</S.DialogText>}
        <S.DialogButtons>
          <S.DialogButton ref={cancelRef} type="button" onClick={onCancel}>{cancelText}</S.DialogButton>
          <S.DialogButton type="button" $variant={danger ? "danger" : "primary"} disabled={busy} onClick={onConfirm}>
            {busy ? "처리 중..." : confirmText}
          </S.DialogButton>
        </S.DialogButtons>
      </S.DialogBox>
    </S.DialogOverlay>
  );
};
