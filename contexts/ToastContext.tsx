"use client";

import { createContext, useCallback, useMemo, useState } from "react";
import type { AlertColor } from "@mui/material";
import { AppToast } from "@/components/feedback/AppToast";
import { TOAST_AUTO_HIDE_DURATION_MS } from "@/constants/feedback";

interface ToastState {
  message: string;
  severity: AlertColor;
}

interface ToastContextValue {
  hideToast: () => void;
  showToast: (message: string, severity?: AlertColor) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, severity: AlertColor = "success") => {
    setToast({ message, severity });
  }, []);

  const value = useMemo(
    () => ({ hideToast, showToast }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AppToast
        message={toast?.message ?? null}
        severity={toast?.severity ?? "success"}
        autoHideDuration={TOAST_AUTO_HIDE_DURATION_MS}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}
