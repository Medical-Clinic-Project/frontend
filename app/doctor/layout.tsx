import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { DoctorNavigation } from "@/components/navigation/DoctorNavigation";
import { PERMISSIONS } from "@/constants/accessControl";

import type { ReactNode } from "react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <PermissionGuard
      action={PERMISSIONS.accessDoctorWorkspace.action}
      subject={PERMISSIONS.accessDoctorWorkspace.subject}
    >
      <DoctorNavigation />
      {children}
    </PermissionGuard>
  );
}
