export const API_MESSAGES = {
  missingConfiguration:
    "The API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL and restart the frontend.",
  invalidResponse: "Received an invalid response from the server.",
  serviceUnavailable: "The service is temporarily unavailable. Please try again.",
  unauthorized: "Your session is not authorized.",
  forbidden: "You do not have permission to perform this action.",
  requestFailed: "The request could not be completed. Please try again.",
  networkError: "Unable to reach the service. Check your connection and try again.",
  unexpectedError: "Something went wrong. Please try again.",
} as const;
