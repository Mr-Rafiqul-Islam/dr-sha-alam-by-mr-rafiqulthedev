import { INVOICE_TABLE_ROW_COUNT } from "../constants/invoice";
import type { Appointment } from "../types/appointment";
import {
  formatNullable,
  getPaymentMethodLabel,
  getPaymentStatusLabel,
} from "./appointment";
import {
  formatSerialDisplay,
  getEffectiveSerialNumber,
} from "./appointmentSerial";
import {
  getDiscountTypeLabel,
  resolveDiscountBdt,
} from "./discount";

export type InvoiceLineItem = {
  serial: number;
  label: string;
  value: string;
  amount: string;
};

export function formatInvoiceDate(appointmentDate: string): string {
  const date = new Date(appointmentDate);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatInvoicePatientName(appointment: Appointment): string {
  const age = appointment.age?.trim();

  if (age) {
    return `${appointment.name} (${age})`;
  }

  return appointment.name;
}

// function hasPaidConsultation(appointment: Appointment): boolean {
//   return (
//     appointment.paymentStatus === "SUCCESS" && appointment.transactionId != null
//   );
// }

export function buildInvoiceLineItems(appointment: Appointment): {
  lineItems: InvoiceLineItem[];
  totalAmount: string;
} {
  const fee = appointment.consultationFee ?? 0;
  // const paid = hasPaidConsultation(appointment);
  // Always show consultation fee on printed invoice (even if not paid)
  const feeDisplay = String(fee);
  const lineItems: InvoiceLineItem[] = [
    {
      serial: 1,
      label: "Serial No.",
      value: `${formatSerialDisplay(getEffectiveSerialNumber(appointment))} - ${appointment.preferredTime}`,
      amount: "",
    },
    {
      serial: 2,
      label: "Phone No.",
      value: appointment.phone,
      amount: "",
    },
    {
      serial: 3,
      label: "Attend Date",
      value: formatInvoiceDate(appointment.appointmentDate),
      amount: "",
    },
    {
      serial: 4,
      label: "Transaction ID",
      value: appointment.transactionId ?? "",
      amount: "",
    },
    {
      serial: 5,
      label: "Payment Status",
      value: [
        getPaymentStatusLabel(appointment.paymentStatus),
        appointment.paymentMethod
          ? getPaymentMethodLabel(appointment.paymentMethod)
          : null,
      ]
        .filter(Boolean)
        .join(" · "),
      amount: "",
    },
    {
      serial: 6,
      label: "Symptoms / Problem",
      value: formatNullable(appointment.problem),
      amount: "",
    },
    {
      serial: 7,
      label: "Consultation Fee",
      value: "",
      amount: feeDisplay,
    },
  ];

  // Add injection line item if present
  const injectionAmount = appointment.injectionAmount ?? null;
  if (appointment.injectionName) {
    const injectionDisplay = injectionAmount != null ? String(injectionAmount) : "";
    lineItems.push({
      serial: lineItems.length + 1,
      label: "Injection",
      value: appointment.injectionName,
      amount: injectionDisplay,
    });
  }

  const operationAmount = appointment.operationAmount ?? null;
  if (appointment.operationName) {
    const operationDisplay = operationAmount != null ? String(operationAmount) : "";
    lineItems.push({
      serial: lineItems.length + 1,
      label: "Operation",
      value: appointment.operationName,
      amount: operationDisplay,
    });
  }

  const totalDiscount = (appointment.feesDiscount ?? []).reduce(
    (sum, discount) => sum + resolveDiscountBdt(discount, fee),
    0,
  );

  for (const discount of appointment.feesDiscount ?? []) {
    const discountValue = resolveDiscountBdt(discount, fee);
    const discountLabel =
      discount.name?.trim() || getDiscountTypeLabel(discount.discountType);

    lineItems.push({
      serial: lineItems.length + 1,
      label: "Discount",
      value: discountLabel,
      amount: discountValue > 0 ? `-${discountValue}` : "",
    });
  }

  for (let serial = lineItems.length + 1; serial <= INVOICE_TABLE_ROW_COUNT; serial += 1) {
    lineItems.push({
      serial,
      label: "",
      value: "",
      amount: "",
    });
  }

  // Calculate total: consultation + injection + operation - discounts (never below 0)
  const totalNumeric = Math.max(
    0,
    Number(fee) +
      (appointment.injectionAmount ?? 0) +
      (appointment.operationName ? appointment.operationAmount ?? 0 : 0) -
      totalDiscount,
  );
  const totalAmount = String(totalNumeric);

  return { lineItems, totalAmount };
}
