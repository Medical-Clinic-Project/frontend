import { apiClient } from "@/api/apiClient";
import { DEPARTMENT_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  departmentSchema,
  departmentsSchema,
  type CreateDepartmentRequest,
  type Department,
  type UpdateDepartmentRequest,
  type UpdateDepartmentStatusRequest,
} from "@/types/department";

function validateDepartment(value: unknown): Department {
  const parsedDepartment = departmentSchema.safeParse(value);

  if (!parsedDepartment.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedDepartment.data;
}

function validateDepartments(value: unknown): Department[] {
  const parsedDepartments = departmentsSchema.safeParse(value);

  if (!parsedDepartments.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedDepartments.data;
}

function getDepartmentsPath(search?: string): string {
  const normalizedSearch = search?.trim();

  if (!normalizedSearch) {
    return DEPARTMENT_ENDPOINTS.root;
  }

  const query = new URLSearchParams({ search: normalizedSearch });
  return `${DEPARTMENT_ENDPOINTS.root}?${query.toString()}`;
}

export async function getDepartments(
  search?: string,
  signal?: AbortSignal,
): Promise<Department[]> {
  const response = await apiClient.get<Department[]>(getDepartmentsPath(search), { signal });
  return validateDepartments(response);
}

export async function getDepartmentById(id: number): Promise<Department> {
  const response = await apiClient.get<unknown>(DEPARTMENT_ENDPOINTS.byId(id));
  return validateDepartment(response);
}

export async function createDepartment(
  request: CreateDepartmentRequest,
): Promise<Department> {
  const response = await apiClient.post<unknown>(DEPARTMENT_ENDPOINTS.root, request);
  return validateDepartment(response);
}

export async function updateDepartment(
  id: number,
  request: UpdateDepartmentRequest,
): Promise<Department> {
  const response = await apiClient.put<unknown>(DEPARTMENT_ENDPOINTS.byId(id), request);
  return validateDepartment(response);
}

export async function updateDepartmentStatus(
  id: number,
  request: UpdateDepartmentStatusRequest,
): Promise<Department> {
  const response = await apiClient.patch<unknown>(DEPARTMENT_ENDPOINTS.status(id), request);
  return validateDepartment(response);
}
