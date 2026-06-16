import { Prisma, ScheduleStatus, SiteRef } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { PREFERRED_TIME_SLOTS, type PreferredTimeCode } from "../appointment/appointment.mapper.js";
import {
  countBookedSeats,
  normalizeScheduleDate,
  SEAT_CONSUMING_STATUSES,
} from "../appointment/appointment.slot-availability.js";
import { AppointmentValidationError, getDayRange } from "../appointment/appointment.utils.js";
import {
  toAdminSchedule,
  toFallbackAvailableSlots,
  toPublicAvailableSlot,
} from "./appointmentSchedule.mapper.js";
import type { SlotInput } from "./appointmentSchedule.validation.js";

const DEFAULT_START_TIMES: Record<PreferredTimeCode, string> = {
  "P-9": "09:00",
  "OP-4": "16:00",
  "G-5": "17:00",
};

type CreateScheduleInput = {
  siteRef: SiteRef;
  date: Date;
  title?: string | null;
  status?: ScheduleStatus;
  isClosed?: boolean;
  slots: SlotInput[];
};

type UpdateScheduleInput = {
  date?: Date;
  title?: string | null;
  status?: ScheduleStatus;
  isClosed?: boolean;
  slots?: SlotInput[];
};

function slotCreateData(slots: SlotInput[]) {
  return slots.map((slot) => ({
    code: slot.code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    startTime: slot.startTime,
    endTime: slot.endTime,
    seatLimit: slot.seatLimit,
    isActive: slot.isActive ?? true,
  }));
}

async function assertSeatLimitNotBelowBooked(params: {
  scheduleDate: Date;
  siteRef: SiteRef;
  slots: SlotInput[];
}) {
  for (const slot of params.slots) {
    const bookedSeats = await countBookedSeats({
      appointmentDate: params.scheduleDate,
      preferredTime: slot.code,
      siteRef: params.siteRef,
    });
    if (slot.seatLimit < bookedSeats) {
      throw new AppointmentValidationError(
        `seatLimit for ${slot.code} cannot be less than current bookings (${bookedSeats})`,
      );
    }
  }
}

async function assertNoSeatConsumingAppointments(params: {
  scheduleDate: Date;
  siteRef: SiteRef;
  slotCodes: string[];
}) {
  const { dayStart, dayEnd } = getDayRange(params.scheduleDate);

  const count = await prisma.appointment.count({
    where: {
      appointmentDate: { gte: dayStart, lte: dayEnd },
      siteRef: params.siteRef,
      preferredTime: { in: params.slotCodes },
      status: { in: SEAT_CONSUMING_STATUSES },
    },
  });

  if (count > 0) {
    throw new AppointmentValidationError(
      "Cannot delete schedule while active appointments exist for this date",
    );
  }
}

export async function createDefaultScheduleForDate(params: {
  date: Date;
  siteRef?: SiteRef;
  seatLimits?: Partial<Record<PreferredTimeCode, number>>;
  defaultSeatLimit?: number;
}) {
  const siteRef = params.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;
  const defaultSeatLimit = params.defaultSeatLimit ?? 50;

  const slots: SlotInput[] = (
    Object.entries(PREFERRED_TIME_SLOTS) as [PreferredTimeCode, (typeof PREFERRED_TIME_SLOTS)[PreferredTimeCode]][]
  ).map(([code, slot]) => ({
    code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    startTime: DEFAULT_START_TIMES[code],
    endTime: null,
    seatLimit: params.seatLimits?.[code] ?? defaultSeatLimit,
    isActive: true,
  }));

  return upsertScheduleByDate({
    siteRef,
    date: params.date,
    slots,
  });
}

export async function upsertScheduleByDate(input: CreateScheduleInput) {
  const normalizedDate = normalizeScheduleDate(input.date);

  const existing = await prisma.appointmentSchedule.findUnique({
    where: {
      siteRef_date: {
        siteRef: input.siteRef,
        date: normalizedDate,
      },
    },
  });

  if (existing) {
    await assertSeatLimitNotBelowBooked({
      scheduleDate: normalizedDate,
      siteRef: input.siteRef,
      slots: input.slots,
    });

    const schedule = await prisma.$transaction(async (tx) => {
      await tx.appointmentSlot.deleteMany({ where: { scheduleId: existing.id } });
      return tx.appointmentSchedule.update({
        where: { id: existing.id },
        data: {
          title: input.title,
          status: input.status ?? ScheduleStatus.ACTIVE,
          isClosed: input.isClosed ?? false,
          slots: { create: slotCreateData(input.slots) },
        },
        include: { slots: { orderBy: { startTime: "asc" } } },
      });
    });

    return toAdminSchedule(schedule);
  }

  const schedule = await prisma.appointmentSchedule.create({
    data: {
      siteRef: input.siteRef,
      date: normalizedDate,
      title: input.title,
      status: input.status ?? ScheduleStatus.ACTIVE,
      isClosed: input.isClosed ?? false,
      slots: { create: slotCreateData(input.slots) },
    },
    include: { slots: { orderBy: { startTime: "asc" } } },
  });

  return toAdminSchedule(schedule);
}

export async function listSchedules(params: {
  siteRef: SiteRef;
  startDate?: Date;
  endDate?: Date;
}) {
  const where: Prisma.AppointmentScheduleWhereInput = {
    siteRef: params.siteRef,
  };

  if (params.startDate || params.endDate) {
    where.date = {};
    if (params.startDate) {
      where.date.gte = normalizeScheduleDate(params.startDate);
    }
    if (params.endDate) {
      const end = normalizeScheduleDate(params.endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const schedules = await prisma.appointmentSchedule.findMany({
    where,
    include: { slots: { orderBy: { startTime: "asc" } } },
    orderBy: { date: "asc" },
  });

  return schedules.map(toAdminSchedule);
}

export async function getScheduleById(id: string) {
  const schedule = await prisma.appointmentSchedule.findUnique({
    where: { id },
    include: { slots: { orderBy: { startTime: "asc" } } },
  });

  if (!schedule) {
    throw new AppointmentValidationError("Schedule not found", 404);
  }

  return toAdminSchedule(schedule);
}

export async function updateScheduleById(id: string, input: UpdateScheduleInput) {
  const existing = await prisma.appointmentSchedule.findUnique({
    where: { id },
    include: { slots: true },
  });

  if (!existing) {
    throw new AppointmentValidationError("Schedule not found", 404);
  }

  const scheduleDate = input.date ?? existing.date;
  const normalizedDate = normalizeScheduleDate(scheduleDate);

  if (input.slots) {
    await assertSeatLimitNotBelowBooked({
      scheduleDate: normalizedDate,
      siteRef: existing.siteRef,
      slots: input.slots,
    });
  }

  const schedule = await prisma.$transaction(async (tx) => {
    if (input.slots) {
      await tx.appointmentSlot.deleteMany({ where: { scheduleId: id } });
    }

    return tx.appointmentSchedule.update({
      where: { id },
      data: {
        date: input.date ? normalizedDate : undefined,
        title: input.title,
        status: input.status,
        isClosed: input.isClosed,
        slots: input.slots ? { create: slotCreateData(input.slots) } : undefined,
      },
      include: { slots: { orderBy: { startTime: "asc" } } },
    });
  });

  return toAdminSchedule(schedule);
}

export async function deleteScheduleById(id: string) {
  const existing = await prisma.appointmentSchedule.findUnique({
    where: { id },
    include: { slots: true },
  });

  if (!existing) {
    throw new AppointmentValidationError("Schedule not found", 404);
  }

  await assertNoSeatConsumingAppointments({
    scheduleDate: existing.date,
    siteRef: existing.siteRef,
    slotCodes: existing.slots.map((s) => s.code),
  });

  await prisma.appointmentSchedule.delete({ where: { id } });
}

export async function getAvailableSlots(params: {
  date: Date;
  siteRef: SiteRef;
}) {
  const normalizedDate = normalizeScheduleDate(params.date);

  const schedule = await prisma.appointmentSchedule.findUnique({
    where: {
      siteRef_date: {
        siteRef: params.siteRef,
        date: normalizedDate,
      },
    },
    include: {
      slots: {
        where: { isActive: true },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!schedule) {
    return {
      isClosed: false,
      fallback: true,
      slots: toFallbackAvailableSlots(),
    };
  }

  if (schedule.isClosed || schedule.status === ScheduleStatus.INACTIVE) {
    return {
      isClosed: true,
      fallback: false,
      slots: [],
    };
  }

  const slots = await Promise.all(
    schedule.slots.map(async (slot) => {
      const bookedSeats = await countBookedSeats({
        appointmentDate: params.date,
        preferredTime: slot.code,
        siteRef: params.siteRef,
      });
      return toPublicAvailableSlot(slot, bookedSeats);
    }),
  );

  return {
    isClosed: false,
    fallback: false,
    slots,
  };
}
