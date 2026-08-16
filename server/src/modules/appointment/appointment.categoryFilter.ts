import { AppointmentRevenueCategory, type Prisma } from "@prisma/client";
import { BOOTSTRAP_SLOT_DEFAULTS } from "../appointmentSchedule/slotDefaults.bootstrap.js";
import { CATEGORY_SLOT_CODES } from "../appointmentRevenue/appointmentRevenue.constants.js";

export type AppointmentCategoryFilter = AppointmentRevenueCategory;

const VALID_CATEGORIES = new Set<string>(Object.values(AppointmentRevenueCategory));

function normalizeCategoryToken(value: string): AppointmentCategoryFilter | null {
  const trimmed = value.trim().toUpperCase();
  return VALID_CATEGORIES.has(trimmed)
    ? (trimmed as AppointmentCategoryFilter)
    : null;
}

function collectCategoryTokens(raw: unknown): string[] {
  if (raw == null) {
    return [];
  }

  if (Array.isArray(raw)) {
    return raw.flatMap((entry) =>
      typeof entry === "string" ? entry.split(",") : [],
    );
  }

  if (typeof raw === "string") {
    return raw.split(",");
  }

  return [];
}

export type ParseCategoryQueryResult =
  | { ok: true; categories?: AppointmentCategoryFilter[] }
  | { ok: false; message: string };

export function parseCategoryQuery(raw: unknown): ParseCategoryQueryResult {
  const tokens = collectCategoryTokens(raw);

  if (tokens.length === 0) {
    return { ok: true, categories: undefined };
  }

  const categories = [
    ...new Set(
      tokens
        .map(normalizeCategoryToken)
        .filter((category): category is AppointmentCategoryFilter => category != null),
    ),
  ].sort();

  if (categories.length === 0) {
    return { ok: false, message: "Invalid category filter" };
  }

  return { ok: true, categories };
}

function getBootstrapLabelForCode(code: string): string | undefined {
  return BOOTSTRAP_SLOT_DEFAULTS.find((slot) => slot.code === code)?.label;
}

export function buildCategoryWhereClause(
  categories: AppointmentCategoryFilter[],
): Prisma.AppointmentWhereInput {
  const matches = categories.flatMap((category) => {
    const code = CATEGORY_SLOT_CODES[category];
    const label = getBootstrapLabelForCode(code);

    return [
      { preferredTime: code },
      ...(label ? [{ preferredTime: label }] : []),
    ];
  });

  return { OR: matches };
}
