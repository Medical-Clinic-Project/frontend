import { apiClient } from "@/api/apiClient";
import { PATIENT_DOCTOR_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  patientDoctorSchema,
  patientDoctorsSchema,
  type PatientDoctor,
  type PatientDoctorQuery,
} from "@/types/patientDoctor";

function validatePatientDoctor(value: unknown): PatientDoctor {
  const result = patientDoctorSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function validatePatientDoctors(value: unknown): PatientDoctor[] {
  const result = patientDoctorsSchema.safeParse(value);

  if (!result.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return result.data;
}

function getPatientDoctorsPath(query?: PatientDoctorQuery): string {
  const searchParams = new URLSearchParams();
  const search = query?.search?.trim();

  if (search) {
    searchParams.set("search", search);
  }

  if (
    query?.departmentId !== undefined &&
    Number.isInteger(query.departmentId) &&
    query.departmentId > 0
  ) {
    searchParams.set("departmentId", query.departmentId.toString());
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${PATIENT_DOCTOR_ENDPOINTS.root}?${queryString}`
    : PATIENT_DOCTOR_ENDPOINTS.root;
}

export async function getPatientDoctors(
  query?: PatientDoctorQuery,
  signal?: AbortSignal,
): Promise<PatientDoctor[]> {
  const response = await apiClient.get<unknown>(getPatientDoctorsPath(query), {
    signal,
  });

  return validatePatientDoctors(response);
}

export async function getPatientDoctorById(
  id: number,
  signal?: AbortSignal,
): Promise<PatientDoctor> {
  const response = await apiClient.get<unknown>(
    PATIENT_DOCTOR_ENDPOINTS.byId(id),
    { signal },
  );

  return validatePatientDoctor(response);
}
