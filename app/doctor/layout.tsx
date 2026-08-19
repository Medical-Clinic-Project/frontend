import { RoleGuard } from "@/components/auth/RoleGuard";
import type { ReactNode } from "react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["Doctor"]}>{children}</RoleGuard>;
}
