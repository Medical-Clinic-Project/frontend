import type { UserRole } from "@/types/auth";

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  admin: "/admin",
  adminDepartments: "/admin/departments",
  adminDoctors: "/admin/doctors",
  adminPatients: "/admin/patients",
  doctor: "/doctor",
  doctorAvailability: "/doctor/availability",
  patient: "/patient",
  patientProfile: "/patient/profile",
} as const;

export const ROLE_HOME: Record<UserRole, string> = {
  Admin: APP_ROUTES.admin,
  Doctor: APP_ROUTES.doctor,
  Patient: APP_ROUTES.patient,
};
