import { API_BASE_URL } from "../config/env";
import type { StaffRole } from "../constants/permissions";

const ADMIN_TOKEN_STORAGE_KEY = "admin_token";
export const ADMIN_LOGIN_CHALLENGE_KEY = "admin_login_challenge";

const PUBLIC_ADMIN_AUTH_PATHS = [
  "/api/v1/admin/auth/login",
  "/api/v1/admin/auth/verify-otp",
  "/api/v1/admin/auth/resend-otp",
  "/api/v1/admin/auth/logout",
] as const;

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: StaffRole;
  isActive: boolean;
  provider: string | null;
  providerId: string | null;
  doctorId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminLoginChallenge = {
  challengeId: string;
  expiresIn: number;
  maskedDestination: string;
  resendAvailableIn: number;
  requestedPath?: string | null;
  createdAt: number;
};

export type AdminLoginChallengeResponse = {
  success: boolean;
  message?: string;
  data?: {
    challengeId: string;
    expiresIn: number;
    maskedDestination: string;
    resendAvailableIn: number;
  };
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

function isPublicAdminAuthPath(path: string): boolean {
  return PUBLIC_ADMIN_AUTH_PATHS.some((publicPath) => path.includes(publicPath));
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

export function saveAdminLoginChallenge(challenge: AdminLoginChallenge): void {
  sessionStorage.setItem(ADMIN_LOGIN_CHALLENGE_KEY, JSON.stringify(challenge));
}

export function getAdminLoginChallenge(): AdminLoginChallenge | null {
  const raw = sessionStorage.getItem(ADMIN_LOGIN_CHALLENGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AdminLoginChallenge;
    if (
      typeof parsed.challengeId !== "string" ||
      typeof parsed.expiresIn !== "number" ||
      typeof parsed.maskedDestination !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      clearAdminLoginChallenge();
      return null;
    }
    return parsed;
  } catch {
    clearAdminLoginChallenge();
    return null;
  }
}

export function clearAdminLoginChallenge(): void {
  sessionStorage.removeItem(ADMIN_LOGIN_CHALLENGE_KEY);
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
  const shouldAttachAdminAuth =
    isAdminApiPath(requestPath) && !isPublicAdminAuthPath(requestPath);
  const token = getAdminToken();

  if (shouldAttachAdminAuth && token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });

  if (shouldAttachAdminAuth && response.status === 401) {
    clearAdminToken();
  }

  return response;
}

export async function loginAdminRequest(
  email: string,
  password: string,
): Promise<AdminLoginChallengeResponse> {
  const response = await adminApiFetch("/api/v1/admin/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as AdminLoginChallengeResponse;

  if (!response.ok || !data.success || !data.data?.challengeId) {
    throw new Error(data.message ?? "Login failed");
  }

  return data;
}

export async function verifyAdminOtpRequest(
  challengeId: string,
  otp: string,
): Promise<AdminLoginResponse> {
  const response = await adminApiFetch("/api/v1/admin/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challengeId, otp }),
  });

  const data = (await response.json()) as AdminLoginResponse;

  if (!response.ok || !data.success || !data.data?.token || !data.data.user) {
    throw new Error(data.message ?? "OTP verification failed");
  }

  setAdminToken(data.data.token);
  clearAdminLoginChallenge();

  return data;
}

export async function resendAdminOtpRequest(
  challengeId: string,
): Promise<AdminLoginChallengeResponse> {
  const response = await adminApiFetch("/api/v1/admin/auth/resend-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ challengeId }),
  });

  const data = (await response.json()) as AdminLoginChallengeResponse;

  if (!response.ok || !data.success || !data.data?.challengeId) {
    throw new Error(data.message ?? "Failed to resend verification code");
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
    clearAdminLoginChallenge();
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
