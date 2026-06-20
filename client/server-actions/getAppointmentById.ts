"use server";

import { getApiBaseUrl } from "@/lib/api";
import type { PublicAppointmentSummary } from "@/types/booking";

type GetAppointmentByIdResponse = {
  success: boolean;
  appointment?: PublicAppointmentSummary;
  message?: string;
};

export async function getAppointmentById(
  id: string,
): Promise<PublicAppointmentSummary> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${apiBaseUrl}/api/v1/client/appointments/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  const json = (await response.json()) as GetAppointmentByIdResponse;

  if (!response.ok || !json.success || !json.appointment) {
    throw new Error(json.message ?? "Appointment not found");
  }

  return json.appointment;
}
