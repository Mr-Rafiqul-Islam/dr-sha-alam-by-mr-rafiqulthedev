import { ScheduleStatus, SiteRef } from "@prisma/client";
import { AppointmentValidationError } from "../appointment/appointment.utils.js";

const SITE_REFS = new Set<string>(Object.values(SiteRef));
const SCHEDULE_STATUSES = new Set<string>(Object.values(ScheduleStatus));
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export type SlotInput = {
  code: string;
  label: string;
  smsLabel?: string | null;
  startTime: string;
  endTime?: string | null;
  seatLimit: number;
  isActive?: boolean;
};

export function parseSiteRef(value: unknown, fallback: SiteRef = SiteRef.DOCTOR_SHA_ALAM): SiteRef {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value !== "string" || !SITE_REFS.has(value)) {
    throw new AppointmentValidationError("Invalid siteRef");
  }
  return value as SiteRef;
}

export function parseScheduleStatus(value: unknown): ScheduleStatus {
  if (typeof value !== "string" || !SCHEDULE_STATUSES.has(value)) {
    throw new AppointmentValidationError("Invalid schedule status");
  }
  return value as ScheduleStatus;
}

export function parseOptionalScheduleStatus(value: unknown): ScheduleStatus | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return parseScheduleStatus(value);
}

export function parseScheduleDate(value: unknown, fieldName = "date"): string {
  if (value === null || value === undefined || value === "") {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }
  if (typeof value !== "string") {
    throw new AppointmentValidationError(`Invalid ${fieldName}`);
  }
  const date = value.trim();
  if (!DATE_ONLY_REGEX.test(date)) {
    throw new AppointmentValidationError(`${fieldName} must be YYYY-MM-DD`);
  }
  return date;
}

export function parseOptionalScheduleDate(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  return parseScheduleDate(value, fieldName);
}

export function parseSlotInput(value: unknown, index: number): SlotInput {
  if (!value || typeof value !== "object") {
    throw new AppointmentValidationError(`Invalid slot at index ${index}`);
  }
  const slot = value as Record<string, unknown>;

  const code = typeof slot.code === "string" ? slot.code.trim() : "";
  const label = typeof slot.label === "string" ? slot.label.trim() : "";
  const startTime = typeof slot.startTime === "string" ? slot.startTime.trim() : "";

  if (!code) {
    throw new AppointmentValidationError(`Slot at index ${index}: code is required`);
  }
  if (!label) {
    throw new AppointmentValidationError(`Slot at index ${index}: label is required`);
  }
  if (!startTime) {
    throw new AppointmentValidationError(`Slot at index ${index}: startTime is required`);
  }

  const seatLimit = Number(slot.seatLimit);
  if (!Number.isInteger(seatLimit) || seatLimit < 0) {
    throw new AppointmentValidationError(
      `Slot at index ${index}: seatLimit must be a non-negative integer`,
    );
  }

  const smsLabel =
    typeof slot.smsLabel === "string" && slot.smsLabel.trim()
      ? slot.smsLabel.trim()
      : null;
  const endTime =
    typeof slot.endTime === "string" && slot.endTime.trim()
      ? slot.endTime.trim()
      : null;
  const isActive = slot.isActive === undefined ? true : Boolean(slot.isActive);

  return { code, label, smsLabel, startTime, endTime, seatLimit, isActive };
}

export function parseSlotsInput(
  value: unknown,
  options?: { allowEmpty?: boolean },
): SlotInput[] {
  if (!Array.isArray(value)) {
    throw new AppointmentValidationError("At least one slot is required");
  }
  if (value.length === 0 && !options?.allowEmpty) {
    throw new AppointmentValidationError("At least one slot is required");
  }
  return value.map((slot, index) => parseSlotInput(slot, index));
}

export function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  return Boolean(value);
}

export function parseOptionalString(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new AppointmentValidationError("Invalid string value");
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
