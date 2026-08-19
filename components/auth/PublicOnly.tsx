"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import { ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

export function PublicOnly({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated && user) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [isAuthenticated, isInitializing, router, user]);

  if (isInitializing || (isAuthenticated && user)) {
    return <FullPageLoader />;
  }

  return children;
}
