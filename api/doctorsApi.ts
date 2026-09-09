import { apiClient } from "@/api/apiClient";
import { DOCTOR_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  doctorSchema,
  doctorsSchema,
  type CreateDoctorRequest,
  type Doctor,
  type DoctorQuery,
  type UpdateDoctorRequest,
} from "@/types/doctor";

function validateDoctor(value: unknown): Doctor {
  const parsedDoctor = doctorSchema.safeParse(value);

  if (!parsedDoctor.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedDoctor.data;
}

function validateDoctors(value: unknown): Doctor[] {
  const parsedDoctors = doctorsSchema.safeParse(value);

  if (!parsedDoctors.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedDoctors.data;
}

function getDoctorsPath(query?: DoctorQuery): string {
  const searchParams = new URLSearchParams();
  const normalizedSearch = query?.search?.trim();

  if (normalizedSearch) {
    searchParams.set("search", normalizedSearch);
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
    ? `${DOCTOR_ENDPOINTS.root}?${queryString}`
    : DOCTOR_ENDPOINTS.root;
}

export async function getDoctors(
  query?: DoctorQuery,
  signal?: AbortSignal,
): Promise<Doctor[]> {
  const response = await apiClient.get<unknown>(getDoctorsPath(query), { signal });
  return validateDoctors(response);
}

export async function getDoctorById(id: number): Promise<Doctor> {
  const response = await apiClient.get<unknown>(DOCTOR_ENDPOINTS.byId(id));
  return validateDoctor(response);
}

export async function createDoctor(
  request: CreateDoctorRequest,
): Promise<Doctor> {
  const response = await apiClient.post<unknown>(DOCTOR_ENDPOINTS.root, request);
  return validateDoctor(response);
}

export async function updateDoctor(
  id: number,
  request: UpdateDoctorRequest,
): Promise<Doctor> {
  const response = await apiClient.put<unknown>(DOCTOR_ENDPOINTS.byId(id), request);
  return validateDoctor(response);
}
