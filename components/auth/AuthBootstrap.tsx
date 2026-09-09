"use client";

import { useEffect } from "react";
import { configureApiClientAuth } from "@/api/apiClient";
import { refresh } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/types/api";
import { toAuthSession, type AuthResponse } from "@/types/auth";

let initializationRequest: Promise<AuthResponse | null> | null = null;

function restoreSession(): Promise<AuthResponse | null> {
  if (!initializationRequest) {
    initializationRequest = refresh().catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      initializationRequest = null;
      throw error;
    });
  }

  return initializationRequest;
}

export function AuthBootstrap() {
  const {
    accessToken,
    clearSession,
    finishInitialization,
    setSession,
  } = useAuth();

  useEffect(
    () =>
      configureApiClientAuth({
        getAccessToken: () => accessToken,
        refreshSession: async () => {
          const response = await refresh();
          setSession(toAuthSession(response));
          return response.accessToken;
        },
        clearSession,
      }),
    [accessToken, clearSession, setSession],
  );

  useEffect(() => {
    let isActive = true;

    void restoreSession()
      .then((response) => {
        if (!isActive) {
          return;
        }

        if (response) {
          setSession(toAuthSession(response));
        } else {
          clearSession();
        }
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        console.error(error);
        clearSession();
      })
      .finally(() => {
        if (isActive) {
          finishInitialization();
        }
      });

    return () => {
      isActive = false;
    };
  }, [clearSession, finishInitialization, setSession]);

  return null;
}
