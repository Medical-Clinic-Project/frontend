import { apiRequest } from "@/api/apiClient";
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

export const departmentsApi = {
  getAll: async (search?: string, signal?: AbortSignal) => {
    const response = await apiRequest(getDepartmentsPath(search), { signal });
    return validateDepartments(response);
  },
  getById: async (id: number) => {
    const response = await apiRequest(DEPARTMENT_ENDPOINTS.byId(id));
    return validateDepartment(response);
  },
  create: async (request: CreateDepartmentRequest) => {
    const response = await apiRequest(DEPARTMENT_ENDPOINTS.root, {
      method: "POST",
      body: JSON.stringify(request),
    });
    return validateDepartment(response);
  },
  update: async (id: number, request: UpdateDepartmentRequest) => {
    const response = await apiRequest(DEPARTMENT_ENDPOINTS.byId(id), {
      method: "PUT",
      body: JSON.stringify(request),
    });
    return validateDepartment(response);
  },
  updateStatus: async (id: number, request: UpdateDepartmentStatusRequest) => {
    const response = await apiRequest(DEPARTMENT_ENDPOINTS.status(id), {
      method: "PATCH",
      body: JSON.stringify(request),
    });
    return validateDepartment(response);
  },
};
