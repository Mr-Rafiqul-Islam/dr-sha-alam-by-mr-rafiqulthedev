import {
  CONSULTATION_FEE_BDT,
  INVOICE_TABLE_ROW_COUNT,
} from "../constants/invoice";
import type { Appointment } from "../types/appointment";
import {
  formatNullable,
  getPaymentStatusLabel,
} from "./appointment";
import {
  formatSerialDisplay,
  getEffectiveSerialNumber,
} from "./appointmentSerial";

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

function hasPaidConsultation(appointment: Appointment): boolean {
  return (
    appointment.paymentStatus === "SUCCESS" && appointment.transactionId != null
  );
}

export function buildInvoiceLineItems(appointment: Appointment): {
  lineItems: InvoiceLineItem[];
  totalAmount: string;
} {
  const fee = CONSULTATION_FEE_BDT;
  const paid = hasPaidConsultation(appointment);
  const feeDisplay = paid ? String(fee) : "-";
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
      value: getPaymentStatusLabel(appointment.paymentStatus),
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

  for (let serial = lineItems.length + 1; serial <= INVOICE_TABLE_ROW_COUNT; serial += 1) {
    lineItems.push({
      serial,
      label: "",
      value: "",
      amount: "",
    });
  }

  // Calculate total amount: always sum consultation fee + injection (if any)
  const totalNumeric = Number(fee) + (appointment.injectionAmount ?? 0);
  const totalAmount = String(totalNumeric);

  return { lineItems, totalAmount };
}
