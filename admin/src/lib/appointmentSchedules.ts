import type {
  AppointmentSchedule,
  SiteRef,
} from "../types/appointmentSchedule";

const DEFAULT_SITE_REF: SiteRef = "DOCTOR_SHA_ALAM";

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
  siteRef: SiteRef = DEFAULT_SITE_REF,
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
