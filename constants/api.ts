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

export const DEPARTMENT_ENDPOINTS = {
  root: "/api/departments",
  byId: (id: number) => `/api/departments/${id}`,
  status: (id: number) => `/api/departments/${id}/status`,
} as const;

export const DOCTOR_ENDPOINTS = {
  root: "/api/doctors",
  byId: (id: number) => `/api/doctors/${id}`,
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
