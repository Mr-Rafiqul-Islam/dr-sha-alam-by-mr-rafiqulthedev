export const getEffectiveSerialNumber = (appointment: {
  serialNumber: number;
  modifiedSerialNumber?: number | null;
  effectiveSerialNumber?: number;
}): number =>
  appointment.effectiveSerialNumber ??
  appointment.modifiedSerialNumber ??
  appointment.serialNumber;

export function formatSerialDisplay(serial: number): string {
  return `#${String(serial).padStart(2, "0")}`;
}
