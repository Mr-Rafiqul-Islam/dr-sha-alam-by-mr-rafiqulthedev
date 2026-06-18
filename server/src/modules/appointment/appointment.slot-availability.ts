import {
  AppointmentStatus,
  Prisma,
  ScheduleStatus,
  SiteRef,
  type PrismaClient,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import { isKnownSlotCode, getKnownSlotCodes } from "../appointmentSchedule/slotDefaults.service.js";
import { AppointmentValidationError, getDayRange } from "./appointment.utils.js";

export const SEAT_CONSUMING_STATUSES: AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
  AppointmentStatus.ATTEND,
];

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export type SlotAvailabilityResult = {
  scheduleId: string | null;
  slotId: string | null;
  bookedSeats: number;
  availableSeats: number | null;
  seatLimit: number | null;
  fallback: boolean;
  smsLabel?: string | null;
};

export function toDateKey(value: string | Date): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseSlotCodeString(value: unknown, fieldName = "preferredTime"): string {
  if (typeof value !== "string") {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }
  const code = value.trim();
  if (!code) {
    throw new AppointmentValidationError(`${fieldName} is required`);
  }
  return code;
}

export async function countBookedSeats(params: {
  appointmentDate: Date;
  preferredTime: string;
  siteRef: SiteRef;
  tx?: TransactionClient;
}): Promise<number> {
  const { dayStart, dayEnd } = getDayRange(params.appointmentDate);
  const client = params.tx ?? prisma;

  return client.appointment.count({
    where: {
      appointmentDate: { gte: dayStart, lte: dayEnd },
      preferredTime: params.preferredTime,
      siteRef: params.siteRef,
      status: { in: SEAT_CONSUMING_STATUSES },
    },
  });
}

async function findScheduleForDate(params: {
  appointmentDate: Date;
  siteRef: SiteRef;
  tx?: TransactionClient;
}) {
  const dateKey = toDateKey(params.appointmentDate);
  const client = params.tx ?? prisma;

  return client.appointmentSchedule.findUnique({
    where: {
      siteRef_date: {
        siteRef: params.siteRef,
        date: dateKey,
      },
    },
    include: {
      slots: {
        where: { isActive: true },
      },
    },
  });
}

export async function validateAppointmentSlotAvailability(params: {
  appointmentDate: Date;
  preferredTime: unknown;
  siteRef?: SiteRef;
  tx?: TransactionClient;
}): Promise<SlotAvailabilityResult> {
  const slotCode = parseSlotCodeString(params.preferredTime);
  const siteRef = params.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;

  const schedule = await findScheduleForDate({
    appointmentDate: params.appointmentDate,
    siteRef,
    tx: params.tx,
  });

  if (!schedule) {
    const known = await isKnownSlotCode(slotCode, siteRef);
    if (!known) {
      const codes = await getKnownSlotCodes(siteRef);
      throw new AppointmentValidationError(
        `preferredTime must be one of: ${codes.join(", ")}`,
      );
    }

    return {
      scheduleId: null,
      slotId: null,
      bookedSeats: 0,
      availableSeats: null,
      seatLimit: null,
      fallback: true,
    };
  }

  if (schedule.isClosed || schedule.status === ScheduleStatus.INACTIVE) {
    throw new AppointmentValidationError("Booking is closed for this date");
  }

  const slot = schedule.slots.find((s) => s.code === slotCode);
  if (!slot) {
    throw new AppointmentValidationError(
      `Invalid or inactive time slot: ${slotCode}`,
    );
  }

  const bookedSeats = await countBookedSeats({
    appointmentDate: params.appointmentDate,
    preferredTime: slotCode,
    siteRef,
    tx: params.tx,
  });

  if (bookedSeats >= slot.seatLimit) {
    throw new AppointmentValidationError(
      `No seats available for ${slotCode} on this date`,
    );
  }

  return {
    scheduleId: schedule.id,
    slotId: slot.id,
    bookedSeats,
    availableSeats: slot.seatLimit - bookedSeats,
    seatLimit: slot.seatLimit,
    fallback: false,
    smsLabel: slot.smsLabel,
  };
}

export async function runSerializableTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>,
): Promise<T> {
  try {
    return await prisma.$transaction(fn, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return prisma.$transaction(fn, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    }
    throw error;
  }
}
