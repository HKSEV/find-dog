"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import AdminAlertModal, { AdminAlertModalOptions } from "../modal/AdminAlertModal";

interface AdminAlertModalConfig extends AdminAlertModalOptions {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirm?: boolean;
  cancelText?: string;
}

interface AdminConfirmModalOptions extends AdminAlertModalOptions {
  cancelText?: string;
  onCancel?: () => void;
}

interface AdminModalContextType {
  openAlertModal: (message: unknown, onConfirm?: () => void, options?: AdminAlertModalOptions) => void;
  openConfirmModal: (message: unknown, onConfirm: () => void, options?: AdminConfirmModalOptions) => void;
}

const AdminModalContext = createContext<AdminModalContextType | undefined>(undefined);

function resolveAlertMessage(message: unknown): string {
  if (typeof message === "string") return message;
  if (message instanceof Error) return message.message;
  if (message && typeof message === "object" && "message" in message && typeof message.message === "string") {
    return message.message;
  };
  return String(message ?? "");
};

export function AdminModalProvider({children}: {children: React.ReactNode}) {
  const [alertModalConfig, setAlertModalConfig] = useState<AdminAlertModalConfig>({
    isOpen: false,
    message: ""
  });
  const activeAlertRef = useRef<AdminAlertModalConfig | null>(null);

  const openAlertModal = useCallback(
    (message: unknown, onConfirm?: () => void, options: AdminAlertModalOptions = {}) => {
      const config = {...options, isOpen: true, message: resolveAlertMessage(message), onConfirm};
      activeAlertRef.current = config;
      setAlertModalConfig(config);
    },
    []
  );

  const openConfirmModal = useCallback(
    (message: unknown, onConfirm: () => void, options: AdminConfirmModalOptions = {}) => {
      const config = {...options, isOpen: true, isConfirm: true, message: resolveAlertMessage(message), onConfirm};
      activeAlertRef.current = config;
      setAlertModalConfig(config);
    },
    []
  );

  const closeAlertModal = useCallback((confirmed: boolean) => {
    const config = activeAlertRef.current;
    if (!config) return;

    activeAlertRef.current = null;
    setAlertModalConfig({isOpen: false, message: ""});
    if (!config.isConfirm || confirmed) {
      config.onConfirm?.();
    } else {
      config.onCancel?.();
    };
  }, []);

  const value = useMemo(() => ({openAlertModal, openConfirmModal}), [openAlertModal, openConfirmModal]);

  return (
    <AdminModalContext.Provider value={value}>
      {children}
      <AdminAlertModal
      isOpen={alertModalConfig.isOpen}
      message={alertModalConfig.message}
      variant={alertModalConfig.variant}
      description={alertModalConfig.description}
      confirmText={alertModalConfig.confirmText}
      cancelText={alertModalConfig.cancelText}
      isConfirm={alertModalConfig.isConfirm}
      onConfirm={() => closeAlertModal(true)}
      onClose={() => closeAlertModal(false)}/>
    </AdminModalContext.Provider>
  );
};

export default function useAdminModal() {
  const context = useContext(AdminModalContext);
  if (!context) {
    throw new Error("useAdminModal must be used within an AdminModalProvider");
  };

  return context;
};
