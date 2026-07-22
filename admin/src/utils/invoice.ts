import {
  CONSULTATION_FEE_BDT,
  INVOICE_TABLE_ROW_COUNT,
} from "../constants/invoice";
import type { Appointment } from "../types/appointment";
import {
  formatNullable,
  getPaymentStatusLabel,
} from "./appointment";

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

export function buildInvoiceLineItems(appointment: Appointment): {
  lineItems: InvoiceLineItem[];
  totalAmount: number;
} {
  const fee = CONSULTATION_FEE_BDT;
  const lineItems: InvoiceLineItem[] = [
    {
      serial: 1,
      label: "Attend Date",
      value: formatInvoiceDate(appointment.appointmentDate),
      amount: "",
    },
    {
      serial: 2,
      label: "Attend Time",
      value: appointment.preferredTime,
      amount: "",
    },
    {
      serial: 3,
      label: "Transaction ID",
      value: appointment.transactionId ?? "",
      amount: "",
    },
    {
      serial: 4,
      label: "Symptoms / Problem",
      value: formatNullable(appointment.problem),
      amount: "",
    },
    {
      serial: 5,
      label: "Payment Status",
      value: getPaymentStatusLabel(appointment.paymentStatus),
      amount: "",
    },
    {
      serial: 6,
      label: "Consultation Fee",
      value: "",
      amount: String(fee),
    },
  ];

  for (let serial = lineItems.length + 1; serial <= INVOICE_TABLE_ROW_COUNT; serial += 1) {
    lineItems.push({
      serial,
      label: "",
      value: "",
      amount: "",
    });
  }

  return { lineItems, totalAmount: fee };
}
