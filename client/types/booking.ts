export type StartPaymentPayload = {
  name: string;
  phone: string;
  homeAddress: string;
  age?: string;
  preferredTime: string;
  appointmentDate: string;
  siteRef: string;
  email?: string;
  gender?: string;
  problem?: string;
  fbc?: string;
  fbp?: string;
  userAgent?: string;
};

export type StartPaymentResult = {
  url: string;
  tranId: string;
  amount: number;
};

export type SubmitFreeAppointmentPayload = {
  fullName: string;
  phoneNumber: string;
  homeAddress: string;
  preferredDate: string;
  preferredTime: string;
  email?: string;
  age?: string;
  problem?: string;
  fbEventId?: string;
  fbc?: string;
  fbp?: string;
};

export type SubmitFreeAppointmentResult = {
  appointmentId: string;
};

export type PublicAppointmentSummary = {
  name: string;
  homeAddress: string;
  appointmentDate: string;
  preferredTime: string;
  serialNumber: number;
};
