import type { UserRole } from "@/types/auth";

export const PERMISSION_ACTIONS = {
  access: "access",
} as const;

export const PERMISSION_SUBJECTS = {
  adminWorkspace: "admin-workspace",
  doctorWorkspace: "doctor-workspace",
  patientWorkspace: "patient-workspace",
} as const;

export type PermissionAction =
  (typeof PERMISSION_ACTIONS)[keyof typeof PERMISSION_ACTIONS];
export type PermissionSubject =
  (typeof PERMISSION_SUBJECTS)[keyof typeof PERMISSION_SUBJECTS];

export interface Permission {
  readonly action: PermissionAction;
  readonly subject: PermissionSubject;
}

export const PERMISSIONS = {
  accessAdminWorkspace: {
    action: PERMISSION_ACTIONS.access,
    subject: PERMISSION_SUBJECTS.adminWorkspace,
  },
  accessDoctorWorkspace: {
    action: PERMISSION_ACTIONS.access,
    subject: PERMISSION_SUBJECTS.doctorWorkspace,
  },
  accessPatientWorkspace: {
    action: PERMISSION_ACTIONS.access,
    subject: PERMISSION_SUBJECTS.patientWorkspace,
  },
} as const satisfies Record<string, Permission>;

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  Admin: [PERMISSIONS.accessAdminWorkspace],
  Doctor: [PERMISSIONS.accessDoctorWorkspace],
  Patient: [PERMISSIONS.accessPatientWorkspace],
};

export function hasPermission(
  role: UserRole,
  action: PermissionAction,
  subject: PermissionSubject,
): boolean {
  return ROLE_PERMISSIONS[role].some(
    (permission) =>
      permission.action === action && permission.subject === subject,
  );
}
