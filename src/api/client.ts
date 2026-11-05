const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const TOKEN_KEY = "jobHuntTracker.token";

export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    validationErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Attach the stored JWT as an Authorization header. Defaults to true. */
  auth?: boolean;
}

interface BackendErrorResponse {
  message?: string;
  validationErrors?: Record<string, string>;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => null)) as
    BackendErrorResponse | T | null;

  if (!response.ok) {
    if (response.status === 401) {
      setToken(null);
    }
    const errorData = data as BackendErrorResponse | null;
    throw new ApiError(
      errorData?.message ?? "Something went wrong. Please try again.",
      response.status,
      errorData?.validationErrors,
    );
  }

  return data as T;
}
