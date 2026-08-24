type AppointmentPaymentFieldsProps = {
  paymentChannel: "" | "CASH" | "DIGITAL";
  digitalMethod: "SSL" | "BKASH";
  collectedAmount: number | null;
  dueAmount: number | null;
  required: boolean;
  disabled?: boolean;
  onPaymentChannelChange: (value: "" | "CASH" | "DIGITAL") => void;
  onDigitalMethodChange: (value: "SSL" | "BKASH") => void;
  onCollectedAmountChange: (value: number | null) => void;
};

const selectClassName =
  "rounded-lg border border-outline-variant/50 bg-surface px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30";

export function AppointmentPaymentFields({
  paymentChannel,
  digitalMethod,
  collectedAmount,
  dueAmount,
  required,
  disabled,
  onPaymentChannelChange,
  onDigitalMethodChange,
  onCollectedAmountChange,
}: AppointmentPaymentFieldsProps) {
  const dueLabel =
    dueAmount == null ? "Select a time slot to see the due amount" : `Due: ${dueAmount} BDT`;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-label-2xl font-medium text-on-surface" htmlFor="create-payment-channel">
        Payment Method{required ? " *" : ""}
      </label>
      <select
        id="create-payment-channel"
        value={paymentChannel}
        disabled={disabled}
        onChange={(event) =>
          onPaymentChannelChange(event.target.value as "" | "CASH" | "DIGITAL")
        }
        className={selectClassName}
      >
        <option value="">
          {required ? "Select payment method" : "Skip payment"}
        </option>
        <option value="CASH">Cash</option>
        <option value="DIGITAL">Digital Payment</option>
      </select>

      {paymentChannel ? (
        <p className="text-label-sm text-on-surface-variant">{dueLabel}</p>
      ) : null}

      {paymentChannel === "DIGITAL" ? (
        <select
          value={digitalMethod}
          disabled={disabled}
          onChange={(event) =>
            onDigitalMethodChange(event.target.value as "SSL" | "BKASH")
          }
          className={selectClassName}
        >
          <option value="SSL">SSL</option>
          <option value="BKASH">bKash</option>
        </select>
      ) : null}

      {paymentChannel === "CASH" ? (
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Cash amount (BDT)"
          disabled={disabled}
          value={collectedAmount ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value;
            if (nextValue === "") {
              onCollectedAmountChange(null);
              return;
            }
            const numberValue = Number(nextValue);
            if (Number.isFinite(numberValue) && numberValue >= 0) {
              onCollectedAmountChange(numberValue);
            }
          }}
          className={selectClassName}
        />
      ) : null}
    </div>
  );
}
