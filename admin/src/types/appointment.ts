export type AppointmentStatus =
  | "PENDING"
  | "ATTEND"
  | "CANCEL"
  | "RESCHEDULED"
  | "CONFIRMED";

export type AppointmentPaymentStatus = "PENDING" | "SUCCESS" | "CANCEL";

export type SiteRef = "DOCTOR_SHA_ALAM" | "TRUE_CARE_HELLING_CENTER";

import type { PendingDeleteMeta } from "./pendingDelete";

export type Appointment = PendingDeleteMeta & {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  homeAddress: string;
  problem: string | null;
  preferredTime: string;
  appointmentDate: string;
  serialNumber: number;
  gender: string | null;
  age: string | null;
  status: AppointmentStatus;
  paymentStatus: AppointmentPaymentStatus | null;
  siteRef: SiteRef;
  transactionId: string | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentsListResponse = {
  success: boolean;
  message: string;
  appointments: Appointment[];
};

export type AppointmentResponse = {
  success: boolean;
  message: string;
  appointment: Appointment;
};

export type AppointmentFormData = {
  patientName: string;
  age?: string;
  phone: string;
  email: string;
  homeAddress: string;
  symptoms?: string;
  preferredDate: string;
  preferredTime: string;
};

/** Payload shape for POST /api/v1/client/appointments */
export type CreateAppointmentPayload = {
  fullName: string;
  phoneNumber: string;
  email?: string;
  age?: string;
  homeAddress: string;
  problem?: string;
  preferredDate: string;
  preferredTime: string;
};
