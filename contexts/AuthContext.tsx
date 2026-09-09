"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSession, AuthUser } from "@/types/auth";

export interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  finishInitialization: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setAuthSession] = useState<AuthSession | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const setSession = useCallback((nextSession: AuthSession) => {
    setAuthSession(nextSession);
  }, []);

  const clearSession = useCallback(() => {
    setAuthSession(null);
  }, []);

  const finishInitialization = useCallback(() => {
    setIsInitializing(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isAuthenticated: Boolean(session),
      isInitializing,
      setSession,
      clearSession,
      finishInitialization,
    }),
    [clearSession, finishInitialization, isInitializing, session, setSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
