/**
 * Trucare client service – submits appointment records to Trucare API.
 */

import type { Appointment } from "@prisma/client";
import {
  createAxiosClient,
  createClientLogger,
  envIsTrue,
  postJson,
  requireNonEmpty,
  trimTrailingSlashes,
} from "./clients.utils.js";

const DEBUG = envIsTrue("DEBUG_TRUCARE");

const log = createClientLogger(DEBUG, "[trucare.client]");

function getTrucareConfig() {
  const baseUrl = trimTrailingSlashes(process.env.TRUCARE_API_BASE_URL?.trim() || "http://72.62.197.57:8090/ords/trucareapi/api");
  const apiKey = process.env.TRUCARE_X_API_KEY?.trim() || "7ELT0F821XFDGXVKJDR7RSTKJJKLAECX";
  return { baseUrl, apiKey };
}

function requireBaseUrl(baseUrl: string) {
  requireNonEmpty(baseUrl, "TRUCARE_API_BASE_URL is not set");
}

function requireApiKey(apiKey: string) {
  requireNonEmpty(apiKey, "TRUCARE_X_API_KEY is required");
}

const http = createAxiosClient({
  baseUrl: "",
  timeout: 20000,
  requireBaseUrl: () => requireBaseUrl(getTrucareConfig().baseUrl),
  log,
});

export type TrucareAppointmentBody = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  homeAddress: string;
  problem: string | null;
  preferredTime: string;
  appointmentDate: string;
  serialNumber: number;
  modifiedSerialNumber: number | null;
  gender: string | null;
  age: string | null;
  status: string;
  paymentStatus: string | null;
  siteRef: string;
  transactionId: string | null;
  scheduleId: string | null;
  slotId: string | null;
  createdById: string | null;
  updatedById: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TrucareSubmitResult = unknown;

export function isTrucareConfigured(): boolean {
  const { baseUrl, apiKey } = getTrucareConfig();
  return Boolean(baseUrl && apiKey);
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function toTrucareAppointmentBody(appointment: Appointment): TrucareAppointmentBody {
  return {
    id: appointment.id,
    name: appointment.name,
    phone: appointment.phone,
    email: appointment.email,
    homeAddress: appointment.homeAddress,
    problem: appointment.problem,
    preferredTime: appointment.preferredTime,
    appointmentDate: toIsoString(appointment.appointmentDate),
    serialNumber: appointment.serialNumber,
    modifiedSerialNumber: appointment.modifiedSerialNumber,
    gender: appointment.gender,
    age: appointment.age,
    status: appointment.status,
    paymentStatus: appointment.paymentStatus,
    siteRef: appointment.siteRef,
    transactionId: appointment.transactionId,
    scheduleId: appointment.scheduleId,
    slotId: appointment.slotId,
    createdById: appointment.createdById,
    updatedById: appointment.updatedById,
    note: appointment.note,
    createdAt: toIsoString(appointment.createdAt),
    updatedAt: toIsoString(appointment.updatedAt),
  };
}

/**
 * POST {BASE}/appointment with the created appointment record.
 * No-ops when Trucare env is not configured.
 */
export async function submitAppointmentToTrucare(
  appointment: Appointment,
): Promise<TrucareSubmitResult | null> {
  if (!isTrucareConfigured()) {
    log.debug("skip submit — Trucare is not configured");
    return null;
  }

  const { baseUrl, apiKey } = getTrucareConfig();
  requireBaseUrl(baseUrl);
  requireApiKey(apiKey);

  const body = toTrucareAppointmentBody(appointment);

  log.debug("submit appointment", { appointmentId: appointment.id });

  const result = await postJson<TrucareSubmitResult>(
    http,
    `${baseUrl}/appointment`,
    body,
    {
      headers: {
        TRUCARE_X_API_KEY: apiKey,
      },
    },
  );

  log.info("submitted appointment", { appointmentId: appointment.id });
  return result;
}
