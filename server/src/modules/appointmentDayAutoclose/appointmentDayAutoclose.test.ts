import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppointmentStatus, Prisma, SiteRef } from "@prisma/client";
import {
  APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV,
  AUTOCLOSE_SITE_REF,
  CLOSEABLE_STATUSES,
  closeAppointmentDay,
  listEligibleBusinessDates,
  listYmdHalfOpen,
  msUntilNextSixAmDhaka,
  parseAutocloseFromDate,
  runAppointmentDayAutoclose,
  type AppointmentDayAutocloseDb,
} from "./appointmentDayAutoclose.service.js";
import { getUtcHalfOpenRangeForBusinessDate } from "../../utils/bangladeshDate.js";

type UpdateManyCall = {
  where: {
    siteRef: SiteRef;
    status: { in: AppointmentStatus[] };
    appointmentDate: { gte: Date; lt: Date };
  };
  data: { status: AppointmentStatus; updatedById: string | null };
};

function uniqueConflict(): Prisma.PrismaClientKnownRequestError {
  return new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
    code: "P2002",
    clientVersion: "test",
  });
}

function createFakeDb(options?: {
  closedDates?: string[];
  conflictDates?: string[];
}): {
  db: AppointmentDayAutocloseDb;
  updateCalls: UpdateManyCall[];
  ledgerCreates: Array<{ siteRef: SiteRef; businessDate: string; closedCount: number }>;
} {
  const closed = new Set(options?.closedDates ?? []);
  const conflict = new Set(options?.conflictDates ?? []);
  const updateCalls: UpdateManyCall[] = [];
  const ledgerCreates: Array<{
    siteRef: SiteRef;
    businessDate: string;
    closedCount: number;
  }> = [];

  const db = {
    appointment: {
      updateMany: async (args: UpdateManyCall) => {
        updateCalls.push(args);
        return { count: args.where.siteRef === AUTOCLOSE_SITE_REF ? 2 : 0 };
      },
    },
    appointmentDayCloseRun: {
      findMany: async () =>
        [...closed].map((businessDate) => ({ businessDate })),
      create: async ({
        data,
      }: {
        data: { siteRef: SiteRef; businessDate: string; closedCount: number };
      }) => {
        if (closed.has(data.businessDate) || conflict.has(data.businessDate)) {
          throw uniqueConflict();
        }
        closed.add(data.businessDate);
        ledgerCreates.push(data);
        return data;
      },
    },
    $transaction: async <T>(fn: (tx: unknown) => Promise<T>) => fn(db),
  } as unknown as AppointmentDayAutocloseDb;

  return { db, updateCalls, ledgerCreates };
}

const silentLogger: Pick<typeof console, "info" | "warn" | "error"> = {
  info() {},
  warn() {},
  error() {},
};

describe("appointment day autoclose", () => {
  it("parses a valid deploy-from date and rejects missing or invalid values", () => {
    assert.equal(parseAutocloseFromDate("2026-08-24"), "2026-08-24");
    assert.equal(parseAutocloseFromDate(" 2026-08-24 "), "2026-08-24");
    assert.equal(parseAutocloseFromDate(undefined), null);
    assert.equal(parseAutocloseFromDate(""), null);
    assert.equal(parseAutocloseFromDate("2026-13-01"), null);
  });

  it("lists [from, today) oldest first", () => {
    assert.deepEqual(listYmdHalfOpen("2026-08-22", "2026-08-24"), [
      "2026-08-22",
      "2026-08-23",
    ]);
    assert.deepEqual(listYmdHalfOpen("2026-08-24", "2026-08-24"), []);
  });

  it("skips dates already in the ledger", () => {
    assert.deepEqual(
      listEligibleBusinessDates({
        fromYmd: "2026-08-20",
        todayYmd: "2026-08-24",
        closedDates: ["2026-08-20", "2026-08-21"],
      }),
      ["2026-08-22", "2026-08-23"],
    );
  });

  it("waits until the next 06:00 Asia/Dhaka", () => {
    const beforeSix = new Date("2026-08-23T23:00:00.000Z");
    assert.equal(msUntilNextSixAmDhaka(beforeSix), 60 * 60 * 1000);

    const afterSix = new Date("2026-08-24T00:30:00.000Z");
    assert.equal(msUntilNextSixAmDhaka(afterSix), 23.5 * 60 * 60 * 1000);
  });

  it("closes leftover PENDING and CONFIRMED in the Dhaka day window", async () => {
    const { db, updateCalls, ledgerCreates } = createFakeDb();
    const result = await closeAppointmentDay({ dateYmd: "2026-08-23", db });
    const range = getUtcHalfOpenRangeForBusinessDate("2026-08-23");

    assert.equal(result.status, "closed");
    assert.equal(result.closedCount, 2);
    assert.equal(updateCalls.length, 1);
    assert.deepEqual(updateCalls[0].where.status.in, CLOSEABLE_STATUSES);
    assert.equal(updateCalls[0].where.siteRef, SiteRef.DOCTOR_SHA_ALAM);
    assert.equal(
      updateCalls[0].where.appointmentDate.gte.toISOString(),
      range.startUtc.toISOString(),
    );
    assert.equal(
      updateCalls[0].where.appointmentDate.lt.toISOString(),
      range.endExclusiveUtc.toISOString(),
    );
    assert.equal(updateCalls[0].data.status, AppointmentStatus.NOT_ATTENDED);
    assert.equal(updateCalls[0].data.updatedById, null);
    assert.deepEqual(ledgerCreates, [
      {
        siteRef: SiteRef.DOCTOR_SHA_ALAM,
        businessDate: "2026-08-23",
        closedCount: 2,
      },
    ]);
  });

  it("does not target ATTEND, CANCEL, RESCHEDULED, NOT_ATTENDED, or True Care", async () => {
    const { db, updateCalls } = createFakeDb();
    await closeAppointmentDay({ dateYmd: "2026-08-23", db });

    const targeted = updateCalls[0].where.status.in;
    assert.ok(!targeted.includes(AppointmentStatus.ATTEND));
    assert.ok(!targeted.includes(AppointmentStatus.CANCEL));
    assert.ok(!targeted.includes(AppointmentStatus.RESCHEDULED));
    assert.ok(!targeted.includes(AppointmentStatus.NOT_ATTENDED));
    assert.equal(updateCalls[0].where.siteRef, SiteRef.DOCTOR_SHA_ALAM);
    assert.notEqual(updateCalls[0].where.siteRef, SiteRef.TRUE_CARE_HELLING_CENTER);
  });

  it("treats a unique ledger conflict as already closed", async () => {
    const { db, ledgerCreates } = createFakeDb({
      conflictDates: ["2026-08-23"],
    });
    const result = await closeAppointmentDay({ dateYmd: "2026-08-23", db });
    assert.equal(result.status, "already_closed");
    assert.equal(ledgerCreates.length, 0);
  });

  it("no-ops when the deploy-from env is missing", async () => {
    const previous = process.env[APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV];
    delete process.env[APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV];
    const { db, updateCalls } = createFakeDb();
    try {
      const result = await runAppointmentDayAutoclose({
        db,
        now: new Date("2026-08-24T12:00:00.000Z"),
        logger: silentLogger,
      });
      assert.equal(result.fromYmd, null);
      assert.deepEqual(result.closedDates, []);
      assert.equal(updateCalls.length, 0);
    } finally {
      if (previous === undefined) {
        delete process.env[APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV];
      } else {
        process.env[APPOINTMENT_DAY_AUTOCLOSE_FROM_ENV] = previous;
      }
    }
  });

  it("does not close today, future dates, or days before deploy-from", async () => {
    const { db, updateCalls, ledgerCreates } = createFakeDb();
    const result = await runAppointmentDayAutoclose({
      db,
      fromYmd: "2026-08-23",
      now: new Date("2026-08-24T04:00:00.000Z"),
      logger: silentLogger,
    });

    assert.deepEqual(result.closedDates, ["2026-08-23"]);
    assert.equal(ledgerCreates.length, 1);
    assert.equal(ledgerCreates[0].businessDate, "2026-08-23");
    assert.equal(updateCalls.length, 1);
    const closedRange = getUtcHalfOpenRangeForBusinessDate("2026-08-23");
    assert.equal(
      updateCalls[0].where.appointmentDate.gte.toISOString(),
      closedRange.startUtc.toISOString(),
    );
  });

  it("catches up missed eligible days and skips dates that already ran", async () => {
    const { db, updateCalls, ledgerCreates } = createFakeDb({
      closedDates: ["2026-08-20", "2026-08-21"],
    });
    const now = new Date("2026-08-24T12:00:00.000Z");
    const first = await runAppointmentDayAutoclose({
      db,
      fromYmd: "2026-08-20",
      now,
      logger: silentLogger,
    });

    assert.deepEqual(first.closedDates, ["2026-08-22", "2026-08-23"]);
    assert.equal(updateCalls.length, 2);

    const second = await runAppointmentDayAutoclose({
      db,
      fromYmd: "2026-08-20",
      now,
      logger: silentLogger,
    });

    assert.deepEqual(second.closedDates, []);
    assert.equal(updateCalls.length, 2);
    assert.deepEqual(
      ledgerCreates.map((row) => row.businessDate),
      ["2026-08-22", "2026-08-23"],
    );
  });
});
