"use client";

import { useEffect, useId, useRef } from "react";
import { FiCheck, FiInfo, FiAlertCircle, FiHelpCircle, FiX } from "react-icons/fi";
import { lockModalScroll } from "@/lib/modalScrollLock";
import * as S from "@/assets/css/Style.styles";

export interface AdminAlertModalOptions {
  variant?: S.AdminAlertVariant;
  description?: string;
  confirmText?: string;
}

interface AdminAlertModalProps extends AdminAlertModalOptions {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  isConfirm?: boolean;
  cancelText?: string;
}

export default function AdminAlertModal({
  isOpen,
  message,
  onClose,
  onConfirm,
  isConfirm = false,
  cancelText = "아니오",
  variant = "info",
  description,
  confirmText = "확인"
}: AdminAlertModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  const Icon = isConfirm ? FiHelpCircle : {success: FiCheck, info: FiInfo, error: FiAlertCircle}[variant];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    };

    const unlockScroll = lockModalScroll();
    (isConfirm ? cancelRef : confirmRef).current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      };
      unlockScroll();
    };
  }, [isOpen, message, variant, isConfirm]);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  const handleConfirm = () => {
    dialogRef.current?.close();
    (onConfirm || onClose)();
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
      <S.AdminAlertCloseButton type="button" aria-label="알림 닫기" onClick={handleClose}>
        <FiX aria-hidden="true"/>
      </S.AdminAlertCloseButton>
      <S.AlertIcon $variant={variant} aria-hidden="true">
        <Icon/>
      </S.AlertIcon>
      <S.AlertText id={`${id}-title`}>{message}</S.AlertText>
      {description && <S.AlertDescription id={`${id}-description`}>{description}</S.AlertDescription>}
      <S.AlertActions $isConfirm={isConfirm}>
        {isConfirm && (
          <S.AdminAlertCancelButton ref={cancelRef} type="button" onClick={handleClose}>
            {cancelText}
          </S.AdminAlertCancelButton>
        )}
        <S.AdminAlertConfirmButton ref={confirmRef} type="button" onClick={handleConfirm}>
          {confirmText}
        </S.AdminAlertConfirmButton>
      </S.AlertActions>
    </S.AlertBox>
  );
};
