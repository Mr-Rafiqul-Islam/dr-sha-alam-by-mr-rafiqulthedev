import { AppointmentStatus, Prisma } from "@prisma/client";
import type { Payment } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { parsePreferredTimeCode } from "../appointment/appointment.mapper.js";
import { sendAppointmentSms } from "../appointment/appointment.sms.js";
import {
  AppointmentValidationError,
  getDayRange,
  isPastOrToday,
  parseAppointmentDate,
  parseEmail,
  parseOptionalString,
  parseRequiredString,
} from "../appointment/appointment.utils.js";
import { validateSSLPayment } from "../../lib/sslPayment.js";
import {
  isPaymentAppointmentPayload,
  type PaymentAppointmentPayload,
} from "./payment.types.js";

const ACTIVE_APPOINTMENT_STATUSES = {
  not: AppointmentStatus.CANCEL,
} as const;

type FulfillPaymentResult = {
  appointmentId: string;
  alreadyProcessed: boolean;
};

function parsePaymentPayload(value: unknown): PaymentAppointmentPayload {
  if (!isPaymentAppointmentPayload(value)) {
    throw new AppointmentValidationError("Invalid payment appointment payload");
  }

  const fullName = parseRequiredString(value.fullName, "fullName");
  const phoneNumber = parseRequiredString(value.phoneNumber, "phoneNumber");
  const homeAddress = parseRequiredString(value.homeAddress, "homeAddress");
  const email = parseEmail(value.email);
  const problem = parseOptionalString(value.problem);
  const preferredTime = parsePreferredTimeCode(value.preferredTime);

  if (!preferredTime) {
    throw new AppointmentValidationError(
      "preferredTime must be one of: P-9, OP-4, G-5",
    );
  }

  const selectedDate = parseAppointmentDate(value.preferredDate);
  if (!selectedDate) {
    throw new AppointmentValidationError("Invalid preferredDate");
  }
  if (isPastOrToday(selectedDate)) {
    throw new AppointmentValidationError("Only future dates are allowed");
  }

  return {
    fullName,
    phoneNumber,
    email,
    homeAddress,
    problem,
    preferredDate: value.preferredDate,
    preferredTime,
    gender: parseOptionalString(value.gender),
    siteRef: value.siteRef,
  };
}

export function getFrontendUrl(): string {
  return process.env.FRONTEND_URL ?? "http://localhost:3000";
}

export function getBackendUrl(): string {
  return process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 5007}`;
}

export function shouldSkipSslValidation(): boolean {
  return process.env.SKIP_SSL_VALIDATION === "true";
}

export async function resolveConsultationFee(doctorId: string): Promise<number> {
  const doctor = await prisma.doctor.findUnique({
    where: { id: doctorId },
    select: { consultationFee: true },
  });

  if (!doctor) {
    throw new AppointmentValidationError("Doctor not found", 404);
  }

  if (doctor.consultationFee != null && doctor.consultationFee > 0) {
    return doctor.consultationFee;
  }

  const fallback = Number(process.env.CONSULTATION_FEE_FALLBACK);
  if (Number.isFinite(fallback) && fallback > 0) {
    return fallback;
  }

  throw new AppointmentValidationError(
    "Consultation fee is not configured for this doctor",
    500,
  );
}

export async function resolveDoctorId(doctorId?: string | null): Promise<string> {
  const resolved = doctorId?.trim() || process.env.DEFAULT_DOCTOR_ID?.trim();
  if (!resolved) {
    throw new AppointmentValidationError(
      "doctorId is required (or set DEFAULT_DOCTOR_ID in environment)",
      400,
    );
  }
  return resolved;
}

export async function validateSslOrThrow(valId: string | undefined) {
  if (shouldSkipSslValidation()) {
    return { status: "VALID", val_id: valId ?? "DEV_NO_VAL_ID" };
  }

  if (!valId) {
    throw new AppointmentValidationError("Missing val_id from payment gateway", 400);
  }

  const validator = await validateSSLPayment(valId);
  if (validator.status !== "VALID" && validator.status !== "VALIDATED") {
    throw new AppointmentValidationError("Payment validation failed", 400);
  }

  return validator;
}

export async function fulfillSuccessfulPayment(
  payment: Payment,
  options: { valId?: string; providerRaw?: unknown },
): Promise<FulfillPaymentResult> {
  if (payment.status === "SUCCESS" && payment.appointmentId) {
    return {
      appointmentId: payment.appointmentId,
      alreadyProcessed: true,
    };
  }

  const payload = parsePaymentPayload(payment.gatewayResponse);
  const selectedDate = parseAppointmentDate(payload.preferredDate);
  if (!selectedDate) {
    throw new AppointmentValidationError("Invalid preferredDate");
  }

  const { dayStart, dayEnd } = getDayRange(selectedDate);
  const slotCode = payload.preferredTime;

  const result = await prisma.$transaction(async (tx) => {
    const currentPayment = await tx.payment.findUnique({
      where: { tranId: payment.tranId },
    });

    if (!currentPayment) {
      throw new AppointmentValidationError("Payment not found", 404);
    }

    if (currentPayment.status === "SUCCESS" && currentPayment.appointmentId) {
      return {
        appointmentId: currentPayment.appointmentId,
        alreadyProcessed: true,
        smsPayload: null as null,
      };
    }

    const existingAppointment = await tx.appointment.findFirst({
      where: {
        phone: payload.phoneNumber,
        name: payload.fullName,
        status: ACTIVE_APPOINTMENT_STATUSES,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
      select: { id: true },
    });

    if (existingAppointment) {
      throw new AppointmentValidationError(
        "Appointment already exists for this patient on the selected date",
      );
    }

    const { _max } = await tx.appointment.aggregate({
      where: {
        preferredTime: slotCode,
        status: ACTIVE_APPOINTMENT_STATUSES,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
      _max: { serialNumber: true },
    });

    const serialNumber = (_max.serialNumber ?? 0) + 1;

    const appointment = await tx.appointment.create({
      data: {
        name: payload.fullName,
        phone: payload.phoneNumber,
        email: payload.email,
        homeAddress: payload.homeAddress,
        problem: payload.problem,
        preferredTime: slotCode,
        appointmentDate: selectedDate,
        serialNumber,
        gender: payload.gender,
        siteRef: payload.siteRef ?? "DOCTOR_SHA_ALAM",
        transactionId: payment.tranId,
      },
    });

    await tx.payment.update({
      where: { tranId: payment.tranId },
      data: {
        status: "SUCCESS",
        valId: options.valId ?? currentPayment.valId,
        providerValId: options.valId ?? currentPayment.providerValId,
        providerRaw: options.providerRaw
          ? (options.providerRaw as Prisma.InputJsonValue)
          : currentPayment.providerRaw ?? undefined,
        appointmentId: appointment.id,
        paymentResolvedAt: new Date(),
      },
    });

    return {
      appointmentId: appointment.id,
      alreadyProcessed: false,
      smsPayload: {
        name: payload.fullName,
        phone: payload.phoneNumber,
        serialNumber,
        slotCode,
      },
    };
  });

  if (result.smsPayload && !result.alreadyProcessed) {
    void sendAppointmentSms(result.smsPayload).catch((smsError) => {
      console.error("Failed to send appointment SMS after payment:", smsError);
    });
  }

  return {
    appointmentId: result.appointmentId,
    alreadyProcessed: result.alreadyProcessed,
  };
}

export function buildPaymentAppointmentPayload(body: Record<string, unknown>): PaymentAppointmentPayload {
  return parsePaymentPayload({
    fullName: body.fullName ?? body.name,
    phoneNumber: body.phoneNumber ?? body.phone,
    email: body.email,
    homeAddress: body.homeAddress ?? body.location,
    problem: body.problem,
    preferredDate: body.preferredDate ?? body.appointmentDate,
    preferredTime: body.preferredTime,
    gender: body.gender,
    siteRef: body.siteRef,
  });
}
