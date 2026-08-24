import { AppointmentValidationError } from "../modules/appointment/appointment.utils.js";

export const BUSINESS_TIMEZONE = "Asia/Dhaka";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDateYmd(value: string): boolean {
  if (!DATE_ONLY_REGEX.test(value)) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function getTodayYmdInTimeZone(
  timeZone: string,
  now: Date = new Date(),
): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(now);
}

export function addDaysToYmd(dateYmd: string, deltaDays: number): string {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + deltaDays);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTimezoneOffsetMinutes(timeZone: string, probe: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  }).formatToParts(probe);
  const offsetLabel = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = offsetLabel.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) {
    return 0;
  }
  const sign = match[1] === "+" ? 1 : -1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);
  return sign * (hours * 60 + minutes);
}

function zonedMidnightToUtc(dateYmd: string, timeZone: string): Date {
  const [year, month, day] = dateYmd.split("-").map(Number);
  const probe = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const offsetMinutes = getTimezoneOffsetMinutes(timeZone, probe);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0) - offsetMinutes * 60 * 1000);
}

export function getUtcHalfOpenRangeForBusinessDate(
  dateYmd: string,
  timeZone: string = BUSINESS_TIMEZONE,
): { startUtc: Date; endExclusiveUtc: Date } {
  if (!isValidDateYmd(dateYmd)) {
    throw new AppointmentValidationError("date must be YYYY-MM-DD");
  }

  const startUtc = zonedMidnightToUtc(dateYmd, timeZone);
  const endExclusiveUtc = zonedMidnightToUtc(addDaysToYmd(dateYmd, 1), timeZone);
  return { startUtc, endExclusiveUtc };
}

export function parseOptionalBusinessDate(
  value: unknown,
  timeZone: string = BUSINESS_TIMEZONE,
): string {
  if (value === undefined || value === null || value === "") {
    return getTodayYmdInTimeZone(timeZone);
  }

  if (typeof value !== "string") {
    throw new AppointmentValidationError("date must be YYYY-MM-DD");
  }

  const trimmed = value.trim();
  if (!isValidDateYmd(trimmed)) {
    throw new AppointmentValidationError("date must be YYYY-MM-DD");
  }

  return trimmed;
}
