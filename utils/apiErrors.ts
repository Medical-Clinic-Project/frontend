import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError } from "@/types/api";

export function getUserFacingError(
  error: unknown,
  fallback: string = API_MESSAGES.unexpectedError,
): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}
