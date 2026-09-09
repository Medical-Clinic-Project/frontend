"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/auth/FullPageLoader";
import { AUTH_TEXT } from "@/views/auth/AuthText";
import {
  hasPermission,
  type PermissionAction,
  type PermissionSubject,
} from "@/constants/accessControl";
import { APP_ROUTES, ROLE_HOME } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGuardProps {
  action: PermissionAction;
  subject: PermissionSubject;
  children: ReactNode;
}

export function PermissionGuard({
  action,
  subject,
  children,
}: PermissionGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useAuth();
  const redirectTarget = !isAuthenticated
    ? APP_ROUTES.login
    : user && !hasPermission(user.role, action, subject)
      ? ROLE_HOME[user.role]
      : null;

  useEffect(() => {
    if (!isInitializing && redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [isInitializing, redirectTarget, router]);

  if (isInitializing || redirectTarget) {
    return <FullPageLoader label={AUTH_TEXT.checkingAccess} />;
  }

  return children;
}
