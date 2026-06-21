"use server";

import { getApiBaseUrl } from "@/lib/api";
import type {
  AppointmentSchedule,
  AppointmentSchedulesListResponse,
} from "@/types/appointmentSchedule";

export async function getAppointmentSchedules(): Promise<AppointmentSchedule[]> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${apiBaseUrl}/api/v1/client/appointment-schedules`,
    { cache: "no-store" },
  );

  const json = (await response.json()) as AppointmentSchedulesListResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to load appointment schedules");
  }

  return json.data;
}
