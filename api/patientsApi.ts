import { apiClient } from "@/api/apiClient";
import { PATIENT_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  patientSchema,
  patientsSchema,
  type Patient,
  type PatientQuery,
  type UpdatePatientProfileRequest,
  type UpdatePatientStatusRequest,
} from "@/types/patient";

function validatePatient(value: unknown): Patient {
  const parsedPatient = patientSchema.safeParse(value);

  if (!parsedPatient.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedPatient.data;
}

function validatePatients(value: unknown): Patient[] {
  const parsedPatients = patientsSchema.safeParse(value);

  if (!parsedPatients.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedPatients.data;
}

function getPatientsPath(query?: PatientQuery): string {
  const searchParams = new URLSearchParams();
  const normalizedSearch = query?.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
  }

  if (query?.isActive !== undefined) {
    searchParams.set("isActive", String(query.isActive));
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${PATIENT_ENDPOINTS.root}?${queryString}`
    : PATIENT_ENDPOINTS.root;
}

export const patientsApi = {
  getAll: async (query?: PatientQuery, signal?: AbortSignal) => {
    const response = await apiClient.get<unknown>(getPatientsPath(query), { signal });
    return validatePatients(response);
  },
  getById: async (id: number, signal?: AbortSignal) => {
    const response = await apiClient.get<unknown>(PATIENT_ENDPOINTS.byId(id), { signal });
    return validatePatient(response);
  },
  updateStatus: async (
    id: number,
    request: UpdatePatientStatusRequest,
  ) => {
    const response = await apiClient.patch<unknown>(
      PATIENT_ENDPOINTS.status(id),
      request,
    );
    return validatePatient(response);
  },
  getProfile: async (signal?: AbortSignal) => {
    const response = await apiClient.get<unknown>(PATIENT_ENDPOINTS.me, { signal });
    return validatePatient(response);
  },
  updateProfile: async (request: UpdatePatientProfileRequest) => {
    const response = await apiClient.put<unknown>(PATIENT_ENDPOINTS.me, request);
    return validatePatient(response);
  },
};
