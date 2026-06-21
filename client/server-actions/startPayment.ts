"use server";

import { getApiBaseUrl, getDefaultDoctorId } from "@/lib/api";
import type { StartPaymentPayload, StartPaymentResult } from "@/types/booking";

type StartPaymentResponse = {
  success: boolean;
  url?: string;
  tranId?: string;
  amount?: number;
  message?: string;
};

export async function startPayment(
  payload: StartPaymentPayload,
): Promise<StartPaymentResult> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const body: Record<string, string> = {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    homeAddress: payload.homeAddress.trim(),
    preferredTime: payload.preferredTime.trim(),
    appointmentDate: payload.appointmentDate.trim(),
    siteRef: payload.siteRef.trim(),
  };

  const doctorId = getDefaultDoctorId();
  if (doctorId) {
    body.doctorId = doctorId;
  }

  const email = payload.email?.trim();
  if (email) {
    body.email = email;
  }

  const gender = payload.gender?.trim();
  if (gender) {
    body.gender = gender;
  }

  const problem = payload.problem?.trim();
  if (problem) {
    body.problem = problem;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/payment/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as StartPaymentResponse;

  if (!response.ok || !json.success || !json.url) {
    throw new Error(json.message ?? "Failed to start payment");
  }

  return {
    url: json.url,
    tranId: json.tranId ?? "",
    amount: json.amount ?? 0,
  };
}
