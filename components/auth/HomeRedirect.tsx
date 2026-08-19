"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import { APP_ROUTES, ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function HomeRedirect() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuth();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    router.replace(
      isAuthenticated && user ? ROLE_HOME[user.role] : APP_ROUTES.login,
    );
  }, [isAuthenticated, isInitializing, router, user]);

  return <FullPageLoader />;
}
