"use client";

import { useCallback, useState } from "react";
import { logout as logoutRequest } from "@/api/authApi";
import { LOGOUT_FEEDBACK } from "@/constants/feedback";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { getUserFacingError } from "@/utils/apiErrors";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const { showToast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await logoutRequest();
      clearSession();
      router.replace(APP_ROUTES.login);
    } catch (error) {
      const message = getUserFacingError(error, LOGOUT_FEEDBACK.error);

      setLogoutError(message);
      showToast(message, "error");
    } finally {
      setIsLoggingOut(false);
    }
  }, [clearSession, router, showToast]);

  return { isLoggingOut, logout, logoutError };
}
