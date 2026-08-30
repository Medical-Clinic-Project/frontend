import { apiClient } from "@/api/apiClient";
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
  const response = await apiClient.post<unknown>(endpoint, body, {
    credentials: "include",
    skipAuth: true,
    skipAuthRefresh: true,
  });

  return validateAuthResponse(response);
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  return requestSession(AUTH_ENDPOINTS.login, request);
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  return requestSession(AUTH_ENDPOINTS.register, request);
}

export async function refresh(): Promise<AuthResponse> {
  return requestSession(AUTH_ENDPOINTS.refresh);
}

export async function logout(): Promise<void> {
  await apiClient.post<void>(AUTH_ENDPOINTS.logout, undefined, {
    credentials: "include",
    skipAuthRefresh: true,
  });
}
