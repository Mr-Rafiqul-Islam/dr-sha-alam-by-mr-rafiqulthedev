import {
  AppointmentPaymentMethod,
  AppointmentPaymentStatus,
  AppointmentStatus,
  UserRole,
  type AppointmentRevenueCategory,
  type SiteRef,
} from "@prisma/client";
import {
  resolveDiscountBdt,
  type ParsedFeeDiscount,
} from "./appointment.discount.js";
import { AppointmentValidationError } from "./appointment.utils.js";
import {
  loadFeesByCategory,
  resolveAppointmentConsultationFee,
  roundToTwoDecimals,
} from "../appointmentRevenue/appointmentRevenue.service.js";

export function assertAdminPaymentActor(admin: { id: string } | null | undefined): void {
  if (!admin) {
    throw new AppointmentValidationError("Authentication required.", 401);
  }
}

const PAYMENT_METHODS = new Set<string>(
  Object.values(AppointmentPaymentMethod),
);

export type StaffPaymentSelection = {
  paymentMethod: AppointmentPaymentMethod;
  collectedAmount: number | null;
};

export type StaffPaymentCreateFields = {
  paymentMethod: AppointmentPaymentMethod;
  paymentStatus: AppointmentPaymentStatus;
  collectedAmount: number | null;
};

function parseOptionalPaymentMethod(value: unknown): AppointmentPaymentMethod | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string" || !PAYMENT_METHODS.has(value)) {
    throw new AppointmentValidationError("Invalid payment method");
  }

  return value as AppointmentPaymentMethod;
}

function parseCollectedAmount(value: unknown): number {
  const num = Number(value);

  if (!Number.isFinite(num) || num < 0) {
    throw new AppointmentValidationError("Invalid collected amount");
  }

  return roundToTwoDecimals(num);
}

export function amountsMatchDue(collectedAmount: number, due: number): boolean {
  return Math.round(collectedAmount * 100) === Math.round(due * 100);
}

export function staffCollectionDueFromFee(
  consultationFee: number,
  discounts: Array<
    Pick<
      ParsedFeeDiscount,
      "discountAmount" | "discountPercentage"
    > & { discountType: ParsedFeeDiscount["discountType"] | null }
  > = [],
): number {
  const discountTotal = discounts.reduce((sum, discount) => {
    if (!discount.discountType) {
      return sum;
    }
    return sum + resolveDiscountBdt({ ...discount, discountType: discount.discountType }, consultationFee);
  }, 0);

  return roundToTwoDecimals(Math.max(0, consultationFee - discountTotal));
}

export async function resolveStaffCollectionDue(params: {
  preferredTime: string;
  feeCategory?: AppointmentRevenueCategory | null;
  siteRef: SiteRef;
  discounts?: Array<
    Pick<
      ParsedFeeDiscount,
      "discountAmount" | "discountPercentage"
    > & { discountType: ParsedFeeDiscount["discountType"] | null }
  > | null;
}): Promise<number> {
  const fees = await loadFeesByCategory(params.siteRef);
  const consultationFee = resolveAppointmentConsultationFee(
    {
      preferredTime: params.preferredTime,
      feeCategory: params.feeCategory,
    },
    fees,
  );

  return staffCollectionDueFromFee(consultationFee, params.discounts ?? []);
}

export function parseStaffPaymentSelection(
  body: unknown,
  options: { isAdmin: boolean; role?: UserRole },
): StaffPaymentSelection | undefined {
  const record =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  const paymentMethod = parseOptionalPaymentMethod(record.paymentMethod);

  if (!options.isAdmin) {
    if (paymentMethod) {
      throw new AppointmentValidationError(
        "Payment collection is only available for admin appointments",
      );
    }
    return undefined;
  }

  if (!paymentMethod) {
    if (options.role === UserRole.CHAMBER) {
      throw new AppointmentValidationError(
        "Payment method is required for chamber appointments",
      );
    }
    return undefined;
  }

  if (paymentMethod === AppointmentPaymentMethod.CASH) {
    if (
      !Object.prototype.hasOwnProperty.call(record, "collectedAmount") ||
      record.collectedAmount == null ||
      record.collectedAmount === ""
    ) {
      throw new AppointmentValidationError("Cash amount is required");
    }

    return {
      paymentMethod,
      collectedAmount: parseCollectedAmount(record.collectedAmount),
    };
  }

  return {
    paymentMethod,
    collectedAmount: null,
  };
}

export function applyStaffPaymentOnCreate(
  selection: StaffPaymentSelection,
  due: number,
): StaffPaymentCreateFields {
  if (selection.paymentMethod === AppointmentPaymentMethod.CASH) {
    if (
      selection.collectedAmount == null ||
      !amountsMatchDue(selection.collectedAmount, due)
    ) {
      throw new AppointmentValidationError(
        "Cash amount must equal the due amount",
      );
    }

    return {
      paymentMethod: AppointmentPaymentMethod.CASH,
      paymentStatus: AppointmentPaymentStatus.SUCCESS,
      collectedAmount: due,
    };
  }

  return {
    paymentMethod: selection.paymentMethod,
    paymentStatus: AppointmentPaymentStatus.PENDING,
    collectedAmount: null,
  };
}

export function applyBkashConfirm(params: {
  paymentMethod: AppointmentPaymentMethod | null;
  paymentStatus: AppointmentPaymentStatus | null;
  due: number;
}): { paymentStatus: AppointmentPaymentStatus; collectedAmount: number } {
  if (params.paymentMethod !== AppointmentPaymentMethod.BKASH) {
    throw new AppointmentValidationError("Appointment is not a bKash payment");
  }

  if (params.paymentStatus === AppointmentPaymentStatus.SUCCESS) {
    throw new AppointmentValidationError("Appointment is already paid");
  }

  return {
    paymentStatus: AppointmentPaymentStatus.SUCCESS,
    collectedAmount: params.due,
  };
}

export function appointmentPatchForPaymentFailure(params: {
  createdById: string | null | undefined;
  kind: "fail" | "cancel";
  providerPaymentStatus?: AppointmentPaymentStatus | null;
}): {
  status?: AppointmentStatus;
  paymentStatus?: AppointmentPaymentStatus;
} {
  if (params.createdById) {
    return { paymentStatus: AppointmentPaymentStatus.PENDING };
  }

  if (params.kind === "fail") {
    return { status: AppointmentStatus.CANCEL };
  }

  return {
    paymentStatus:
      params.providerPaymentStatus ?? AppointmentPaymentStatus.CANCEL,
  };
}
