
export const PREFERRED_TIME_SLOTS = {
  "P-9": {
    label: "PLID (Present at - 9:00 AM)",
    smsLabel: "সকাল ৯ টা",
  },
  "OP-4": {
    label: "Old PLID (Present at - 4:00 PM)",
    smsLabel: "বিকাল ৪ টা",
  },
  "G-5": {
    label: "General Patient (Present at - 5:00 PM)",
    smsLabel: "বিকাল ৫ টা",
  },
} as const;

export type PreferredTimeCode = keyof typeof PREFERRED_TIME_SLOTS;

export function parsePreferredTimeCode(value: unknown): PreferredTimeCode | null {
  if (typeof value !== "string") {
    return null;
  }

  const code = value.trim();
  return code in PREFERRED_TIME_SLOTS ? (code as PreferredTimeCode) : null;
}

export function getPreferredTimeLabel(code: string): string {
  const slot = PREFERRED_TIME_SLOTS[code as PreferredTimeCode];
  return slot?.label ?? code;
}

export function getPreferredTimeSmsLabel(code: PreferredTimeCode): string {
  return PREFERRED_TIME_SLOTS[code].smsLabel;
}

export function toPublicAppointment<T extends { preferredTime: string }>(
  appointment: T,
): Omit<T, "preferredTime" | "attendTime"> & { preferredTime: string } {
  const { attendTime: _attendTime, preferredTime, ...rest } = appointment as T & {
    attendTime?: unknown;
  };

  return {
    ...rest,
    preferredTime: getPreferredTimeLabel(preferredTime),
  };
}

export function toPublicAppointments<T extends { preferredTime: string }>(
  appointments: T[],
): Array<Omit<T, "preferredTime" | "attendTime"> & { preferredTime: string }> {
  return appointments.map(toPublicAppointment);
}
