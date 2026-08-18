import type { SiteRef } from "../../types/appointment";
import { baseApi } from "./baseApi";

export type RevenueCategoryKey =
  | "NEW_PLID"
  | "OLD_PLID"
  | "GENERAL"
  | "OLD_GENERAL"
  | "OTHER";

export type RevenueCategoryRow = {
  key: RevenueCategoryKey;
  slotCode: string | null;
  label: string;
  booked: number;
  attended: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  rescheduled: number;
  fee: number;
  revenue: number;
};

export type AppointmentRevenueSummary = {
  date: string;
  timezone: string;
  siteRef: SiteRef;
  summary: {
    totalAppointments: number;
    booked: number;
    attended: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    rescheduled: number;
    attendanceRate: number;
    totalRevenue: number;
    currency: string;
  };
  categories: RevenueCategoryRow[];
  generatedAt: string;
};

export type AppointmentRevenueFees = {
  siteRef: SiteRef;
  fees: {
    NEW_PLID: number;
    OLD_PLID: number;
    GENERAL: number;
    OLD_GENERAL: number;
  };
  updatedAt: string | null;
};

export type UpdateAppointmentRevenueFeesPayload = {
  siteRef: SiteRef;
  fees: AppointmentRevenueFees["fees"];
};

type SummaryResponse = {
  success: boolean;
  message: string;
  data: AppointmentRevenueSummary;
};

type FeesResponse = {
  success: boolean;
  message: string;
  data: AppointmentRevenueFees;
};

export const appointmentRevenueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentRevenueSummary: builder.query<
      AppointmentRevenueSummary,
      { date: string; siteRef?: SiteRef }
    >({
      query: ({ date, siteRef = "DOCTOR_SHA_ALAM" }) =>
        `/api/v1/admin/appointment-revenue/summary?date=${encodeURIComponent(date)}&siteRef=${encodeURIComponent(siteRef)}`,
      transformResponse: (response: SummaryResponse) => response.data,
      providesTags: [{ type: "AppointmentRevenue", id: "SUMMARY" }],
    }),
    getAppointmentRevenueFees: builder.query<
      AppointmentRevenueFees,
      SiteRef | void
    >({
      query: (siteRef) => {
        const resolvedSiteRef = siteRef ?? "DOCTOR_SHA_ALAM";
        return `/api/v1/admin/appointment-revenue/fees?siteRef=${encodeURIComponent(resolvedSiteRef)}`;
      },
      transformResponse: (response: FeesResponse) => response.data,
      providesTags: [{ type: "AppointmentRevenue", id: "FEES" }],
    }),
    updateAppointmentRevenueFees: builder.mutation<
      AppointmentRevenueFees,
      UpdateAppointmentRevenueFeesPayload
    >({
      query: (body) => ({
        url: "/api/v1/admin/appointment-revenue/fees",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: FeesResponse) => response.data,
      invalidatesTags: [
        { type: "AppointmentRevenue", id: "SUMMARY" },
        { type: "AppointmentRevenue", id: "FEES" },
      ],
    }),
  }),
});

export const {
  useGetAppointmentRevenueSummaryQuery,
  useGetAppointmentRevenueFeesQuery,
  useUpdateAppointmentRevenueFeesMutation,
} = appointmentRevenueApi;
