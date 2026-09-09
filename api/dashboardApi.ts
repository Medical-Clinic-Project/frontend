import { apiClient } from "@/api/apiClient";
import { DASHBOARD_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  adminDashboardSchema,
  doctorDashboardSchema,
  type AdminDashboard,
  type DoctorDashboard,
} from "@/types/dashboard";

function validateAdminDashboard(value: unknown): AdminDashboard {
  const result = adminDashboardSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function validateDoctorDashboard(value: unknown): DoctorDashboard {
  const result = doctorDashboardSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

export async function getAdminDashboard(
  signal?: AbortSignal,
): Promise<AdminDashboard> {
  const response = await apiClient.get<unknown>(DASHBOARD_ENDPOINTS.admin, {
    signal,
  });

  return validateAdminDashboard(response);
}

export async function getDoctorDashboard(
  signal?: AbortSignal,
): Promise<DoctorDashboard> {
  const response = await apiClient.get<unknown>(DASHBOARD_ENDPOINTS.doctor, {
    signal,
  });

  return validateDoctorDashboard(response);
}
