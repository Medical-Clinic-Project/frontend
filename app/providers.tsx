"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthBootstrap } from "@/components/auth/AuthBootstrap";
import { AuthProvider } from "@/contexts/AuthContext";
import { theme } from "@/theme/theme";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AuthBootstrap />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
