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
  updateUser: (updates: Pick<AuthUser, "fullName" | "email">) => void;
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

  const updateUser = useCallback(
    (updates: Pick<AuthUser, "fullName" | "email">) => {
      setAuthSession((currentSession) =>
        currentSession
          ? {
              ...currentSession,
              user: { ...currentSession.user, ...updates },
            }
          : currentSession,
      );
    },
    [],
  );

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
      updateUser,
      clearSession,
      finishInitialization,
    }),
    [
      clearSession,
      finishInitialization,
      isInitializing,
      session,
      setSession,
      updateUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
