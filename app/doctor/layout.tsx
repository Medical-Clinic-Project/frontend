import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/accessControl";
import type { ReactNode } from "react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard permission={PERMISSIONS.accessDoctorWorkspace}>
      {children}
    </PermissionGuard>
  );
}
