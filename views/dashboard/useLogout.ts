"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/authApi";
import { APP_ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { getUserFacingError } from "@/utils/apiErrors";

export function useLogout() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const logout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await authApi.logout();
      clearSession();
      router.replace(APP_ROUTES.login);
    } catch (error) {
      setLogoutError(getUserFacingError(error, "Unable to sign out. Please try again."));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { isLoggingOut, logout, logoutError };
}
