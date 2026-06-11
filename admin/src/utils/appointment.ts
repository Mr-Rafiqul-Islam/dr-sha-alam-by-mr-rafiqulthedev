import type {
  Appointment,
  AppointmentStatus,
  SiteRef,
} from "../types/appointment";
import type { BadgeVariant } from "../components/common/Badge";

export function formatNullable(value: string | null | undefined): string {
  if (value == null || value.trim() === "") {
    return "—";
  }

  return value;
}

export function getSiteRefLabel(siteRef: SiteRef): string {
  const labels: Record<SiteRef, string> = {
    DOCTOR_SHA_ALAM: "Dr. Sha Alam",
    TRUE_CARE_HELLING_CENTER: "True Care Helling Center",
  };

  return labels[siteRef];
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatAppointmentDateTime(appointment: Appointment): string {
  const date = new Date(appointment.appointmentDate);
  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${dateLabel} - ${appointment.preferredTime}`;
}

export function getStatusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    ATTEND: "Attended",
    CANCEL: "Cancelled",
    RESCHEDULED: "Rescheduled",
  };

  return labels[status];
}

export function getStatusBadgeVariant(status: AppointmentStatus): BadgeVariant {
  const variants: Record<AppointmentStatus, BadgeVariant> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    ATTEND: "attend",
    CANCEL: "cancel",
    RESCHEDULED: "rescheduled",
  };

  return variants[status];
}

export const APPOINTMENT_STATUS_OPTIONS: Array<{
  value: AppointmentStatus;
  label: string;
}> = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ATTEND", label: "Attended" },
  { value: "RESCHEDULED", label: "Rescheduled" },
  { value: "CANCEL", label: "Cancelled" },
];

export function getTodayYmd(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameCalendarDay(isoDate: string, ymd: string): boolean {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` === ymd;
}

export type AppointmentStats = {
  total: number;
  today: number;
  pending: number;
  completed: number;
};

export function computeAppointmentStats(
  appointments: Appointment[],
): AppointmentStats {
  const todayYmd = getTodayYmd();

  return appointments.reduce<AppointmentStats>(
    (stats, appointment) => {
      stats.total += 1;

      if (isSameCalendarDay(appointment.appointmentDate, todayYmd)) {
        stats.today += 1;
      }

      if (appointment.status === "PENDING") {
        stats.pending += 1;
      }

      if (appointment.status === "ATTEND") {
        stats.completed += 1;
      }

      return stats;
    },
    { total: 0, today: 0, pending: 0, completed: 0 },
  );
}

export type AppointmentFilterState = {
  search: string;
  date: string;
  todayOnly: boolean;
};

export function filterAppointments(
  appointments: Appointment[],
  filters: AppointmentFilterState,
): Appointment[] {
  const searchQuery = filters.search.trim().toLowerCase();
  const effectiveDate = filters.todayOnly ? getTodayYmd() : filters.date;

  return appointments.filter((appointment) => {
    if (searchQuery) {
      const haystack = [
        appointment.name,
        appointment.phone,
        appointment.email ?? "",
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(searchQuery)) {
        return false;
      }
    }

    if (effectiveDate && !isSameCalendarDay(appointment.appointmentDate, effectiveDate)) {
      return false;
    }

    return true;
  });
}
