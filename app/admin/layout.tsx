import { RoleGuard } from "@/components/auth/RoleGuard";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["Admin"]}>{children}</RoleGuard>;
}
