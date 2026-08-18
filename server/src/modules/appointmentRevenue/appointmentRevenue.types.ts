import type { SiteRef, AppointmentRevenueCategory } from "@prisma/client";
import type { RevenueCategoryKey } from "./appointmentRevenue.constants.js";

export type CategoryCounts = {
  booked: number;
  attended: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  rescheduled: number;
};

export type RevenueSummaryCounts = CategoryCounts & {
  totalAppointments: number;
  attendanceRate: number;
  totalRevenue: number;
};

export type RevenueCategoryRow = CategoryCounts & {
  key: RevenueCategoryKey;
  slotCode: string | null;
  label: string;
  fee: number;
  revenue: number;
};

export type AppointmentRevenueSummaryData = {
  date: string;
  timezone: string;
  siteRef: SiteRef;
  summary: RevenueSummaryCounts & { currency: string };
  categories: RevenueCategoryRow[];
  generatedAt: string;
};

export type AppointmentRevenueFeesData = {
  siteRef: SiteRef;
  fees: Record<Exclude<RevenueCategoryKey, "OTHER">, number>;
  updatedAt: string | null;
};

export type AppointmentRowForRevenue = {
  status: string;
  preferredTime: string;
  feeCategory?: AppointmentRevenueCategory | null;
  slot: { code: string } | null;
};
