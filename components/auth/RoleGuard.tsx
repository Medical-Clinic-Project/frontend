"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import { APP_ROUTES, ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types/auth";

interface RoleGuardProps {
  allowedRoles: readonly UserRole[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuth();
  const redirectTarget = !isAuthenticated
    ? APP_ROUTES.login
    : user && !allowedRoles.includes(user.role)
      ? ROLE_HOME[user.role]
      : null;

  useEffect(() => {
    if (!isInitializing && redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [isInitializing, redirectTarget, router]);

  if (isInitializing || redirectTarget) {
    return <FullPageLoader label="Checking access…" />;
  }

  return children;
}
