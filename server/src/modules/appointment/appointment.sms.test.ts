import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAppointmentSmsMessage,
  formatAttendanceTimeLine,
} from "./appointment.sms.js";

describe("appointment confirmation SMS", () => {
  const appointmentDate = new Date(Date.UTC(2026, 7, 19, 6, 0, 0));

  it("formats attendance time with Bengali date, weekday, and slot label", () => {
    assert.equal(
      formatAttendanceTimeLine(appointmentDate, "সকাল ৯ টা"),
      "উপস্থিতি সময়ঃ ১৯/০৮/২০২৬ রোজ বুধবার সকাল ৯ টা।",
    );
  });

  it("builds the chamber template without patient name or serial", () => {
    const message = buildAppointmentSmsMessage({
      appointmentDate,
      slotCode: "P-9",
      smsLabel: "সকাল ৯ টা",
    });

    assert.match(message, /চেম্বার: TruCare Diagnostics Centre/);
    assert.match(
      message,
      /উপস্থিতি সময়ঃ ১৯\/০৮\/২০২৬ রোজ বুধবার সকাল ৯ টা।/,
    );
    assert.match(message, /০৯৬১৩-৬৬৮৮৬৬/);
    assert.match(message, /০১৭০১৩১৩০০১/);
    assert.match(message, /০১৭০১৩১৩০০২/);
    assert.match(
      message,
      /https:\/\/maps\.app\.goo\.gl\/pKnvNaqG8cdvUtrR9\?g_st=ic/,
    );
    assert.doesNotMatch(message, /রোগীর নাম/);
    assert.doesNotMatch(message, /সিরিয়াল/);
  });
});
