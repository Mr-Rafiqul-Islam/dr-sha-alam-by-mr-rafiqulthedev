import type {
  Appointment,
  AppointmentExtraFilter,
  AppointmentFormData,
  AppointmentPaymentStatus,
  AppointmentStatus,
  CreateAppointmentPayload,
  SiteRef,
} from "../types/appointment";
import type { BadgeVariant } from "../components/common/Badge";
import {
  toAppointmentFeeDiscountInput,
} from "./discount";

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
    NOT_ATTENDED: "Not Attended",
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
    NOT_ATTENDED: "notAttended",
    CANCEL: "cancel",
    RESCHEDULED: "rescheduled",
  };

  return variants[status];
}

export function getPaymentStatusLabel(
  paymentStatus: AppointmentPaymentStatus | null | undefined,
): string {
  if (paymentStatus == null) {
    return "—";
  }

  const labels: Record<AppointmentPaymentStatus, string> = {
    PENDING: "Pending",
    SUCCESS: "Success",
    CANCEL: "Cancelled",
  };

  return labels[paymentStatus];
}

export function getPaymentStatusBadgeVariant(
  paymentStatus: AppointmentPaymentStatus | null | undefined,
): BadgeVariant {
  if (paymentStatus == null) {
    return "neutral";
  }

  const variants: Record<AppointmentPaymentStatus, BadgeVariant> = {
    PENDING: "pending",
    SUCCESS: "confirmed",
    CANCEL: "cancel",
  };

  return variants[paymentStatus];
}

export const APPOINTMENT_STATUS_OPTIONS: Array<{
  value: AppointmentStatus;
  label: string;
}> = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "ATTEND", label: "Attended" },
    { value: "NOT_ATTENDED", label: "Not Attended" },
    { value: "RESCHEDULED", label: "Rescheduled" },
    { value: "CANCEL", label: "Cancelled" },
  ];

export function toCreateAppointmentPayload(
  data: AppointmentFormData,
): CreateAppointmentPayload {
  const discountInput = toAppointmentFeeDiscountInput(data.discount);
  const isOldGeneral = data.preferredTime === OLD_GENERAL_PREFERRED_TIME;

  return {
    fullName: data.patientName.trim(),
    phoneNumber: data.phone.trim(),
    homeAddress: data.homeAddress.trim(),
    preferredDate: data.preferredDate,
    preferredTime: isOldGeneral ? GENERAL_SLOT_CODE : data.preferredTime,
    ...(isOldGeneral ? { feeCategory: "OLD_GENERAL" } : {}),
    ...(data.email.trim() ? { email: data.email.trim() } : {}),
    ...(data.age?.trim() ? { age: data.age.trim() } : {}),
    ...(data.symptoms?.trim() ? { problem: data.symptoms.trim() } : {}),
    ...(discountInput ? { feesDiscount: [discountInput] } : {}),
  };
}

export function isFutureDateYmd(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const selected = new Date(year, month - 1, day);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() > today.getTime();
}

export function getTomorrowYmd(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayYmd(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const PLID_SLOT_CODE = "P-9";
export const GENERAL_SLOT_CODE = "G-5";
export const OLD_GENERAL_PREFERRED_TIME = "OLD_GENERAL";

export function requiresFutureAppointmentDate(slotCode: string): boolean {
  return slotCode === PLID_SLOT_CODE;
}

export function isPastDateYmd(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const selected = new Date(year, month - 1, day);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() < today.getTime();
}

export function isValidPreferredDateYmd(value: string): boolean {
  return !isPastDateYmd(value);
}

export function getMinPreferredDateYmd(): string {
  return getTodayYmd();
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
  todayAttended: number;
};

export function formatAppointmentDateLabel(ymd: string): string {
  const [year, month, day] = ymd.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) {
    return ymd;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function computeAppointmentStats(
  appointments: Appointment[],
  options?: { dateYmd?: string },
): AppointmentStats {
  const referenceYmd = options?.dateYmd ?? getTodayYmd();
  const scopedAppointments = options?.dateYmd
    ? appointments.filter((appointment) =>
      isSameCalendarDay(appointment.appointmentDate, options.dateYmd!),
    )
    : appointments;

  return scopedAppointments.reduce<AppointmentStats>(
    (stats, appointment) => {
      stats.total += 1;

      const isReferenceDay = isSameCalendarDay(
        appointment.appointmentDate,
        referenceYmd,
      );

      if (isReferenceDay) {
        stats.today += 1;
      }

      if (appointment.status === "PENDING") {
        stats.pending += 1;
      }

      if (appointment.status === "ATTEND") {
        stats.completed += 1;
      }

      if (isReferenceDay && appointment.status === "ATTEND") {
        stats.todayAttended += 1;
      }

      return stats;
    },
    { total: 0, today: 0, pending: 0, completed: 0, todayAttended: 0 },
  );
}

export type AppointmentFilterState = {
  search: string;
  date: string;
  todayOnly: boolean;
  extraFilters: AppointmentExtraFilter[];
};

function matchesExtraFilter(
  appointment: Appointment,
  filter: AppointmentExtraFilter,
): boolean {
  switch (filter) {
    case "INJECTION":
      return Boolean(appointment.injectionName?.trim());
    case "SURGERY":
      return Boolean(appointment.operationName?.trim());
    case "ATTENDED":
      return appointment.status === "ATTEND";
    case "NOT_ATTENDED":
      return appointment.status === "NOT_ATTENDED";
    default:
      return false;
  }
}

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

    if (filters.extraFilters.length > 0) {
      const matchesAnyExtraFilter = filters.extraFilters.some((filter) =>
        matchesExtraFilter(appointment, filter),
      );

      if (!matchesAnyExtraFilter) {
        return false;
      }
    }

    return true;
  });
}

function escapeCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function exportAppointmentsCsv(appointments: Appointment[]): void {
  const headers = [
    "ID",
    "Patient Name",
    "Phone",
    "Email",
    "Address",
    "Appointment Date",
    "Serial",
    "Problems",
  ];

  const rows = appointments.map((appointment) => [
    appointment.id,
    appointment.name,
    appointment.phone,
    appointment.email ?? "",
    appointment.homeAddress,
    appointment.appointmentDate,
    String(appointment.serialNumber),
    appointment.problem ?? "",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `appointments-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
