import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppointmentRevenueCategory, AppointmentStatus, Prisma } from "@prisma/client";
import { resolveRevenueCategory } from "./appointmentRevenue.constants.js";
import {
  aggregateAppointmentRevenue,
  decimalToNumber,
  roundToTwoDecimals,
} from "./appointmentRevenue.service.js";
import { parseRevenueFeeValue, parseRevenueFeesBody } from "./appointmentRevenue.validation.js";
import { AppointmentValidationError } from "../appointment/appointment.utils.js";
import type { AppointmentRowForRevenue } from "./appointmentRevenue.types.js";

const FEES: Record<AppointmentRevenueCategory, number> = {
  NEW_PLID: 1000,
  OLD_PLID: 800,
  GENERAL: 500,
  OLD_GENERAL: 400,
};

function row(
  status: AppointmentStatus,
  preferredTime: string,
  slotCode?: string | null,
  feeCategory?: AppointmentRevenueCategory | null,
): AppointmentRowForRevenue {
  return {
    status,
    preferredTime,
    feeCategory: feeCategory ?? null,
    slot: slotCode ? { code: slotCode } : null,
  };
}

describe("resolveRevenueCategory", () => {
  it("maps standard slot codes", () => {
    assert.equal(
      resolveRevenueCategory({ slotCode: "P-9", preferredTime: "G-5" }),
      AppointmentRevenueCategory.NEW_PLID,
    );
    assert.equal(
      resolveRevenueCategory({ slotCode: "OP-4", preferredTime: "G-5" }),
      AppointmentRevenueCategory.OLD_PLID,
    );
    assert.equal(
      resolveRevenueCategory({ slotCode: "G-5", preferredTime: "P-9" }),
      AppointmentRevenueCategory.GENERAL,
    );
  });

  it("falls back to preferredTime when slot is missing", () => {
    assert.equal(
      resolveRevenueCategory({ preferredTime: "p-9" }),
      AppointmentRevenueCategory.NEW_PLID,
    );
  });

  it("sends unknown codes to OTHER", () => {
    assert.equal(resolveRevenueCategory({ slotCode: "X-1" }), "OTHER");
    assert.equal(
      resolveRevenueCategory({ preferredTime: "PLID (Present at - 9:00 AM)" }),
      "OTHER",
    );
  });

  it("uses stored feeCategory over slot", () => {
    assert.equal(
      resolveRevenueCategory({
        feeCategory: AppointmentRevenueCategory.OLD_GENERAL,
        slotCode: "G-5",
        preferredTime: "G-5",
      }),
      AppointmentRevenueCategory.OLD_GENERAL,
    );
  });

  it("infers GENERAL from G-5 when feeCategory is unset", () => {
    assert.equal(
      resolveRevenueCategory({ slotCode: "G-5" }),
      AppointmentRevenueCategory.GENERAL,
    );
    assert.notEqual(
      resolveRevenueCategory({ preferredTime: "G-5" }),
      AppointmentRevenueCategory.OLD_GENERAL,
    );
  });
});

describe("aggregateAppointmentRevenue", () => {
  it("counts PENDING, CONFIRMED, and ATTEND as booked", () => {
    const result = aggregateAppointmentRevenue(
      [
        row(AppointmentStatus.PENDING, "P-9", "P-9"),
        row(AppointmentStatus.CONFIRMED, "OP-4", "OP-4"),
        row(AppointmentStatus.ATTEND, "G-5", "G-5"),
      ],
      FEES,
    );

    assert.equal(result.summary.booked, 3);
    assert.equal(result.summary.pending, 1);
    assert.equal(result.summary.confirmed, 1);
    assert.equal(result.summary.attended, 1);
  });

  it("counts only ATTEND for revenue", () => {
    const result = aggregateAppointmentRevenue(
      [
        row(AppointmentStatus.PENDING, "P-9", "P-9"),
        row(AppointmentStatus.CONFIRMED, "P-9", "P-9"),
        row(AppointmentStatus.ATTEND, "P-9", "P-9"),
        row(AppointmentStatus.ATTEND, "P-9", "P-9"),
      ],
      FEES,
    );

    const newPlid = result.categories.find((c) => c.key === "NEW_PLID");
    assert.equal(newPlid?.revenue, 2000);
    assert.equal(result.summary.totalRevenue, 2000);
  });

  it("excludes CANCEL and RESCHEDULED from booked/revenue", () => {
    const result = aggregateAppointmentRevenue(
      [
        row(AppointmentStatus.CANCEL, "P-9", "P-9"),
        row(AppointmentStatus.RESCHEDULED, "OP-4", "OP-4"),
        row(AppointmentStatus.ATTEND, "G-5", "G-5"),
      ],
      FEES,
    );

    assert.equal(result.summary.booked, 1);
    assert.equal(result.summary.cancelled, 1);
    assert.equal(result.summary.rescheduled, 1);
    assert.equal(result.summary.totalRevenue, 500);
  });

  it("calculates attendance rate safely when booked is zero", () => {
    const result = aggregateAppointmentRevenue(
      [row(AppointmentStatus.CANCEL, "P-9", "P-9")],
      FEES,
    );
    assert.equal(result.summary.attendanceRate, 0);
  });

  it("returns attendance rate rounded to two decimals", () => {
    const result = aggregateAppointmentRevenue(
      [
        row(AppointmentStatus.ATTEND, "P-9", "P-9"),
        row(AppointmentStatus.PENDING, "P-9", "P-9"),
        row(AppointmentStatus.PENDING, "P-9", "P-9"),
      ],
      FEES,
    );
    assert.equal(result.summary.attendanceRate, 33.33);
  });

  it("reconciles category totals with summary totals", () => {
    const rows = [
      row(AppointmentStatus.ATTEND, "P-9", "P-9"),
      row(AppointmentStatus.PENDING, "OP-4", "OP-4"),
      row(AppointmentStatus.CANCEL, "G-5", "G-5"),
      row(AppointmentStatus.ATTEND, "X-9", "X-9"),
    ];
    const result = aggregateAppointmentRevenue(rows, FEES);

    const categoryBooked = result.categories.reduce((sum, c) => sum + c.booked, 0);
    const categoryAttended = result.categories.reduce((sum, c) => sum + c.attended, 0);
    assert.equal(categoryBooked, result.summary.booked);
    assert.equal(categoryAttended, result.summary.attended);
    assert.equal(
      result.summary.totalAppointments,
      result.summary.pending +
        result.summary.confirmed +
        result.summary.attended +
        result.summary.cancelled +
        result.summary.rescheduled,
    );
  });

  it("handles zero fees", () => {
    const zeroFees = {
      NEW_PLID: 0,
      OLD_PLID: 0,
      GENERAL: 0,
      OLD_GENERAL: 0,
    };
    const result = aggregateAppointmentRevenue(
      [row(AppointmentStatus.ATTEND, "P-9", "P-9")],
      zeroFees,
    );
    assert.equal(result.summary.totalRevenue, 0);
  });

  it("splits G-5 attendance between GENERAL and OLD_GENERAL", () => {
    const result = aggregateAppointmentRevenue(
      [
        row(AppointmentStatus.ATTEND, "G-5", "G-5"),
        row(AppointmentStatus.ATTEND, "G-5", "G-5"),
        row(
          AppointmentStatus.ATTEND,
          "G-5",
          "G-5",
          AppointmentRevenueCategory.OLD_GENERAL,
        ),
      ],
      FEES,
    );

    const general = result.categories.find((c) => c.key === "GENERAL");
    const oldGeneral = result.categories.find((c) => c.key === "OLD_GENERAL");
    assert.equal(general?.attended, 2);
    assert.equal(general?.slotCode, "G-5");
    assert.equal(general?.revenue, 1000);
    assert.equal(oldGeneral?.attended, 1);
    assert.equal(oldGeneral?.slotCode, "G-5");
    assert.equal(oldGeneral?.revenue, 400);
    assert.equal(result.summary.totalRevenue, 1400);
  });
});

describe("parseRevenueFeeValue", () => {
  it("rejects negative fees", () => {
    assert.throws(
      () => parseRevenueFeeValue(-1, "fees.NEW_PLID"),
      (error: unknown) => error instanceof AppointmentValidationError,
    );
  });

  it("accepts decimal values with two places", () => {
    assert.equal(parseRevenueFeeValue("1250.50", "fees.GENERAL"), 1250.5);
  });

  it("rejects more than two decimal places", () => {
    assert.throws(
      () => parseRevenueFeeValue("10.999", "fees.GENERAL"),
      (error: unknown) => error instanceof AppointmentValidationError,
    );
  });

  it("requires OLD_GENERAL in the fees body", () => {
    assert.throws(
      () =>
        parseRevenueFeesBody({
          siteRef: "DOCTOR_SHA_ALAM",
          fees: { NEW_PLID: 1500, OLD_PLID: 1000, GENERAL: 600 },
        }),
      (error: unknown) =>
        error instanceof AppointmentValidationError &&
        error.message.includes("OLD_GENERAL"),
    );
  });
});

describe("decimal helpers", () => {
  it("handles Prisma Decimal without floating-point drift", () => {
    const value = new Prisma.Decimal("1250.50");
    assert.equal(decimalToNumber(value), 1250.5);
    assert.equal(roundToTwoDecimals(10 / 3), 3.33);
  });
});
