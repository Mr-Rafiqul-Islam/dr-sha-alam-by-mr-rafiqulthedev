import assert from "node:assert/strict";
import {
  AppointmentPaymentMethod,
  AppointmentPaymentStatus,
  AppointmentStatus,
  DiscountType,
  UserRole,
} from "@prisma/client";
import test from "node:test";
import {
  applyBkashConfirm,
  applyStaffPaymentOnCreate,
  appointmentPatchForPaymentFailure,
  assertAdminPaymentActor,
  parseStaffPaymentSelection,
  staffCollectionDueFromFee,
} from "./appointment.payment.js";
import { AppointmentValidationError } from "./appointment.utils.js";

test("staffCollectionDueFromFee subtracts discount and floors at 0", () => {
  const discounted = staffCollectionDueFromFee(1500, [
    {
      discountType: DiscountType.SOME_FIXED_DISCOUNT,
      discountAmount: 200,
      discountPercentage: null,
    },
  ]);
  const none = staffCollectionDueFromFee(600, []);
  const over = staffCollectionDueFromFee(400, [
    {
      discountType: DiscountType.SOME_FIXED_DISCOUNT,
      discountAmount: 500,
      discountPercentage: null,
    },
  ]);

  assert.equal(discounted, 1300);
  assert.equal(none, 600);
  assert.equal(over, 0);
});

test("CHAMBER create without payment is rejected", () => {
  assert.throws(
    () => parseStaffPaymentSelection({}, { isAdmin: true, role: UserRole.CHAMBER }),
    /Payment method is required/i,
  );
});

test("ADMIN skip payment is allowed", () => {
  const parsed = parseStaffPaymentSelection(
    {},
    { isAdmin: true, role: UserRole.ADMIN },
  );
  assert.equal(parsed, undefined);
});

test("cash match and mismatch", () => {
  const selection = parseStaffPaymentSelection(
    { paymentMethod: "CASH", collectedAmount: 1300 },
    { isAdmin: true, role: UserRole.SUPPORT },
  );
  assert.ok(selection);

  const matched = applyStaffPaymentOnCreate(selection, 1300);
  assert.equal(matched.paymentStatus, AppointmentPaymentStatus.SUCCESS);
  assert.equal(matched.collectedAmount, 1300);

  assert.throws(
    () =>
      applyStaffPaymentOnCreate(
        { paymentMethod: AppointmentPaymentMethod.CASH, collectedAmount: 1000 },
        1300,
      ),
    /must equal the due amount/i,
  );
});

test("SSL and bKash create stay pending unpaid", () => {
  const ssl = applyStaffPaymentOnCreate(
    { paymentMethod: AppointmentPaymentMethod.SSL, collectedAmount: null },
    600,
  );
  const bkash = applyStaffPaymentOnCreate(
    { paymentMethod: AppointmentPaymentMethod.BKASH, collectedAmount: null },
    600,
  );

  assert.equal(ssl.paymentStatus, AppointmentPaymentStatus.PENDING);
  assert.equal(ssl.collectedAmount, null);
  assert.equal(bkash.paymentStatus, AppointmentPaymentStatus.PENDING);
  assert.equal(bkash.collectedAmount, null);
});

test("SSL start unauthorized without admin", () => {
  assert.throws(
    () => assertAdminPaymentActor(undefined),
    (error: unknown) =>
      error instanceof AppointmentValidationError && error.statusCode === 401,
  );
});

test("fail/cancel does not cancel staff-created appointments", () => {
  const failStaff = appointmentPatchForPaymentFailure({
    createdById: "staff-1",
    kind: "fail",
  });
  const cancelStaff = appointmentPatchForPaymentFailure({
    createdById: "staff-1",
    kind: "cancel",
  });
  const failPublic = appointmentPatchForPaymentFailure({
    createdById: null,
    kind: "fail",
  });

  assert.deepEqual(failStaff, { paymentStatus: AppointmentPaymentStatus.PENDING });
  assert.deepEqual(cancelStaff, { paymentStatus: AppointmentPaymentStatus.PENDING });
  assert.deepEqual(failPublic, { status: AppointmentStatus.CANCEL });
  assert.equal("status" in failStaff, false);
});

test("bKash confirm marks paid at due and rejects other methods", () => {
  const confirmed = applyBkashConfirm({
    paymentMethod: AppointmentPaymentMethod.BKASH,
    paymentStatus: AppointmentPaymentStatus.PENDING,
    due: 1300,
  });
  assert.equal(confirmed.paymentStatus, AppointmentPaymentStatus.SUCCESS);
  assert.equal(confirmed.collectedAmount, 1300);

  assert.throws(
    () =>
      applyBkashConfirm({
        paymentMethod: AppointmentPaymentMethod.SSL,
        paymentStatus: AppointmentPaymentStatus.PENDING,
        due: 1300,
      }),
    /not a bKash payment/i,
  );
  assert.throws(
    () =>
      applyBkashConfirm({
        paymentMethod: AppointmentPaymentMethod.BKASH,
        paymentStatus: AppointmentPaymentStatus.SUCCESS,
        due: 1300,
      }),
    /already paid/i,
  );
});

test("public paid booking fee helper does not take discounts", async () => {
  const { resolveBookingConsultationFee } = await import(
    "../payment/payment.service.js"
  );
  assert.equal(resolveBookingConsultationFee.length, 1);
});
