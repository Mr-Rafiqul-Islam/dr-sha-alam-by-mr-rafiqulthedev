"use server";

import { getApiBaseUrl } from "@/lib/api";
import type { SubmitFreeAppointmentPayload } from "@/types/booking";

type SubmitFreeAppointmentResponse = {
  success: boolean;
  message?: string;
};

export async function submitFreeAppointment(
  payload: SubmitFreeAppointmentPayload,
): Promise<void> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const body: Record<string, string> = {
    fullName: payload.fullName.trim(),
    phoneNumber: payload.phoneNumber.trim(),
    homeAddress: payload.homeAddress.trim(),
    preferredDate: payload.preferredDate.trim(),
    preferredTime: payload.preferredTime.trim(),
  };

  const email = payload.email?.trim();
  if (email) {
    body.email = email;
  }

  const problem = payload.problem?.trim();
  if (problem) {
    body.problem = problem;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/client/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as SubmitFreeAppointmentResponse;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? "Failed to submit appointment request");
  }
}
