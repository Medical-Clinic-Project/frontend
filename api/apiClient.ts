import { getApiUrl } from "@/constants/api";
import { API_MESSAGES } from "@/constants/apiMessages";
import { ApiError, apiErrorResponseSchema } from "@/types/api";

interface ApiClientAuthHandlers {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<string | null>;
  clearSession: () => void;
}

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipAuthRefresh?: boolean;
}

const noAuthHandlers: ApiClientAuthHandlers = {
  getAccessToken: () => null,
  refreshSession: async () => null,
  clearSession: () => undefined,
};

let authHandlers = noAuthHandlers;
let activeRefresh: Promise<string | null> | null = null;

export function configureApiClientAuth(handlers: ApiClientAuthHandlers): () => void {
  authHandlers = handlers;

  return () => {
    if (authHandlers === handlers) {
      authHandlers = noAuthHandlers;
    }
  };
}

function createHeaders(options: ApiRequestOptions, accessToken: string | null): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!options.skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!activeRefresh) {
    activeRefresh = authHandlers
      .refreshSession()
      .catch((error: unknown) => {
        if (!(error instanceof ApiError && error.status === 401)) {
          console.error(error);
        }

        authHandlers.clearSession();
        return null;
      })
      .finally(() => {
        activeRefresh = null;
      });
  }

  return activeRefresh;
}

async function readError(response: Response): Promise<ApiError> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    // Some infrastructure errors do not return JSON. The status fallback below is intentional.
  }

  const parsedError = apiErrorResponseSchema.safeParse(payload);
  const errorBody = parsedError.success ? parsedError.data : {};

  const safeMessage =
    response.status >= 500
      ? API_MESSAGES.serviceUnavailable
      : errorBody.message?.trim()
        ? errorBody.message
        : response.status === 401
          ? API_MESSAGES.unauthorized
          : response.status === 403
            ? API_MESSAGES.forbidden
            : API_MESSAGES.requestFailed;

  return new ApiError(response.status, safeMessage, errorBody.errors);
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (response.status === 204) {
    return undefined as TResponse;
  }

  try {
    return (await response.json()) as TResponse;
  } catch {
    throw new ApiError(500, API_MESSAGES.invalidResponse);
  }
}

async function executeRequest(path: string, options: RequestInit): Promise<Response> {
  try {
    return await fetch(getApiUrl(path), options);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(0, API_MESSAGES.networkError);
  }
}

async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { skipAuth = false, skipAuthRefresh = false, ...requestOptions } = options;
  const headerOptions = { ...requestOptions, skipAuth };
  const initialToken = authHandlers.getAccessToken();
  const request = () =>
    executeRequest(path, {
      ...requestOptions,
      headers: createHeaders(headerOptions, initialToken),
    });

  let response = await request();

  if (response.status === 401 && !skipAuthRefresh) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      response = await executeRequest(path, {
        ...requestOptions,
        headers: createHeaders(headerOptions, refreshedToken),
      });

      if (response.status === 401) {
        authHandlers.clearSession();
      }
    }
  }

  if (!response.ok) {
    throw await readError(response);
  }

  return parseResponse<TResponse>(response);
}

function serializeBody(body: unknown): BodyInit | undefined {
  if (body === undefined || body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

export const apiClient = {
  get<TResponse>(path: string, options: ApiRequestOptions = {}) {
    return apiRequest<TResponse>(path, { ...options, method: "GET" });
  },
  post<TResponse>(
    path: string,
    body?: unknown,
    options: ApiRequestOptions = {},
  ) {
    return apiRequest<TResponse>(path, {
      ...options,
      method: "POST",
      body: serializeBody(body),
    });
  },
  put<TResponse>(
    path: string,
    body?: unknown,
    options: ApiRequestOptions = {},
  ) {
    return apiRequest<TResponse>(path, {
      ...options,
      method: "PUT",
      body: serializeBody(body),
    });
  },
  patch<TResponse>(
    path: string,
    body?: unknown,
    options: ApiRequestOptions = {},
  ) {
    return apiRequest<TResponse>(path, {
      ...options,
      method: "PATCH",
      body: serializeBody(body),
    });
  },
  delete<TResponse>(path: string, options: ApiRequestOptions = {}) {
    return apiRequest<TResponse>(path, { ...options, method: "DELETE" });
  },
};
