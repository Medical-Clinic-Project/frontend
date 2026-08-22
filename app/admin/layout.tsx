import type { ReactNode } from "react";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { AdminNavigation } from "@/components/navigation/AdminNavigation";
import { PERMISSIONS } from "@/constants/accessControl";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessAdminWorkspace.action}
      subject={PERMISSIONS.accessAdminWorkspace.subject}
    >
      <AdminNavigation />
      {children}
    </PermissionGuard>
  );
}
