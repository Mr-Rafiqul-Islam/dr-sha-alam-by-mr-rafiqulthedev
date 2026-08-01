import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addDaysToYmd,
  getTodayYmdInTimeZone,
  getUtcHalfOpenRangeForBusinessDate,
  isValidDateYmd,
} from "./bangladeshDate.js";
import { AppointmentValidationError } from "../modules/appointment/appointment.utils.js";

describe("bangladeshDate", () => {
  it("validates YYYY-MM-DD strictly", () => {
    assert.equal(isValidDateYmd("2026-08-01"), true);
    assert.equal(isValidDateYmd("2026-13-01"), false);
    assert.equal(isValidDateYmd("2026/08/01"), false);
  });

  it("computes Asia/Dhaka half-open UTC range", () => {
    const { startUtc, endExclusiveUtc } = getUtcHalfOpenRangeForBusinessDate(
      "2026-08-01",
      "Asia/Dhaka",
    );

    assert.equal(startUtc.toISOString(), "2026-07-31T18:00:00.000Z");
    assert.equal(endExclusiveUtc.toISOString(), "2026-08-01T18:00:00.000Z");
  });

  it("includes UTC midnight Aug 1 in Dhaka Aug 1 window", () => {
    const { startUtc, endExclusiveUtc } = getUtcHalfOpenRangeForBusinessDate(
      "2026-08-01",
      "Asia/Dhaka",
    );
    const stored = new Date("2026-08-01T00:00:00.000Z");
    assert.equal(stored >= startUtc && stored < endExclusiveUtc, true);
  });

  it("addDaysToYmd handles month boundaries", () => {
    assert.equal(addDaysToYmd("2026-08-01", 1), "2026-08-02");
    assert.equal(addDaysToYmd("2026-08-31", 1), "2026-09-01");
  });

  it("rejects invalid business dates", () => {
    assert.throws(
      () => getUtcHalfOpenRangeForBusinessDate("2026-99-01", "Asia/Dhaka"),
      (error: unknown) =>
        error instanceof AppointmentValidationError &&
        error.message === "date must be YYYY-MM-DD",
    );
  });

  it("returns today in Asia/Dhaka as YYYY-MM-DD", () => {
    const today = getTodayYmdInTimeZone("Asia/Dhaka");
    assert.match(today, /^\d{4}-\d{2}-\d{2}$/);
  });
});
