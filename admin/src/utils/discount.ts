export type DiscountType =
  | "SPECIAL_DISCOUNT"
  | "REFUND_DISCOUNT"
  | "REFERRAL_DISCOUNT"
  | "SOME_PERCENTAGE_DISCOUNT"
  | "SOME_FIXED_DISCOUNT";

export type AppointmentFeeDiscount = {
  id: string;
  name: string | null;
  description: string | null;
  discountAmount: number | null;
  discountType: DiscountType | null;
  discountCode: string | null;
  discountPercentage: number | null;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentFeeDiscountInput = {
  name?: string;
  description?: string;
  discountType: DiscountType;
  discountAmount?: number;
  discountPercentage?: number;
  discountCode?: string;
};

export const DISCOUNT_TYPE_OPTIONS: Array<{
  value: DiscountType;
  label: string;
}> = [
  { value: "SPECIAL_DISCOUNT", label: "Special Discount" },
  { value: "REFUND_DISCOUNT", label: "Refund Discount" },
  { value: "REFERRAL_DISCOUNT", label: "Referral Discount" },
  { value: "SOME_FIXED_DISCOUNT", label: "Fixed Amount" },
  { value: "SOME_PERCENTAGE_DISCOUNT", label: "Percentage" },
];

export type AppointmentDiscountFormState = {
  enabled: boolean;
  discountType: DiscountType;
  discountAmount: number | null;
  discountPercentage: number | null;
  discountName: string;
  discountCode: string;
  discountDescription: string;
};

export const DEFAULT_APPOINTMENT_DISCOUNT_FORM_STATE: AppointmentDiscountFormState =
  {
    enabled: false,
    discountType: "SPECIAL_DISCOUNT",
    discountAmount: null,
    discountPercentage: null,
    discountName: "",
    discountCode: "",
    discountDescription: "",
  };

export function isPercentageDiscountType(
  discountType: DiscountType,
): boolean {
  return discountType === "SOME_PERCENTAGE_DISCOUNT";
}

export function discountFromAppointment(
  discount?: AppointmentFeeDiscount | null,
): AppointmentDiscountFormState {
  if (!discount?.discountType) {
    return { ...DEFAULT_APPOINTMENT_DISCOUNT_FORM_STATE };
  }

  return {
    enabled: true,
    discountType: discount.discountType,
    discountAmount: discount.discountAmount,
    discountPercentage: discount.discountPercentage,
    discountName: discount.name ?? "",
    discountCode: discount.discountCode ?? "",
    discountDescription: discount.description ?? "",
  };
}

export function validateDiscountFormState(
  state: AppointmentDiscountFormState,
): string | null {
  if (!state.enabled) {
    return null;
  }

  if (isPercentageDiscountType(state.discountType)) {
    if (
      state.discountPercentage == null ||
      state.discountPercentage <= 0 ||
      state.discountPercentage > 100
    ) {
      return "Enter a discount percentage greater than 0 and at most 100";
    }

    return null;
  }

  if (state.discountAmount == null) {
    return "Enter a discount amount";
  }

  return null;
}

export function toAppointmentFeeDiscountInput(
  state: AppointmentDiscountFormState,
): AppointmentFeeDiscountInput | null {
  if (!state.enabled) {
    return null;
  }

  const payload: AppointmentFeeDiscountInput = {
    discountType: state.discountType,
    ...(state.discountName.trim() ? { name: state.discountName.trim() } : {}),
    ...(state.discountCode.trim()
      ? { discountCode: state.discountCode.trim() }
      : {}),
    ...(state.discountDescription.trim()
      ? { description: state.discountDescription.trim() }
      : {}),
  };

  if (isPercentageDiscountType(state.discountType)) {
    if (state.discountPercentage == null) {
      return null;
    }

    return {
      ...payload,
      discountPercentage: state.discountPercentage,
    };
  }

  if (state.discountAmount == null) {
    return null;
  }

  return {
    ...payload,
    discountAmount: state.discountAmount,
  };
}

export function getDiscountTypeLabel(
  discountType: DiscountType | null | undefined,
): string {
  if (!discountType) {
    return "Discount";
  }

  return (
    DISCOUNT_TYPE_OPTIONS.find((option) => option.value === discountType)
      ?.label ?? discountType
  );
}

export function resolveDiscountBdt(
  discount: Pick<
    AppointmentFeeDiscount,
    "discountType" | "discountAmount" | "discountPercentage"
  >,
  consultationFee: number,
): number {
  if (discount.discountType === "SOME_PERCENTAGE_DISCOUNT") {
    const percentage = discount.discountPercentage ?? 0;
    return (consultationFee * percentage) / 100;
  }

  return discount.discountAmount ?? 0;
}

export function formatDiscountSummary(
  discount: AppointmentFeeDiscount,
  consultationFee: number,
): string {
  const label = discount.name?.trim() || getDiscountTypeLabel(discount.discountType);
  const resolved = resolveDiscountBdt(discount, consultationFee);

  if (discount.discountType === "SOME_PERCENTAGE_DISCOUNT") {
    return `${label} (${discount.discountPercentage ?? 0}%) — ${resolved}`;
  }

  return `${label} — ${resolved}`;
}
