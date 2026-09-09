import type { UserRole } from "@/types/auth";

export const APP_ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  admin: "/admin",
  adminDashboard: "/admin/dashboard",
  adminDepartments: "/admin/departments",
  adminDoctors: "/admin/doctors",
  adminPatients: "/admin/patients",
  adminAppointments: "/admin/appointments",
  doctor: "/doctor",
  doctorDashboard: "/doctor/dashboard",
  doctorAvailability: "/doctor/availability",
  doctorAppointments: "/doctor/appointments",
  patient: "/patient",
  patientProfile: "/patient/profile",
  patientDoctors: "/patient/doctors",
  patientDoctorDetails: (id: number) => `/patient/doctors/${id}`,
  patientAppointments: "/patient/appointments",
} as const;

export const ROLE_HOME: Record<UserRole, string> = {
  Admin: APP_ROUTES.adminDashboard,
  Doctor: APP_ROUTES.doctorDashboard,
  Patient: APP_ROUTES.patient,
};
