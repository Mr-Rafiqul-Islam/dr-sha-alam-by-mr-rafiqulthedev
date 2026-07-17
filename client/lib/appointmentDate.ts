export const PLID_SLOT_CODE = "P-9";

export function getTodayYmd(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTomorrowYmd(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function requiresFutureAppointmentDate(slotCode: string): boolean {
  return slotCode === PLID_SLOT_CODE;
}

export function isFutureDateYmd(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const selected = new Date(year, month - 1, day);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() > today.getTime();
}

export function isPastDateYmd(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const selected = new Date(year, month - 1, day);
  selected.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selected.getTime() < today.getTime();
}

export function isValidPreferredDateYmd(value: string, slotCode: string): boolean {
  if (requiresFutureAppointmentDate(slotCode)) {
    return isFutureDateYmd(value);
  }

  return !isPastDateYmd(value);
}

export function getMinPreferredDateYmd(slotCode: string): string {
  if (!slotCode || requiresFutureAppointmentDate(slotCode)) {
    return getTomorrowYmd();
  }

  return getTodayYmd();
}

export function getPreferredDateValidationMessage(slotCode: string): string {
  return requiresFutureAppointmentDate(slotCode)
    ? "PLID appointments must be scheduled for a future date"
    : "Past dates are not allowed";
}
