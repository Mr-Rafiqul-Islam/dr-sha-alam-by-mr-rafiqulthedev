import {
  AppointmentPaymentStatus,
  AppointmentStatus,
  Prisma,
  SiteRef,
} from "@prisma/client";
import type { Payment } from "@prisma/client";
import { prisma } from "../../config/db.js";
import {
  runSerializableTransaction,
  validateAppointmentSlotAvailability,
} from "../appointment/appointment.slot-availability.js";
import { parseSlotCodeString } from "../appointment/appointment.slot-availability.js";
import { sendAppointmentSms } from "../appointment/appointment.sms.js";
import {
  AppointmentValidationError,
  getDayRange,
  parseAppointmentDate,
  parseAppointmentDateForSlot,
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
  appointmentId: string | null;
  alreadyProcessed: boolean;
  slotFull?: boolean;
};

type SmsPayload = {
  name: string;
  phone: string;
  serialNumber: number;
  modifiedSerialNumber?: number | null;
  slotCode: string;
  smsLabel?: string | null;
};

export function extractProviderStatus(payload: unknown): string | undefined {
  if (payload && typeof payload === "object" && "status" in payload) {
    const status = (payload as Record<string, unknown>).status;
    return typeof status === "string" ? status : undefined;
  }

  return undefined;
}

export function mapProviderStatusToAppointmentPaymentStatus(
  providerStatus: string | undefined,
): AppointmentPaymentStatus | null {
  if (!providerStatus) {
    return null;
  }

  const normalized = providerStatus.trim().toUpperCase();

  if (normalized === "VALID" || normalized === "VALIDATED") {
    return AppointmentPaymentStatus.SUCCESS;
  }

  if (normalized === "CANCELLED" || normalized === "CANCEL") {
    return AppointmentPaymentStatus.CANCEL;
  }

  if (normalized === "PENDING" || normalized === "UNATTEMPTED") {
    return AppointmentPaymentStatus.PENDING;
  }

  return null;
}

function parsePaymentPayload(value: unknown): PaymentAppointmentPayload {
  if (!isPaymentAppointmentPayload(value)) {
    throw new AppointmentValidationError("Invalid payment appointment payload");
  }

  const fullName = parseRequiredString(value.fullName, "fullName");
  const phoneNumber = parseRequiredString(value.phoneNumber, "phoneNumber");
  const homeAddress = parseRequiredString(value.homeAddress, "homeAddress");
  const email = parseEmail(value.email);
  const problem = parseOptionalString(value.problem);
  const preferredTime = parseSlotCodeString(value.preferredTime);

  const selectedDate = parseAppointmentDateForSlot(
    value.preferredDate,
    preferredTime,
    "preferredDate",
  );

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
    scheduleId: value.scheduleId,
    slotId: value.slotId,
  };
}

async function createReservedAppointment(
  tx: Parameters<Parameters<typeof runSerializableTransaction>[0]>[0],
  payload: PaymentAppointmentPayload,
  tranId: string,
): Promise<{ appointmentId: string; smsLabel?: string | null }> {
  const selectedDate = parseAppointmentDate(payload.preferredDate);
  if (!selectedDate) {
    throw new AppointmentValidationError("Invalid preferredDate");
  }

  const siteRef = payload.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;
  const slotCode = payload.preferredTime;
  const { dayStart, dayEnd } = getDayRange(selectedDate);

  const slotAvailability = await validateAppointmentSlotAvailability({
    appointmentDate: selectedDate,
    preferredTime: slotCode,
    siteRef,
    tx,
  });

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
      siteRef,
      scheduleId: slotAvailability.scheduleId ?? payload.scheduleId,
      slotId: slotAvailability.slotId ?? payload.slotId,
      transactionId: tranId,
    },
  });

  return {
    appointmentId: appointment.id,
    smsLabel: slotAvailability.smsLabel,
  };
}

export async function createPendingPaymentWithAppointment(params: {
  payload: PaymentAppointmentPayload;
  tranId: string;
  userId: string | null;
  doctorId: string;
  amount: number;
  meta?: Record<string, unknown>;
}): Promise<{ appointmentId: string }> {
  return runSerializableTransaction(async (tx) => {
    const { appointmentId } = await createReservedAppointment(
      tx,
      params.payload,
      params.tranId,
    );

    await tx.payment.create({
      data: {
        tranId: params.tranId,
        userId: params.userId,
        doctorId: params.doctorId,
        amount: params.amount,
        status: "PENDING",
        gateway: "SSLCommerz",
        gatewayResponse: params.payload,
        transactionId: params.tranId,
        appointmentId,
        meta: params.meta as Prisma.InputJsonValue | undefined,
      },
    });

    return { appointmentId };
  });
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

export async function validatePaymentSlotAvailability(
  payload: PaymentAppointmentPayload,
): Promise<void> {
  const selectedDate = parseAppointmentDate(payload.preferredDate);
  if (!selectedDate) {
    throw new AppointmentValidationError("Invalid preferredDate");
  }

  await validateAppointmentSlotAvailability({
    appointmentDate: selectedDate,
    preferredTime: payload.preferredTime,
    siteRef: payload.siteRef ?? SiteRef.DOCTOR_SHA_ALAM,
  });
}

export async function handlePaymentFailSync(
  payment: Payment,
  providerPayload: unknown,
): Promise<void> {
  if (payment.status === "SUCCESS") {
    return;
  }

  const providerStatus = extractProviderStatus(providerPayload);

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { tranId: payment.tranId },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        providerStatus: providerStatus ?? undefined,
        providerRaw: providerPayload
          ? (providerPayload as Prisma.InputJsonValue)
          : undefined,
      },
    });

    if (payment.appointmentId) {
      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: {
          status: AppointmentStatus.CANCEL,
        },
      });
    }
  });
}

export async function handlePaymentCancelSync(
  payment: Payment,
  providerPayload: unknown,
): Promise<void> {
  if (payment.status === "SUCCESS") {
    return;
  }

  const providerStatus = extractProviderStatus(providerPayload);
  const paymentStatus =
    mapProviderStatusToAppointmentPaymentStatus(providerStatus) ??
    AppointmentPaymentStatus.CANCEL;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { tranId: payment.tranId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        providerStatus: providerStatus ?? undefined,
        providerRaw: providerPayload
          ? (providerPayload as Prisma.InputJsonValue)
          : undefined,
      },
    });

    if (payment.appointmentId) {
      await tx.appointment.update({
        where: { id: payment.appointmentId },
        data: {
          paymentStatus,
        },
      });
    }
  });
}

async function fulfillExistingReservedAppointment(
  tx: Parameters<Parameters<typeof runSerializableTransaction>[0]>[0],
  currentPayment: Payment,
  paymentStatus: AppointmentPaymentStatus,
  providerStatus: string | undefined,
  options: { valId?: string; providerRaw?: unknown },
): Promise<{
  appointmentId: string;
  alreadyProcessed: boolean;
  smsPayload: SmsPayload | null;
  slotFull: boolean;
}> {
  const existing = await tx.appointment.findUnique({
    where: { id: currentPayment.appointmentId! },
    include: {
      slot: {
        select: { smsLabel: true },
      },
    },
  });

  if (!existing) {
    throw new AppointmentValidationError("Reserved appointment not found", 404);
  }

  if (existing.status === AppointmentStatus.CANCEL) {
    throw new AppointmentValidationError("slot_full");
  }

  await tx.appointment.update({
    where: { id: existing.id },
    data: { paymentStatus },
  });

  await tx.payment.update({
    where: { tranId: currentPayment.tranId },
    data: {
      status: "SUCCESS",
      valId: options.valId ?? currentPayment.valId,
      providerValId: options.valId ?? currentPayment.providerValId,
      providerStatus: providerStatus ?? undefined,
      providerRaw: options.providerRaw
        ? (options.providerRaw as Prisma.InputJsonValue)
        : currentPayment.providerRaw ?? undefined,
      paymentResolvedAt: new Date(),
    },
  });

  return {
    appointmentId: existing.id,
    alreadyProcessed: false,
    smsPayload: {
      name: existing.name,
      phone: existing.phone,
      serialNumber: existing.serialNumber,
      modifiedSerialNumber: existing.modifiedSerialNumber,
      slotCode: existing.preferredTime,
      smsLabel: existing.slot?.smsLabel,
    },
    slotFull: false,
  };
}

async function fulfillLegacyPaymentAppointment(
  tx: Parameters<Parameters<typeof runSerializableTransaction>[0]>[0],
  currentPayment: Payment,
  payload: PaymentAppointmentPayload,
  selectedDate: Date,
  paymentStatus: AppointmentPaymentStatus,
  providerStatus: string | undefined,
  options: { valId?: string; providerRaw?: unknown },
): Promise<{
  appointmentId: string;
  alreadyProcessed: boolean;
  smsPayload: SmsPayload | null;
  slotFull: boolean;
}> {
  const siteRef = payload.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;
  const slotCode = payload.preferredTime;
  const { dayStart, dayEnd } = getDayRange(selectedDate);

  let slotAvailability;
  try {
    slotAvailability = await validateAppointmentSlotAvailability({
      appointmentDate: selectedDate,
      preferredTime: slotCode,
      siteRef,
      tx,
    });
  } catch (error) {
    if (
      error instanceof AppointmentValidationError &&
      error.message.includes("No seats available")
    ) {
      await tx.payment.update({
        where: { tranId: currentPayment.tranId },
        data: {
          status: "SUCCESS",
          valId: options.valId ?? currentPayment.valId,
          providerValId: options.valId ?? currentPayment.providerValId,
          providerStatus: providerStatus ?? undefined,
          providerStatusReason: "SLOT_FULL",
          providerRaw: options.providerRaw
            ? (options.providerRaw as Prisma.InputJsonValue)
            : currentPayment.providerRaw ?? undefined,
          paymentResolvedAt: new Date(),
        },
      });

      throw new AppointmentValidationError("slot_full");
    }
    throw error;
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
      siteRef,
      scheduleId: slotAvailability.scheduleId,
      slotId: slotAvailability.slotId,
      transactionId: currentPayment.tranId,
      paymentStatus,
    },
  });

  await tx.payment.update({
    where: { tranId: currentPayment.tranId },
    data: {
      status: "SUCCESS",
      valId: options.valId ?? currentPayment.valId,
      providerValId: options.valId ?? currentPayment.providerValId,
      providerStatus: providerStatus ?? undefined,
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
      smsLabel: slotAvailability.smsLabel,
    },
    slotFull: false,
  };
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

  const providerStatus = extractProviderStatus(options.providerRaw);
  const paymentStatus =
    mapProviderStatusToAppointmentPaymentStatus(providerStatus) ??
    AppointmentPaymentStatus.SUCCESS;

  const payload = parsePaymentPayload(payment.gatewayResponse);
  const selectedDate = parseAppointmentDate(payload.preferredDate);
  if (!selectedDate) {
    throw new AppointmentValidationError("Invalid preferredDate");
  }

  const result = await runSerializableTransaction(async (tx) => {
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
        slotFull: false,
      };
    }

    if (currentPayment.appointmentId) {
      return fulfillExistingReservedAppointment(
        tx,
        currentPayment,
        paymentStatus,
        providerStatus,
        options,
      );
    }

    return fulfillLegacyPaymentAppointment(
      tx,
      currentPayment,
      payload,
      selectedDate,
      paymentStatus,
      providerStatus,
      options,
    );
  });

  if (result.smsPayload && !result.alreadyProcessed) {
    void sendAppointmentSms(result.smsPayload).catch((smsError) => {
      console.error("Failed to send appointment SMS after payment:", smsError);
    });
  }

  return {
    appointmentId: result.appointmentId,
    alreadyProcessed: result.alreadyProcessed,
    slotFull: result.slotFull,
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

export async function buildPaymentAppointmentPayloadWithSlotValidation(
  body: Record<string, unknown>,
): Promise<PaymentAppointmentPayload> {
  const payload = buildPaymentAppointmentPayload(body);
  const selectedDate = parseAppointmentDate(payload.preferredDate)!;
  const siteRef = payload.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;
  const slotResult = await validateAppointmentSlotAvailability({
    appointmentDate: selectedDate,
    preferredTime: payload.preferredTime,
    siteRef,
  });

  return {
    ...payload,
    scheduleId: slotResult.scheduleId,
    slotId: slotResult.slotId,
  };
}
