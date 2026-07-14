import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../../config/env";
import { clearAdminToken, getAdminToken } from "../../lib/adminAuth";

function isAdminApiPath(path: string): boolean {
  return path.includes("/api/v1/admin/");
}

const PUBLIC_ADMIN_AUTH_PATHS = [
  "/api/v1/admin/auth/login",
  "/api/v1/admin/auth/verify-otp",
  "/api/v1/admin/auth/resend-otp",
  "/api/v1/admin/auth/logout",
] as const;

function isPublicAdminAuthPath(path: string): boolean {
  return PUBLIC_ADMIN_AUTH_PATHS.some((publicPath) => path.includes(publicPath));
}

function getRequestPath(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { arg }) => {
    const token = getAdminToken();
    const path = getRequestPath(arg);

    if (token && isAdminApiPath(path) && !isPublicAdminAuthPath(path)) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithAdminAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const path = getRequestPath(args);

  if (
    isAdminApiPath(path) &&
    !isPublicAdminAuthPath(path) &&
    result.error?.status === 401
  ) {
    clearAdminToken();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAdminAuth,
  tagTypes: ["Appointment", "AppointmentSchedule", "Blog", "ContactMessage", "SlotDefault", "ActivityLog", "DeleteRequest", "AnalyticsSetting"],
  endpoints: () => ({}),
});
