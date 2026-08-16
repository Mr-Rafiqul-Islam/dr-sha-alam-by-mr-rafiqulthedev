import assert from "node:assert/strict";
import { DiscountType } from "@prisma/client";
import test from "node:test";
import {
  parseFeesDiscountInput,
  resolveDiscountBdt,
} from "./appointment.discount.js";

test("parseFeesDiscountInput rejects discounts for non-admin requests", () => {
  assert.throws(
    () =>
      parseFeesDiscountInput(
        {
          feesDiscount: [
            {
              discountType: DiscountType.SOME_FIXED_DISCOUNT,
              discountAmount: 100,
            },
          ],
        },
        { isAdmin: false },
      ),
    /admin appointments/i,
  );
});

test("parseFeesDiscountInput validates percentage discounts", () => {
  const parsed = parseFeesDiscountInput(
    {
      feesDiscount: [
        {
          discountType: DiscountType.SOME_PERCENTAGE_DISCOUNT,
          discountPercentage: 10,
          name: "Staff offer",
        },
      ],
    },
    { isAdmin: true },
  );

  assert.deepEqual(parsed, [
    {
      name: "Staff offer",
      description: null,
      discountType: DiscountType.SOME_PERCENTAGE_DISCOUNT,
      discountAmount: null,
      discountPercentage: 10,
      discountCode: null,
    },
  ]);
});

test("resolveDiscountBdt applies percentage against consultation fee only", () => {
  const fixed = resolveDiscountBdt(
    {
      discountType: DiscountType.SPECIAL_DISCOUNT,
      discountAmount: 75,
      discountPercentage: null,
    },
    500,
  );

  const percentage = resolveDiscountBdt(
    {
      discountType: DiscountType.SOME_PERCENTAGE_DISCOUNT,
      discountAmount: null,
      discountPercentage: 10,
    },
    500,
  );

  assert.equal(fixed, 75);
  assert.equal(percentage, 50);
});
