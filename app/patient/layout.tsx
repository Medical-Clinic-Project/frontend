import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { PERMISSIONS } from "@/constants/accessControl";
import { PatientNavigation } from "@/components/navigation/PatientNavigation";
import type { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessPatientWorkspace.action}
      subject={PERMISSIONS.accessPatientWorkspace.subject}
    >
      <PatientNavigation />
      {children}
    </PermissionGuard>
  );
}
