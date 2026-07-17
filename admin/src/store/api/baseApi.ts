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

function getRequestPath(args: string | FetchArgs): string {
  return typeof args === "string" ? args : args.url;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAdminToken();

    // Attach for all API calls so staff creates on client routes
    // (e.g. POST /api/v1/client/appointments) still record createdBy.
    if (token) {
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

  if (isAdminApiPath(getRequestPath(args)) && result.error?.status === 401) {
    clearAdminToken();
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAdminAuth,
  tagTypes: ["Appointment", "AppointmentSchedule", "Blog", "ContactMessage", "SlotDefault", "ActivityLog", "DeleteRequest", "AnalyticsSetting", "AdminUser"],
  endpoints: () => ({}),
});
