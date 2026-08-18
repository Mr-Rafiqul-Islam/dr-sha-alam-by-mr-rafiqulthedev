import {
  AppointmentRevenueCategory,
  AppointmentStatus,
  Prisma,
  SiteRef,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import {
  BUSINESS_TIMEZONE,
  CATEGORY_LABELS,
  CATEGORY_SLOT_CODES,
  emptyFeesByCategory,
  ORDERED_CATEGORIES,
  resolveRevenueCategory,
  REVENUE_CURRENCY,
  type RevenueCategoryKey,
} from "./appointmentRevenue.constants.js";
import type {
  AppointmentRevenueFeesData,
  AppointmentRevenueSummaryData,
  AppointmentRowForRevenue,
  CategoryCounts,
  RevenueCategoryRow,
} from "./appointmentRevenue.types.js";
import type { ParsedRevenueFees } from "./appointmentRevenue.validation.js";
import {
  getTodayYmdInTimeZone,
  getUtcHalfOpenRangeForBusinessDate,
} from "../../utils/bangladeshDate.js";

const BOOKED_STATUSES = new Set<AppointmentStatus>([
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.ATTEND,
]);

function emptyCounts(): CategoryCounts {
  return {
    booked: 0,
    attended: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    rescheduled: 0,
  };
}

function createCategoryCountMap(): Record<RevenueCategoryKey, CategoryCounts> {
  return {
    [AppointmentRevenueCategory.NEW_PLID]: emptyCounts(),
    [AppointmentRevenueCategory.OLD_PLID]: emptyCounts(),
    [AppointmentRevenueCategory.GENERAL]: emptyCounts(),
    [AppointmentRevenueCategory.OLD_GENERAL]: emptyCounts(),
    OTHER: emptyCounts(),
  };
}

export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

export function decimalToNumber(value: Prisma.Decimal | number | string): number {
  if (value instanceof Prisma.Decimal) {
    return roundToTwoDecimals(value.toNumber());
  }
  return roundToTwoDecimals(Number(value));
}

export function aggregateAppointmentRevenue(
  rows: AppointmentRowForRevenue[],
  feesByCategory: Record<AppointmentRevenueCategory, number>,
): Omit<AppointmentRevenueSummaryData, "date" | "timezone" | "siteRef" | "generatedAt"> {
  const categoryCounts = createCategoryCountMap();
  const summary = emptyCounts();

  for (const row of rows) {
    const category = resolveRevenueCategory({
      feeCategory: row.feeCategory,
      slotCode: row.slot?.code,
      preferredTime: row.preferredTime,
    });
    const bucket = categoryCounts[category];

    switch (row.status) {
      case AppointmentStatus.PENDING:
        bucket.pending += 1;
        bucket.booked += 1;
        summary.pending += 1;
        summary.booked += 1;
        break;
      case AppointmentStatus.CONFIRMED:
        bucket.confirmed += 1;
        bucket.booked += 1;
        summary.confirmed += 1;
        summary.booked += 1;
        break;
      case AppointmentStatus.ATTEND:
        bucket.attended += 1;
        bucket.booked += 1;
        summary.attended += 1;
        summary.booked += 1;
        break;
      case AppointmentStatus.CANCEL:
        bucket.cancelled += 1;
        summary.cancelled += 1;
        break;
      case AppointmentStatus.RESCHEDULED:
        bucket.rescheduled += 1;
        summary.rescheduled += 1;
        break;
      default:
        break;
    }
  }

  const attendanceRate =
    summary.booked > 0
      ? roundToTwoDecimals((summary.attended / summary.booked) * 100)
      : 0;

  const categories: RevenueCategoryRow[] = ORDERED_CATEGORIES.map((key) => {
    const counts = categoryCounts[key];
    const fee =
      key === "OTHER"
        ? 0
        : roundToTwoDecimals(feesByCategory[key as AppointmentRevenueCategory] ?? 0);
    const revenue =
      key === "OTHER" ? 0 : roundToTwoDecimals(counts.attended * fee);

    return {
      key,
      slotCode: key === "OTHER" ? null : CATEGORY_SLOT_CODES[key],
      label: CATEGORY_LABELS[key],
      ...counts,
      fee,
      revenue,
    };
  });

  const totalRevenue = roundToTwoDecimals(
    categories.reduce((sum, category) => sum + category.revenue, 0),
  );

  return {
    summary: {
      totalAppointments: summary.pending + summary.confirmed + summary.attended + summary.cancelled + summary.rescheduled,
      booked: summary.booked,
      attended: summary.attended,
      pending: summary.pending,
      confirmed: summary.confirmed,
      cancelled: summary.cancelled,
      rescheduled: summary.rescheduled,
      attendanceRate,
      totalRevenue,
      currency: REVENUE_CURRENCY,
    },
    categories,
  };
}

export async function loadFeesByCategory(
  siteRef: SiteRef,
): Promise<Record<AppointmentRevenueCategory, number>> {
  const rows = await prisma.appointmentRevenueFee.findMany({
    where: { siteRef, isActive: true },
    select: { category: true, fee: true },
  });

  const fees = emptyFeesByCategory();

  for (const row of rows) {
    fees[row.category] = decimalToNumber(row.fee);
  }

  return fees;
}

export function consultationFeeForResolvedCategory(
  category: RevenueCategoryKey,
  feesByCategory: Record<AppointmentRevenueCategory, number>,
): number {
  if (category === "OTHER") {
    return 0;
  }
  return roundToTwoDecimals(feesByCategory[category] ?? 0);
}

export function resolveAppointmentConsultationFee(
  appointment: {
    feeCategory?: AppointmentRevenueCategory | null;
    preferredTime: string;
    slot?: { code: string } | null;
  },
  feesByCategory: Record<AppointmentRevenueCategory, number>,
): number {
  const category = resolveRevenueCategory({
    feeCategory: appointment.feeCategory,
    slotCode: appointment.slot?.code,
    preferredTime: appointment.preferredTime,
  });
  return consultationFeeForResolvedCategory(category, feesByCategory);
}

export async function withConsultationFees<
  T extends {
    siteRef: SiteRef;
    feeCategory?: AppointmentRevenueCategory | null;
    preferredTime: string;
    slot?: { code: string } | null;
  },
>(
  appointments: T[],
): Promise<
  Array<
    T & {
      consultationFee: number;
      resolvedFeeCategory: Exclude<RevenueCategoryKey, "OTHER"> | null;
    }
  >
> {
  const siteRefs = [...new Set(appointments.map((appointment) => appointment.siteRef))];
  const feesBySite = new Map<SiteRef, Record<AppointmentRevenueCategory, number>>();

  await Promise.all(
    siteRefs.map(async (siteRef) => {
      feesBySite.set(siteRef, await loadFeesByCategory(siteRef));
    }),
  );

  return appointments.map((appointment) => {
    const fees = feesBySite.get(appointment.siteRef) ?? emptyFeesByCategory();
    const category = resolveRevenueCategory({
      feeCategory: appointment.feeCategory,
      slotCode: appointment.slot?.code,
      preferredTime: appointment.preferredTime,
    });

    return {
      ...appointment,
      consultationFee: consultationFeeForResolvedCategory(category, fees),
      resolvedFeeCategory: category === "OTHER" ? null : category,
    };
  });
}

export async function getAppointmentRevenueSummary(params: {
  dateYmd: string;
  siteRef: SiteRef;
  pendingDeleteWhere: Record<string, unknown>;
}): Promise<AppointmentRevenueSummaryData> {
  const { startUtc, endExclusiveUtc } = getUtcHalfOpenRangeForBusinessDate(
    params.dateYmd,
    BUSINESS_TIMEZONE,
  );

  const [rows, feesByCategory] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        ...params.pendingDeleteWhere,
        siteRef: params.siteRef,
        appointmentDate: {
          gte: startUtc,
          lt: endExclusiveUtc,
        },
      },
      select: {
        status: true,
        preferredTime: true,
        feeCategory: true,
        slot: { select: { code: true } },
      },
    }),
    loadFeesByCategory(params.siteRef),
  ]);

  const aggregated = aggregateAppointmentRevenue(rows, feesByCategory);

  return {
    date: params.dateYmd,
    timezone: BUSINESS_TIMEZONE,
    siteRef: params.siteRef,
    ...aggregated,
    generatedAt: new Date().toISOString(),
  };
}

export async function getAppointmentRevenueFees(
  siteRef: SiteRef,
): Promise<AppointmentRevenueFeesData> {
  const rows = await prisma.appointmentRevenueFee.findMany({
    where: { siteRef, isActive: true },
    orderBy: { category: "asc" },
  });

  const fees = emptyFeesByCategory();

  let updatedAt: string | null = null;

  for (const row of rows) {
    fees[row.category] = decimalToNumber(row.fee);
    if (!updatedAt || row.updatedAt.toISOString() > updatedAt) {
      updatedAt = row.updatedAt.toISOString();
    }
  }

  return {
    siteRef,
    fees,
    updatedAt,
  };
}

export async function updateAppointmentRevenueFees(params: {
  siteRef: SiteRef;
  fees: ParsedRevenueFees;
}): Promise<{
  data: AppointmentRevenueFeesData;
  oldFees: AppointmentRevenueFeesData["fees"];
}> {
  const oldFeesData = await getAppointmentRevenueFees(params.siteRef);

  await prisma.$transaction(
    Object.values(AppointmentRevenueCategory).map((category) =>
      prisma.appointmentRevenueFee.upsert({
        where: {
          siteRef_category: {
            siteRef: params.siteRef,
            category,
          },
        },
        create: {
          siteRef: params.siteRef,
          category,
          fee: new Prisma.Decimal(params.fees[category].toFixed(2)),
          isActive: true,
        },
        update: {
          fee: new Prisma.Decimal(params.fees[category].toFixed(2)),
          isActive: true,
        },
      }),
    ),
  );

  const data = await getAppointmentRevenueFees(params.siteRef);
  return { data, oldFees: oldFeesData.fees };
}

export function getDefaultBusinessDateYmd(): string {
  return getTodayYmdInTimeZone(BUSINESS_TIMEZONE);
}

export { BOOKED_STATUSES };
