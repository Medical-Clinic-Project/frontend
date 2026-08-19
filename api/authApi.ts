import { apiRequest } from "@/api/apiClient";
import { AUTH_ENDPOINTS } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";
import {
  authResponseSchema,
  type AuthResponse,
  type LoginRequest,
  type RegisterRequest,
} from "@/types/auth";

function validateAuthResponse(value: unknown): AuthResponse {
  const parsedResponse = authResponseSchema.safeParse(value);

  if (!parsedResponse.success) {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }

  return parsedResponse.data;
}

async function requestSession(
  endpoint: string,
  body?: LoginRequest | RegisterRequest,
): Promise<AuthResponse> {
  const response = await apiRequest(endpoint, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    skipAuth: true,
    skipAuthRefresh: true,
  });

  return validateAuthResponse(response);
}

export const authApi = {
  login: (request: LoginRequest) => requestSession(AUTH_ENDPOINTS.login, request),
  register: (request: RegisterRequest) => requestSession(AUTH_ENDPOINTS.register, request),
  refresh: () => requestSession(AUTH_ENDPOINTS.refresh),
  logout: async () => {
    await apiRequest(AUTH_ENDPOINTS.logout, {
      method: "POST",
      credentials: "include",
      skipAuthRefresh: true,
    });
  },
};
