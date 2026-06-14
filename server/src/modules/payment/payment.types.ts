import type { PreferredTimeCode } from "../appointment/appointment.mapper.js";
import type { SiteRef } from "@prisma/client";

export type PaymentAppointmentPayload = {
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  homeAddress: string;
  problem?: string | null;
  preferredDate: string;
  preferredTime: PreferredTimeCode;
  gender?: string | null;
  siteRef?: SiteRef;
};

export function isPaymentAppointmentPayload(
  value: unknown,
): value is PaymentAppointmentPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.fullName === "string" &&
    typeof payload.phoneNumber === "string" &&
    typeof payload.homeAddress === "string" &&
    typeof payload.preferredDate === "string" &&
    typeof payload.preferredTime === "string"
  );
}
