"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import AdminAlertModal, { AdminAlertModalOptions } from "../modal/AdminAlertModal";

interface AdminAlertModalConfig extends AdminAlertModalOptions {
  isOpen: boolean;
  message: string;
  onConfirm?: () => void;
}

interface AdminModalContextType {
  openAlertModal: (message: unknown, onConfirm?: () => void, options?: AdminAlertModalOptions) => void;
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

  const closeAlertModal = useCallback(() => {
    const config = activeAlertRef.current;
    if (!config) return;

    activeAlertRef.current = null;
    setAlertModalConfig({isOpen: false, message: ""});
    config.onConfirm?.();
  }, []);

  const value = useMemo(() => ({openAlertModal}), [openAlertModal]);

  return (
    <AdminModalContext.Provider value={value}>
      {children}
      <AdminAlertModal
      isOpen={alertModalConfig.isOpen}
      message={alertModalConfig.message}
      variant={alertModalConfig.variant}
      description={alertModalConfig.description}
      confirmText={alertModalConfig.confirmText}
      onClose={closeAlertModal}/>
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
