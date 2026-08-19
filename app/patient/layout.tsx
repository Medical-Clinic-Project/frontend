import { RoleGuard } from "@/components/auth/RoleGuard";
import type { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["Patient"]}>{children}</RoleGuard>;
}
