import { API_BASE_URL } from "../config/env";
import type { StaffRole } from "../constants/permissions";

const ADMIN_TOKEN_STORAGE_KEY = "admin_token";

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: StaffRole;
  active?: boolean | null;
  provider: string | null;
  providerId: string | null;
  doctorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminLoginResponse = {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: AdminUser;
  };
};

export type AdminMeResponse = {
  success: boolean;
  message?: string;
  data?: {
    user: AdminUser;
  };
};

function isAdminApiPath(path: string): boolean {
  return path.includes("/api/v1/admin/");
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  return token?.trim() ? token.trim() : null;
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

function buildRequestUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  const normalizedPath = input.startsWith("/") ? input : `/${input}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function resolveRequestPath(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.pathname;
  }

  if (input instanceof Request) {
    return input.url;
  }

  return String(input);
}

export async function adminApiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const requestPath = resolveRequestPath(input);
  const url = buildRequestUrl(
    typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url,
  );

  const headers = new Headers(init.headers);
  const token = getAdminToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });

  if (isAdminApiPath(requestPath) && response.status === 401) {
    clearAdminToken();
  }

  return response;
}

export async function loginAdminRequest(
  email: string,
  password: string,
): Promise<AdminLoginResponse> {
  const response = await adminApiFetch("/api/v1/admin/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as AdminLoginResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? "Login failed");
  }

  if (data.data?.token) {
    setAdminToken(data.data.token);
  }

  return data;
}

export async function fetchCurrentAdmin(): Promise<AdminUser> {
  const response = await adminApiFetch("/api/v1/admin/auth/me");

  const data = (await response.json()) as AdminMeResponse;

  if (!response.ok || !data.success || !data.data?.user) {
    throw new Error(data.message ?? "Authentication required");
  }

  return data.data.user;
}

export async function logoutAdminRequest(): Promise<void> {
  try {
    await adminApiFetch("/api/v1/admin/auth/logout", {
      method: "POST",
    });
  } finally {
    clearAdminToken();
  }
}

export function getAdminInitials(user: AdminUser): string {
  const source = user.name?.trim() || user.email?.trim() || "A";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 1).toUpperCase();
}
