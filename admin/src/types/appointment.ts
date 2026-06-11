export type AppointmentStatus =
  | "PENDING"
  | "ATTEND"
  | "CANCEL"
  | "RESCHEDULED"
  | "CONFIRMED";

export type SiteRef = "DOCTOR_SHA_ALAM" | "TRUE_CARE_HELLING_CENTER";

export type Appointment = {
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
  status: AppointmentStatus;
  siteRef: SiteRef;
  transactionId: string | null;
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
