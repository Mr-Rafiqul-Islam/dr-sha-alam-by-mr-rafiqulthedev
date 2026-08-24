import {
  AppointmentStatus,
  Prisma,
  SiteRef,
  type PrismaClient,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import {
  addDaysToYmd,
  BUSINESS_TIMEZONE,
  getTodayYmdInTimeZone,
  getUtcHalfOpenRangeForBusinessDate,
  isValidDateYmd,
} from "../../utils/bangladeshDate.js";

export const APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV =
  "APPOINTMENT_DAY_AUTOCLOSE_FROM";
export const AUTOCLOSE_SITE_REF = SiteRef.DOCTOR_SHA_ALAM;
export const AUTOCLOSE_HOUR_DHAKA = 6;
export const CLOSEABLE_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
];

const LOG_PREFIX = "[appointment-day-autoclose]";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export type AppointmentDayAutocloseDb = Pick<
  PrismaClient,
  "$transaction"
> & {
  appointment: Pick<PrismaClient["appointment"], "updateMany">;
  appointmentDayCloseRun: Pick<
    PrismaClient["appointmentDayCloseRun"],
    "findMany" | "create"
  >;
};

export type CloseDayResult =
  | { status: "closed"; closedCount: number }
  | { status: "already_closed"; closedCount: number };

export type AutocloseRunResult = {
  fromYmd: string | null;
  closedDates: string[];
  skippedDates: string[];
};

export function parseAutocloseFromDate(
  raw: string | undefined | null,
): string | null {
  if (raw == null) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed || !isValidDateYmd(trimmed)) {
    return null;
  }
  return trimmed;
}

export function listYmdHalfOpen(
  fromYmd: string,
  toExclusiveYmd: string,
): string[] {
  const dates: string[] = [];
  let current = fromYmd;
  while (current < toExclusiveYmd) {
    dates.push(current);
    current = addDaysToYmd(current, 1);
  }
  return dates;
}

export function listEligibleBusinessDates(params: {
  fromYmd: string;
  todayYmd: string;
  closedDates: Iterable<string>;
}): string[] {
  const closed = new Set(params.closedDates);
  return listYmdHalfOpen(params.fromYmd, params.todayYmd).filter(
    (dateYmd) => !closed.has(dateYmd),
  );
}

function isUniqueConflict(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export function msUntilNextSixAmDhaka(
  now: Date,
  timeZone: string = BUSINESS_TIMEZONE,
): number {
  const todayYmd = getTodayYmdInTimeZone(timeZone, now);
  const { startUtc } = getUtcHalfOpenRangeForBusinessDate(todayYmd, timeZone);
  const sixAmTodayUtc = new Date(
    startUtc.getTime() + AUTOCLOSE_HOUR_DHAKA * 60 * 60 * 1000,
  );

  if (now.getTime() < sixAmTodayUtc.getTime()) {
    return sixAmTodayUtc.getTime() - now.getTime();
  }

  const tomorrowYmd = addDaysToYmd(todayYmd, 1);
  const { startUtc: tomorrowStartUtc } = getUtcHalfOpenRangeForBusinessDate(
    tomorrowYmd,
    timeZone,
  );
  const sixAmTomorrowUtc = new Date(
    tomorrowStartUtc.getTime() + AUTOCLOSE_HOUR_DHAKA * 60 * 60 * 1000,
  );
  return sixAmTomorrowUtc.getTime() - now.getTime();
}

export async function closeAppointmentDay(params: {
  dateYmd: string;
  db?: AppointmentDayAutocloseDb;
  siteRef?: SiteRef;
}): Promise<CloseDayResult> {
  const db = params.db ?? prisma;
  const siteRef = params.siteRef ?? AUTOCLOSE_SITE_REF;
  const { startUtc, endExclusiveUtc } = getUtcHalfOpenRangeForBusinessDate(
    params.dateYmd,
  );

  try {
    const closedCount = await db.$transaction(async (tx: TransactionClient) => {
      const updated = await tx.appointment.updateMany({
        where: {
          siteRef,
          status: { in: CLOSEABLE_STATUSES },
          appointmentDate: {
            gte: startUtc,
            lt: endExclusiveUtc,
          },
        },
        data: {
          status: AppointmentStatus.NOT_ATTENDED,
          updatedById: null,
        },
      });

      await tx.appointmentDayCloseRun.create({
        data: {
          siteRef,
          businessDate: params.dateYmd,
          closedCount: updated.count,
        },
      });

      return updated.count;
    });

    return { status: "closed", closedCount };
  } catch (error) {
    if (isUniqueConflict(error)) {
      return { status: "already_closed", closedCount: 0 };
    }
    throw error;
  }
}

export async function runAppointmentDayAutoclose(params?: {
  db?: AppointmentDayAutocloseDb;
  now?: Date;
  fromYmd?: string | null;
  logger?: Pick<typeof console, "info" | "warn" | "error">;
}): Promise<AutocloseRunResult> {
  const logger = params?.logger ?? console;
  const db = params?.db ?? prisma;
  const now = params?.now ?? new Date();
  const fromYmd =
    params && Object.prototype.hasOwnProperty.call(params, "fromYmd")
      ? (params.fromYmd ?? null)
      : parseAutocloseFromDate(process.env[APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV]);

  if (!fromYmd) {
    logger.warn(
      `${LOG_PREFIX} ${APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV} is missing or invalid; skipping close`,
    );
    return { fromYmd: null, closedDates: [], skippedDates: [] };
  }

  const todayYmd = getTodayYmdInTimeZone(BUSINESS_TIMEZONE, now);
  const existingRuns = await db.appointmentDayCloseRun.findMany({
    where: {
      siteRef: AUTOCLOSE_SITE_REF,
      businessDate: { gte: fromYmd, lt: todayYmd },
    },
    select: { businessDate: true },
  });
  const eligibleDates = listEligibleBusinessDates({
    fromYmd,
    todayYmd,
    closedDates: existingRuns.map((row) => row.businessDate),
  });

  const closedDates: string[] = [];
  const skippedDates: string[] = [];

  for (const dateYmd of eligibleDates) {
    const result = await closeAppointmentDay({ dateYmd, db });
    if (result.status === "already_closed") {
      skippedDates.push(dateYmd);
      continue;
    }
    closedDates.push(dateYmd);
    logger.info(
      `${LOG_PREFIX} closed ${dateYmd} (${result.closedCount} leftover appointments)`,
    );
  }

  return { fromYmd, closedDates, skippedDates };
}
