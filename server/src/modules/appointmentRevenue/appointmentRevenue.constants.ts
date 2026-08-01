import { AppointmentRevenueCategory } from "@prisma/client";
import { BOOTSTRAP_SLOT_DEFAULTS } from "../appointmentSchedule/slotDefaults.bootstrap.js";
import { parsePreferredTimeCode } from "../appointment/appointment.mapper.js";

export const BUSINESS_TIMEZONE = "Asia/Dhaka";
export const REVENUE_CURRENCY = "BDT";

export type RevenueCategoryKey = AppointmentRevenueCategory | "OTHER";

const SLOT_CODE_TO_CATEGORY: Record<string, AppointmentRevenueCategory> = {
  [BOOTSTRAP_SLOT_DEFAULTS[0].code]: AppointmentRevenueCategory.NEW_PLID,
  [BOOTSTRAP_SLOT_DEFAULTS[1].code]: AppointmentRevenueCategory.OLD_PLID,
  [BOOTSTRAP_SLOT_DEFAULTS[2].code]: AppointmentRevenueCategory.GENERAL,
};

export const CATEGORY_SLOT_CODES: Record<AppointmentRevenueCategory, string> = {
  [AppointmentRevenueCategory.NEW_PLID]: BOOTSTRAP_SLOT_DEFAULTS[0].code,
  [AppointmentRevenueCategory.OLD_PLID]: BOOTSTRAP_SLOT_DEFAULTS[1].code,
  [AppointmentRevenueCategory.GENERAL]: BOOTSTRAP_SLOT_DEFAULTS[2].code,
};

export const CATEGORY_LABELS: Record<RevenueCategoryKey, string> = {
  [AppointmentRevenueCategory.NEW_PLID]: "New PLID Patient",
  [AppointmentRevenueCategory.OLD_PLID]: "Old PLID Patient",
  [AppointmentRevenueCategory.GENERAL]: "General Patient",
  OTHER: "Other",
};

export const ORDERED_CATEGORIES: RevenueCategoryKey[] = [
  AppointmentRevenueCategory.NEW_PLID,
  AppointmentRevenueCategory.OLD_PLID,
  AppointmentRevenueCategory.GENERAL,
  "OTHER",
];

export function normalizeSlotCode(value: string | null | undefined): string | null {
  if (value == null) {
    return null;
  }
  const trimmed = value.trim().toUpperCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveRevenueCategory(input: {
  slotCode?: string | null;
  preferredTime?: string | null;
}): RevenueCategoryKey {
  const slotCode = normalizeSlotCode(input.slotCode);
  if (slotCode) {
    const fromSlot = SLOT_CODE_TO_CATEGORY[slotCode];
    return fromSlot ?? "OTHER";
  }

  const preferredCode = parsePreferredTimeCode(input.preferredTime ?? "");
  if (preferredCode) {
    return SLOT_CODE_TO_CATEGORY[preferredCode] ?? "OTHER";
  }

  const normalizedPreferred = normalizeSlotCode(input.preferredTime);
  if (normalizedPreferred) {
    const fromPreferred = SLOT_CODE_TO_CATEGORY[normalizedPreferred];
    return fromPreferred ?? "OTHER";
  }

  return "OTHER";
}
