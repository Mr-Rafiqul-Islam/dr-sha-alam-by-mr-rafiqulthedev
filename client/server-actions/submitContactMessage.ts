"use server";

import { getApiBaseUrl } from "@/lib/api";
import type {
  ContactMessage,
  SubmitContactMessagePayload,
  SubmitContactMessageResult,
} from "@/types/contact";

type SubmitContactMessageResponse = {
  success: boolean;
  message?: string;
  data?: ContactMessage;
};

export async function submitContactMessage(
  payload: SubmitContactMessagePayload,
): Promise<SubmitContactMessageResult> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const body: Record<string, string> = {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    subject: payload.subject.trim(),
  };

  const message = payload.message?.trim();
  if (message) {
    body.message = message;
  }

  const email = payload.email?.trim();
  if (email) {
    body.email = email;
  }

  const response = await fetch(`${apiBaseUrl}/api/v1/client/contact-messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as SubmitContactMessageResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to submit contact message");
  }

  return {
    success: true,
    message: json.message ?? "Contact message submitted successfully",
    data: json.data,
  };
}
