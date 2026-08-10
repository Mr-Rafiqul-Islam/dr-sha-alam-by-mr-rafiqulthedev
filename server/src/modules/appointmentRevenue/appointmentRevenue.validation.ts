import { AppointmentRevenueCategory } from "@prisma/client";
import { AppointmentValidationError } from "../appointment/appointment.utils.js";
import { parseSiteRef } from "../appointmentSchedule/appointmentSchedule.validation.js";

const FEE_MIN = 0;
const FEE_MAX = 1_000_000;

export type ParsedRevenueFees = Record<AppointmentRevenueCategory, number>;

export function parseRevenueFeeValue(value: unknown, fieldName: string): number {
  if (value === null || value === undefined || value === "") {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }

  const raw =
    typeof value === "number"
      ? value.toString()
      : typeof value === "string"
        ? value.trim()
        : "";

  if (!raw) {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }

  if (raw.includes(".")) {
    const [, decimals = ""] = raw.split(".");
    if (decimals.length > 2) {
      throw new AppointmentValidationError(`${fieldName} must have at most two decimal places`);
    }
  }

  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) {
    throw new AppointmentValidationError(`${fieldName} must be a valid number`);
  }

  if (numeric < FEE_MIN) {
    throw new AppointmentValidationError(`${fieldName} must be at least ${FEE_MIN}`);
  }

  if (numeric > FEE_MAX) {
    throw new AppointmentValidationError(`${fieldName} must be at most ${FEE_MAX}`);
  }

  return Math.round(numeric * 100) / 100;
}

export function parseRevenueFeesBody(body: unknown): {
  siteRef: ReturnType<typeof parseSiteRef>;
  fees: ParsedRevenueFees;
} {
  if (!body || typeof body !== "object") {
    throw new AppointmentValidationError("Request body is required");
  }

  const payload = body as Record<string, unknown>;
  const siteRef = parseSiteRef(payload.siteRef);
  const feesInput = payload.fees;

  if (!feesInput || typeof feesInput !== "object") {
    throw new AppointmentValidationError("fees object is required");
  }

  const feesRecord = feesInput as Record<string, unknown>;
  const categories = Object.values(AppointmentRevenueCategory);

  const fees = {} as ParsedRevenueFees;
  for (const category of categories) {
    if (!(category in feesRecord)) {
      throw new AppointmentValidationError(`fees.${category} is required`);
    }
    fees[category] = parseRevenueFeeValue(
      feesRecord[category],
      `fees.${category}`,
    );
  }

  return { siteRef, fees };
}

export { parseSiteRef };
