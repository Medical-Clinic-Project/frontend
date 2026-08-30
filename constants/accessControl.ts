import type { UserRole } from "@/types/auth";

export const PERMISSIONS = {
  accessAdminWorkspace: "access:admin-workspace",
  accessDoctorWorkspace: "access:doctor-workspace",
  accessPatientWorkspace: "access:patient-workspace",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  Admin: [PERMISSIONS.accessAdminWorkspace],
  Doctor: [PERMISSIONS.accessDoctorWorkspace],
  Patient: [PERMISSIONS.accessPatientWorkspace],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
