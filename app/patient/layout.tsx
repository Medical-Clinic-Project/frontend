import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/accessControl";
import type { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard permission={PERMISSIONS.accessPatientWorkspace}>
      {children}
    </PermissionGuard>
  );
}
