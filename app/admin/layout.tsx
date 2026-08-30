import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/accessControl";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard permission={PERMISSIONS.accessAdminWorkspace}>
      {children}
    </PermissionGuard>
  );
}
