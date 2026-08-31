"use client";

import type { AlertColor } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";

interface AppToastProps {
  message: string | null;
  severity: AlertColor;
  onClose: () => void;
  autoHideDuration: number;
}

export function AppToast({
  message,
  severity,
  onClose,
  autoHideDuration,
}: AppToastProps) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={onClose}
    >
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
