"use client";

import { useEffect, useId, useRef } from "react";
import { FiCheck, FiInfo, FiAlertCircle, FiX } from "react-icons/fi";
import { lockModalScroll } from "@/lib/modalScrollLock";
import * as S from "@/assets/css/admin/AdminAlert.styles";

export interface AdminAlertModalOptions {
  variant?: S.AdminAlertVariant;
  description?: string;
  confirmText?: string;
}

interface AdminAlertModalProps extends AdminAlertModalOptions {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AdminAlertModal({
  isOpen,
  message,
  onClose,
  variant = "info",
  description,
  confirmText = "확인"
}: AdminAlertModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const Icon = {success: FiCheck, info: FiInfo, error: FiAlertCircle}[variant];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    };

    const unlockScroll = lockModalScroll();
    confirmRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      };
      unlockScroll();
    };
  }, [isOpen, message, variant]);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <S.AlertBox
    ref={dialogRef}
    role="alertdialog"
    aria-modal="true"
    aria-labelledby={`${id}-title`}
    aria-describedby={description ? `${id}-description` : undefined}
    onCancel={(e) => {
      e.preventDefault();
      handleClose();
    }}>
      <S.CloseButton type="button" aria-label="알림 닫기" onClick={handleClose}>
        <FiX aria-hidden="true"/>
      </S.CloseButton>
      <S.AlertIcon $variant={variant} aria-hidden="true">
        <Icon/>
      </S.AlertIcon>
      <S.AlertText id={`${id}-title`}>{message}</S.AlertText>
      {description && <S.AlertDescription id={`${id}-description`}>{description}</S.AlertDescription>}
      <S.AlertActions>
        <S.ConfirmButton ref={confirmRef} type="button" onClick={handleClose}>
          {confirmText}
        </S.ConfirmButton>
      </S.AlertActions>
    </S.AlertBox>
  );
};
