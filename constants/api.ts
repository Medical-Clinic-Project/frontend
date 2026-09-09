import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl?.replace(/\/$/, "") ?? "";

export const AUTH_ENDPOINTS = {
  login: "/api/auth/login",
  register: "/api/auth/register",
  refresh: "/api/auth/refresh",
  logout: "/api/auth/logout",
} as const;

export const DASHBOARD_ENDPOINTS = {
  admin: "/api/dashboard/admin",
  doctor: "/api/dashboard/doctor",
} as const;

export const DEPARTMENT_ENDPOINTS = {
  root: "/api/departments",
  byId: (id: number) => `/api/departments/${id}`,
  status: (id: number) => `/api/departments/${id}/status`,
} as const;

export const DOCTOR_ENDPOINTS = {
  root: "/api/doctors",
  byId: (id: number) => `/api/doctors/${id}`,
  availability: (id: number) => `/api/doctors/${id}/availability`,
} as const;

export const DOCTOR_AVAILABILITY_ENDPOINTS = {
  root: "/api/doctor-availability",
  byId: (id: number) => `/api/doctor-availability/${id}`,
} as const;

export const PATIENT_DOCTOR_ENDPOINTS = {
  root: "/api/patient/doctors",
  byId: (id: number) => `/api/patient/doctors/${id}`,
} as const;

export const APPOINTMENT_ENDPOINTS = {
  root: "/api/appointments",
  mine: "/api/appointments/mine",
  today: "/api/appointments/today",
  upcoming: "/api/appointments/upcoming",
  completed: "/api/appointments/completed",
  cancelled: "/api/appointments/cancelled",
  byId: (id: number) => `/api/appointments/${id}`,
  cancel: (id: number) => `/api/appointments/${id}/cancel`,
  reschedule: (id: number) => `/api/appointments/${id}/reschedule`,
  status: (id: number) => `/api/appointments/${id}/status`,
} as const;

export const PATIENT_ENDPOINTS = {
  root: "/api/patients",
  byId: (id: number) => `/api/patients/${id}`,
  me: "/api/patients/me",
} as const;

export function getApiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new ApiError(0, API_MESSAGES.missingConfiguration);
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
