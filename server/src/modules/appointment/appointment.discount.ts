import { DiscountType, type Prisma } from "@prisma/client";
import { AppointmentValidationError } from "./appointment.utils.js";

const DISCOUNT_TYPES = new Set<string>(Object.values(DiscountType));

const FIXED_AMOUNT_DISCOUNT_TYPES = new Set<DiscountType>([
  DiscountType.SPECIAL_DISCOUNT,
  DiscountType.REFUND_DISCOUNT,
  DiscountType.REFERRAL_DISCOUNT,
  DiscountType.SOME_FIXED_DISCOUNT,
]);

export type ParsedFeeDiscount = {
  name: string | null;
  description: string | null;
  discountType: DiscountType;
  discountAmount: number | null;
  discountPercentage: number | null;
  discountCode: string | null;
};

export function hasFeesDiscountBodyKey(body: unknown): boolean {
  return (
    typeof body === "object" &&
    body !== null &&
    Object.prototype.hasOwnProperty.call(body, "feesDiscount")
  );
}

function parseOptionalDiscountString(value: unknown): string | null {
  if (value == null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw new AppointmentValidationError("Discount text fields must be strings");
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseDiscountType(value: unknown): DiscountType {
  if (typeof value !== "string" || !DISCOUNT_TYPES.has(value)) {
    throw new AppointmentValidationError("Invalid discount type");
  }

  return value as DiscountType;
}

function parseNonNegativeNumber(
  value: unknown,
  fieldLabel: string,
): number {
  const num = Number(value);

  if (Number.isNaN(num) || num < 0) {
    throw new AppointmentValidationError(`Invalid ${fieldLabel}`);
  }

  return num;
}

function parsePositivePercentage(value: unknown): number {
  const num = Number(value);

  if (Number.isNaN(num) || num <= 0 || num > 100) {
    throw new AppointmentValidationError(
      "Discount percentage must be greater than 0 and at most 100",
    );
  }

  return num;
}

function parseSingleDiscount(value: unknown): ParsedFeeDiscount {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AppointmentValidationError("Each discount must be an object");
  }

  const record = value as Record<string, unknown>;
  const discountType = parseDiscountType(record.discountType);

  if (discountType === DiscountType.SOME_PERCENTAGE_DISCOUNT) {
    return {
      name: parseOptionalDiscountString(record.name),
      description: parseOptionalDiscountString(record.description),
      discountType,
      discountAmount: null,
      discountPercentage: parsePositivePercentage(record.discountPercentage),
      discountCode: parseOptionalDiscountString(record.discountCode),
    };
  }

  if (!FIXED_AMOUNT_DISCOUNT_TYPES.has(discountType)) {
    throw new AppointmentValidationError("Unsupported discount type");
  }

  return {
    name: parseOptionalDiscountString(record.name),
    description: parseOptionalDiscountString(record.description),
    discountType,
    discountAmount: parseNonNegativeNumber(record.discountAmount, "discount amount"),
    discountPercentage: null,
    discountCode: parseOptionalDiscountString(record.discountCode),
  };
}

export function parseFeesDiscountInput(
  body: unknown,
  options: { isAdmin: boolean },
): ParsedFeeDiscount[] | null | undefined {
  if (!hasFeesDiscountBodyKey(body)) {
    return undefined;
  }

  const raw = (body as Record<string, unknown>).feesDiscount;

  if (!options.isAdmin) {
    if (raw != null) {
      throw new AppointmentValidationError(
        "Discounts are only available for admin appointments",
      );
    }

    return undefined;
  }

  if (raw === null) {
    return null;
  }

  if (!Array.isArray(raw)) {
    throw new AppointmentValidationError("feesDiscount must be an array or null");
  }

  if (raw.length === 0) {
    return null;
  }

  return raw.map(parseSingleDiscount);
}

export function resolveDiscountBdt(
  discount: Pick<
    ParsedFeeDiscount,
    "discountType" | "discountAmount" | "discountPercentage"
  >,
  consultationFee: number,
): number {
  if (discount.discountType === DiscountType.SOME_PERCENTAGE_DISCOUNT) {
    const percentage = discount.discountPercentage ?? 0;
    return (consultationFee * percentage) / 100;
  }

  return discount.discountAmount ?? 0;
}

export async function replaceAppointmentFeesDiscounts(
  tx: Prisma.TransactionClient,
  appointmentId: string,
  discounts: ParsedFeeDiscount[] | null,
): Promise<void> {
  await tx.appointmentFeeDiscount.deleteMany({ where: { appointmentId } });

  if (!discounts || discounts.length === 0) {
    return;
  }

  await tx.appointmentFeeDiscount.createMany({
    data: discounts.map((discount) => ({
      appointmentId,
      name: discount.name,
      description: discount.description,
      discountType: discount.discountType,
      discountAmount: discount.discountAmount,
      discountPercentage: discount.discountPercentage,
      discountCode: discount.discountCode,
    })),
  });
}
