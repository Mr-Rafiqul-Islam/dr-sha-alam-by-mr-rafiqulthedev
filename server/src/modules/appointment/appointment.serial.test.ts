import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppointmentStatus } from "@prisma/client";
import { buildActivitySummary } from "../activity/activity.serializer.js";
import {
  assertSerialModificationAllowed,
  buildEffectiveSerialConflictWhere,
  buildQueueWhereClause,
  getEffectiveSerialNumber,
  hasEffectiveSerialConflict,
  parseModifiedSerialNumberFromBody,
} from "./appointment.serial.js";
import { AppointmentValidationError } from "./appointment.utils.js";

describe("getEffectiveSerialNumber", () => {
  it("returns modified serial when set", () => {
    assert.equal(
      getEffectiveSerialNumber({ serialNumber: 12, modifiedSerialNumber: 5 }),
      5,
    );
  });

  it("falls back to original serial when modified is null", () => {
    assert.equal(
      getEffectiveSerialNumber({ serialNumber: 12, modifiedSerialNumber: null }),
      12,
    );
  });
});

describe("parseModifiedSerialNumberFromBody", () => {
  it("requires modifiedSerialNumber key", () => {
    assert.throws(
      () => parseModifiedSerialNumberFromBody({}),
      (error: unknown) =>
        error instanceof AppointmentValidationError &&
        error.message === "modifiedSerialNumber is required",
    );
  });

  it("accepts explicit null for reset", () => {
    assert.equal(
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: null }),
      null,
    );
  });

  it("rejects zero and negative values", () => {
    assert.throws(() =>
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: 0 }),
    );
    assert.throws(() =>
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: -3 }),
    );
  });

  it("rejects decimal strings", () => {
    assert.throws(() =>
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: "5.5" }),
    );
  });

  it("accepts positive integers", () => {
    assert.equal(
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: 5 }),
      5,
    );
    assert.equal(
      parseModifiedSerialNumberFromBody({ modifiedSerialNumber: "7" }),
      7,
    );
  });
});

describe("assertSerialModificationAllowed", () => {
  it("blocks cancelled and rescheduled appointments", () => {
    assert.throws(() => assertSerialModificationAllowed(AppointmentStatus.CANCEL));
    assert.throws(() =>
      assertSerialModificationAllowed(AppointmentStatus.RESCHEDULED),
    );
  });

  it("allows active statuses", () => {
    assert.doesNotThrow(() =>
      assertSerialModificationAllowed(AppointmentStatus.PENDING),
    );
    assert.doesNotThrow(() =>
      assertSerialModificationAllowed(AppointmentStatus.CONFIRMED),
    );
    assert.doesNotThrow(() =>
      assertSerialModificationAllowed(AppointmentStatus.ATTEND),
    );
  });
});

describe("hasEffectiveSerialConflict", () => {
  it("matches modified serial conflicts", () => {
    assert.equal(
      hasEffectiveSerialConflict(
        { serialNumber: 10, modifiedSerialNumber: 5 },
        5,
      ),
      true,
    );
  });

  it("matches original serial when modified is null", () => {
    assert.equal(
      hasEffectiveSerialConflict(
        { serialNumber: 10, modifiedSerialNumber: null },
        10,
      ),
      true,
    );
  });

  it("does not match when effective serial differs", () => {
    assert.equal(
      hasEffectiveSerialConflict(
        { serialNumber: 10, modifiedSerialNumber: 7 },
        10,
      ),
      false,
    );
  });
});

describe("buildQueueWhereClause", () => {
  it("uses preferredTime and siteRef for queue scope", () => {
    const appointmentDate = new Date("2026-07-22T10:00:00.000Z");
    const where = buildQueueWhereClause({
      appointmentDate,
      siteRef: "DOCTOR_SHA_ALAM",
      preferredTime: "P-9",
      slotId: "slot-1",
    });

    assert.equal(where.siteRef, "DOCTOR_SHA_ALAM");
    assert.equal(where.preferredTime, "P-9");
    assert.ok(where.appointmentDate);
    assert.equal("slotId" in where, false);
  });
});

describe("buildEffectiveSerialConflictWhere", () => {
  it("builds OR clause for effective serial matching", () => {
    assert.deepEqual(buildEffectiveSerialConflictWhere(5), {
      OR: [
        { modifiedSerialNumber: 5 },
        { modifiedSerialNumber: null, serialNumber: 5 },
      ],
    });
  });
});

describe("buildActivitySummary for APPOINTMENT_SERIAL_CHANGED", () => {
  it("describes modify action", () => {
    const summary = buildActivitySummary(
      "APPOINTMENT_SERIAL_CHANGED",
      "Admin User",
      "admin@test.com",
      {
        patientName: "John Doe",
        previousEffectiveSerialNumber: 12,
        newEffectiveSerialNumber: 5,
      },
    );

    assert.match(summary, /changed appointment serial from 12 to 5 for John Doe/);
  });

  it("describes reset action", () => {
    const summary = buildActivitySummary(
      "APPOINTMENT_SERIAL_CHANGED",
      "Admin User",
      "admin@test.com",
      {
        patientName: "John Doe",
        isReset: true,
        previousModifiedSerialNumber: 5,
        originalSerialNumber: 12,
      },
    );

    assert.match(
      summary,
      /reset appointment serial from modified serial 5 to original serial 12 for John Doe/,
    );
  });
});
