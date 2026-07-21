"use server";

import { getApiBaseUrl } from "@/lib/api";
import { getMetaCookiesFromHeaders } from "@/lib/metaCookies";
import type {
  SubmitFreeAppointmentPayload,
  SubmitFreeAppointmentResult,
} from "@/types/booking";

type SubmitFreeAppointmentResponse = {
  success: boolean;
  message?: string;
  appointment?: { id: string };
};

export async function submitFreeAppointment(
  payload: SubmitFreeAppointmentPayload,
): Promise<SubmitFreeAppointmentResult> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const metaCookies = await getMetaCookiesFromHeaders();

  const body: Record<string, string> = {
    fullName: payload.fullName.trim(),
    phoneNumber: payload.phoneNumber.trim(),
    homeAddress: payload.homeAddress.trim(),
    preferredDate: payload.preferredDate.trim(),
    preferredTime: payload.preferredTime.trim(),
    age: payload.age?.trim() ?? "",
  };

  const email = payload.email?.trim();
  if (email) {
    body.email = email;
  }

  const problem = payload.problem?.trim();
  if (problem) {
    body.problem = problem;
  }

  if (payload.fbEventId?.trim()) {
    body.fbEventId = payload.fbEventId.trim();
  }

  const fbc = payload.fbc ?? metaCookies.fbc;
  const fbp = payload.fbp ?? metaCookies.fbp;

  if (fbc) {
    body.fbc = fbc;
  }

  if (fbp) {
    body.fbp = fbp;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/client/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as SubmitFreeAppointmentResponse;

  if (!response.ok || !json.success || !json.appointment?.id) {
    throw new Error(json.message ?? "Failed to submit appointment request");
  }

  return { appointmentId: json.appointment.id };
}
