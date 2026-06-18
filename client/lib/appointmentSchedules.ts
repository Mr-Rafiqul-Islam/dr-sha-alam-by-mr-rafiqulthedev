import { getApiBaseUrl } from "@/lib/api";
import type {
  AppointmentSchedule,
  AppointmentSchedulesListResponse,
} from "@/types/appointmentSchedule";
import type { SlotDefaultsResponse } from "@/types/slotDefaults";

const DEFAULT_SITE_REF = "DOCTOR_SHA_ALAM" as const;

export function parseScheduleDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatScheduleDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getClosedDates(
  schedules: AppointmentSchedule[],
  siteRef: typeof DEFAULT_SITE_REF = DEFAULT_SITE_REF,
): Set<string> {
  const closedDates = new Set<string>();

  for (const schedule of schedules) {
    if (schedule.siteRef !== siteRef) {
      continue;
    }

    if (schedule.isClosed || schedule.status === "INACTIVE") {
      closedDates.add(schedule.date);
    }
  }

  return closedDates;
}

export async function fetchAppointmentSchedules(): Promise<AppointmentSchedule[]> {
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

export async function fetchSlotDefaults(
  siteRef: typeof DEFAULT_SITE_REF = DEFAULT_SITE_REF,
): Promise<SlotDefaultsResponse["data"]> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${apiBaseUrl}/api/v1/client/appointment-schedules/defaults?siteRef=${encodeURIComponent(siteRef)}`,
    { cache: "no-store" },
  );

  const json = (await response.json()) as SlotDefaultsResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to load slot defaults");
  }

  return json.data;
}
