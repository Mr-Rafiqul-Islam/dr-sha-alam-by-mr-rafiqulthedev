import type { Appointment } from "../types/appointment";

export const getEffectiveSerialNumber = (
  appointment: Pick<
    Appointment,
    "serialNumber" | "modifiedSerialNumber" | "effectiveSerialNumber"
  >,
): number =>
  appointment.effectiveSerialNumber ??
  appointment.modifiedSerialNumber ??
  appointment.serialNumber;

export function formatSerialDisplay(serial: number): string {
  return `#${String(serial).padStart(2, "0")}`;
}

export function isSerialModified(appointment: Pick<Appointment, "modifiedSerialNumber">): boolean {
  return appointment.modifiedSerialNumber != null;
}

export function canModifySerial(status: Appointment["status"]): boolean {
  return status !== "CANCEL" && status !== "RESCHEDULED";
}
