import { apiClient } from "@/api/apiClient";
import {
  DOCTOR_AVAILABILITY_ENDPOINTS,
  DOCTOR_ENDPOINTS,
} from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  doctorAvailabilitiesSchema,
  doctorAvailabilitySchema,
  type DoctorAvailability,
  type DoctorAvailabilityRange,
  type DoctorAvailabilityRequest,
} from "@/types/doctorAvailability";

function validateAvailability(value: unknown): DoctorAvailability {
  const result = doctorAvailabilitySchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function validateAvailabilities(value: unknown): DoctorAvailability[] {
  const result = doctorAvailabilitiesSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function withRange(path: string, range: DoctorAvailabilityRange): string {
  const query = new URLSearchParams({
    from: range.from,
    to: range.to,
  });

  return `${path}?${query.toString()}`;
}

export async function getMyDoctorAvailability(
  range: DoctorAvailabilityRange,
  signal?: AbortSignal,
): Promise<DoctorAvailability[]> {
  const response = await apiClient.get<unknown>(
    withRange(DOCTOR_AVAILABILITY_ENDPOINTS.root, range),
    { signal },
  );
  return validateAvailabilities(response);
}

export async function getDoctorAvailability(
  doctorId: number,
  range: DoctorAvailabilityRange,
  signal?: AbortSignal,
): Promise<DoctorAvailability[]> {
  const response = await apiClient.get<unknown>(
    withRange(DOCTOR_ENDPOINTS.availability(doctorId), range),
    { signal },
  );
  return validateAvailabilities(response);
}

export async function createDoctorAvailability(
  request: DoctorAvailabilityRequest,
): Promise<DoctorAvailability> {
  const response = await apiClient.post<unknown>(
    DOCTOR_AVAILABILITY_ENDPOINTS.root,
    request,
  );
  return validateAvailability(response);
}

export async function updateDoctorAvailability(
  id: number,
  request: DoctorAvailabilityRequest,
): Promise<DoctorAvailability> {
  const response = await apiClient.put<unknown>(
    DOCTOR_AVAILABILITY_ENDPOINTS.byId(id),
    request,
  );
  return validateAvailability(response);
}

export async function deleteDoctorAvailability(id: number): Promise<void> {
  await apiClient.delete<void>(DOCTOR_AVAILABILITY_ENDPOINTS.byId(id));
}
