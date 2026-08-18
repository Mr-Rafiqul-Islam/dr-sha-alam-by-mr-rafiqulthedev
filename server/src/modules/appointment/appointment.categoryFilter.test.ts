import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { AppointmentRevenueCategory } from "@prisma/client";
import { buildCategoryWhereClause } from "./appointment.categoryFilter.js";

describe("buildCategoryWhereClause", () => {
  it("matches OLD_GENERAL by stored category only", () => {
    const where = buildCategoryWhereClause([AppointmentRevenueCategory.OLD_GENERAL]);
    assert.deepEqual(where, {
      feeCategory: AppointmentRevenueCategory.OLD_GENERAL,
    });
  });

  it("matches GENERAL by stored category or inferred G-5", () => {
    const where = buildCategoryWhereClause([AppointmentRevenueCategory.GENERAL]);
    assert.equal(typeof where, "object");
    assert.ok(where && "OR" in where);
    const or = where.OR as unknown[];
    assert.deepEqual(or[0], { feeCategory: AppointmentRevenueCategory.GENERAL });
  });
});
