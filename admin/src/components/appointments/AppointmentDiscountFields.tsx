import { ToggleSwitch } from "../articles/ToggleSwitch";
import {
  DEFAULT_APPOINTMENT_DISCOUNT_FORM_STATE,
  DISCOUNT_TYPE_OPTIONS,
  isPercentageDiscountType,
  type AppointmentDiscountFormState,
  type DiscountType,
} from "../../utils/discount";

type AppointmentDiscountFieldsProps = {
  idPrefix: string;
  value: AppointmentDiscountFormState;
  onChange: (value: AppointmentDiscountFormState) => void;
};

export function AppointmentDiscountFields({
  idPrefix,
  value,
  onChange,
}: AppointmentDiscountFieldsProps) {
  const showPercentage = isPercentageDiscountType(value.discountType);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-label-2xl font-medium text-on-surface">
          Fee Discount
        </span>

        <ToggleSwitch
          id={`${idPrefix}-discount-switch`}
          label=""
          checked={value.enabled}
          onChange={(checked) => {
            if (!checked) {
              onChange({ ...DEFAULT_APPOINTMENT_DISCOUNT_FORM_STATE });
              return;
            }

            onChange({
              ...DEFAULT_APPOINTMENT_DISCOUNT_FORM_STATE,
              enabled: true,
              discountAmount: 0,
            });
          }}
        />
      </div>

      {value.enabled && (
        <div className="grid gap-2">
          <select
            value={value.discountType}
            onChange={(event) => {
              const discountType = event.target.value as DiscountType;

              onChange({
                ...value,
                discountType,
                discountAmount: isPercentageDiscountType(discountType)
                  ? null
                  : (value.discountAmount ?? 0),
                discountPercentage: isPercentageDiscountType(discountType)
                  ? (value.discountPercentage ?? 0)
                  : null,
              });
            }}
            className="rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {DISCOUNT_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Discount name (optional)"
              value={value.discountName}
              onChange={(event) =>
                onChange({ ...value, discountName: event.target.value })
              }
              className="rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Discount code (optional)"
              value={value.discountCode}
              onChange={(event) =>
                onChange({ ...value, discountCode: event.target.value })
              }
              className="rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <textarea
            value={value.discountDescription}
            onChange={(event) =>
              onChange({ ...value, discountDescription: event.target.value })
            }
            rows={2}
            placeholder="Description (optional)"
            className="w-full resize-y rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          />

          {showPercentage ? (
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              placeholder="Discount percentage"
              value={value.discountPercentage ?? ""}
              onChange={(event) => {
                const nextValue = event.target.value;

                if (nextValue === "") {
                  onChange({ ...value, discountPercentage: null });
                  return;
                }

                const numberValue = Number(nextValue);

                if (Number.isFinite(numberValue) && numberValue >= 0) {
                  onChange({ ...value, discountPercentage: numberValue });
                }
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "e" ||
                  event.key === "E" ||
                  event.key === "-" ||
                  event.key === "+"
                ) {
                  event.preventDefault();
                }
              }}
              className="rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Discount amount (BDT)"
              value={value.discountAmount ?? ""}
              onChange={(event) => {
                const nextValue = event.target.value;

                if (nextValue === "") {
                  onChange({ ...value, discountAmount: null });
                  return;
                }

                const numberValue = Number(nextValue);

                if (Number.isFinite(numberValue) && numberValue >= 0) {
                  onChange({ ...value, discountAmount: numberValue });
                }
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "e" ||
                  event.key === "E" ||
                  event.key === "-" ||
                  event.key === "+"
                ) {
                  event.preventDefault();
                }
              }}
              className="rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
        </div>
      )}
    </div>
  );
}
