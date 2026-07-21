import { AppointmentStatus, Prisma } from "@prisma/client";
import type { Response } from "express";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const APPOINTMENT_STATUSES = new Set<string>(Object.values(AppointmentStatus));

export const PLID_SLOT_CODE = "P-9";

export class AppointmentValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "AppointmentValidationError";
  }
}

export function getDayRange(date: Date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return { dayStart, dayEnd };
}

export function parseAppointmentDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    if (DATE_ONLY_REGEX.test(trimmed)) {
      const [year, month, day] = trimmed.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);
      return Number.isNaN(localDate.getTime()) ? null : localDate;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime() < today.getTime();
}

export function isPastOrToday(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.getTime() <= today.getTime();
}

export function requiresFutureAppointmentDate(slotCode: string): boolean {
  return slotCode === PLID_SLOT_CODE;
}

export function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

const ADMIN_NOTE_MAX_LENGTH = 200;

export function parseAdminNote(value: unknown): string | null {
  const text = parseOptionalString(value);
  if (text && text.length > ADMIN_NOTE_MAX_LENGTH) {
    throw new AppointmentValidationError(
      `Note must be ${ADMIN_NOTE_MAX_LENGTH} characters or less`,
    );
  }
  return text;
}

export function parseRequiredString(value: unknown, fieldName: string): string {
  const text = parseOptionalString(value);
  if (!text) {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }
  return text;
}

export function parseEmail(value: unknown): string | null {
  const email = parseOptionalString(value);
  if (email && !EMAIL_REGEX.test(email)) {
    throw new AppointmentValidationError("Invalid email address");
  }
  return email;
}

export function parseFutureAppointmentDate(value: unknown, fieldName: string): Date {
  if (value === null || value === undefined || value === "") {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }

  const date = parseAppointmentDate(value);
  if (!date) {
    throw new AppointmentValidationError(`Invalid ${fieldName}`);
  }
  if (isPastOrToday(date)) {
    throw new AppointmentValidationError("Only future dates are allowed");
  }
  return date;
}

export function parseAppointmentDateForSlot(
  value: unknown,
  slotCode: string,
  fieldName: string,
): Date {
  if (value === null || value === undefined || value === "") {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }

  const date = parseAppointmentDate(value);
  if (!date) {
    throw new AppointmentValidationError(`Invalid ${fieldName}`);
  }

  if (requiresFutureAppointmentDate(slotCode)) {
    if (isPastOrToday(date)) {
      throw new AppointmentValidationError("Only future dates are allowed");
    }
  } else if (isPast(date)) {
    throw new AppointmentValidationError("Past dates are not allowed");
  }

  return date;
}

export function parseAppointmentStatus(value: unknown): AppointmentStatus {
  if (typeof value !== "string" || !APPOINTMENT_STATUSES.has(value)) {
    throw new AppointmentValidationError("Invalid appointment status");
  }
  return value as AppointmentStatus;
}

export function parseMonthYear(month: string | undefined, year: string | undefined) {
  const monthNum = month ? Number(month) : NaN;
  const yearNum = year ? Number(year) : NaN;

  if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
    return null;
  }
  if (!Number.isInteger(yearNum) || yearNum < 2000 || yearNum > 2100) {
    return null;
  }

  return {
    startDate: new Date(yearNum, monthNum - 1, 1),
    endDate: new Date(yearNum, monthNum, 0, 23, 59, 59, 999),
  };
}

export function handleAppointmentError(res: Response, error: unknown, fallbackMessage: string) {
  if (error instanceof AppointmentValidationError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
  }

  console.error(error);
  return res.status(500).json({ success: false, message: fallbackMessage });
}
