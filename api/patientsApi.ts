import { apiClient } from "@/api/apiClient";
import { PATIENT_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  patientSchema,
  patientsSchema,
  type Patient,
  type PatientQuery,
  type UpdatePatientRequest,
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

export async function getPatients(
  query?: PatientQuery,
  signal?: AbortSignal,
): Promise<Patient[]> {
  const response = await apiClient.get<unknown>(getPatientsPath(query), { signal });
  return validatePatients(response);
}

export async function getPatientById(
  id: number,
  signal?: AbortSignal,
): Promise<Patient> {
  const response = await apiClient.get<unknown>(PATIENT_ENDPOINTS.byId(id), { signal });
  return validatePatient(response);
}

export async function updatePatient(
  id: number,
  request: UpdatePatientRequest,
): Promise<Patient> {
  const response = await apiClient.put<unknown>(PATIENT_ENDPOINTS.byId(id), request);
  return validatePatient(response);
}

export async function getPatientProfile(signal?: AbortSignal): Promise<Patient> {
  const response = await apiClient.get<unknown>(PATIENT_ENDPOINTS.me, { signal });
  return validatePatient(response);
}

