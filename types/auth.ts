import { z } from "zod";

export const USER_ROLES = ["Admin", "Doctor", "Patient"] as const;

export const userRoleSchema = z.enum(USER_ROLES);

export const authResponseSchema = z.object({
  accessToken: z.string().min(1),
  fullName: z.string(),
  email: z.string(),
  role: userRoleSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type AuthUser = Omit<AuthResponse, "accessToken">;

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export function toAuthSession(response: AuthResponse): AuthSession {
  const { accessToken, fullName, email, role } = response;

  return {
    accessToken,
    user: { fullName, email, role },
  };
}
