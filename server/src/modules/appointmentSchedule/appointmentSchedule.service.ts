import { Prisma, ScheduleStatus, SiteRef } from "@prisma/client";
import { prisma } from "../../config/db.js";
import {
  countBookedSeats,
  SEAT_CONSUMING_STATUSES,
} from "../appointment/appointment.slot-availability.js";
import { AppointmentValidationError, getDayRange, parseAppointmentDate } from "../appointment/appointment.utils.js";
import {
  toAdminSchedule,
  toPublicAvailableSlot,
} from "./appointmentSchedule.mapper.js";
import { getFallbackAvailableSlots, getSlotDefaults } from "./slotDefaults.service.js";
import type { SlotInput } from "./appointmentSchedule.validation.js";

type CreateScheduleInput = {
  siteRef: SiteRef;
  date: string;
  title?: string | null;
  status?: ScheduleStatus;
  isClosed?: boolean;
  slots: SlotInput[];
};

type UpdateScheduleInput = {
  date?: string;
  title?: string | null;
  status?: ScheduleStatus;
  isClosed?: boolean;
  slots?: SlotInput[];
};

function scheduleDateToAppointmentDate(date: string): Date {
  const appointmentDate = parseAppointmentDate(date);
  if (!appointmentDate) {
    throw new AppointmentValidationError("Invalid schedule date");
  }
  return appointmentDate;
}

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
  scheduleDate: string;
  siteRef: SiteRef;
  slots: SlotInput[];
}) {
  const appointmentDate = scheduleDateToAppointmentDate(params.scheduleDate);
  for (const slot of params.slots) {
    const bookedSeats = await countBookedSeats({
      appointmentDate,
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
  scheduleDate: string;
  siteRef: SiteRef;
  slotCodes: string[];
}) {
  const { dayStart, dayEnd } = getDayRange(
    scheduleDateToAppointmentDate(params.scheduleDate),
  );

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
  date: string;
  siteRef?: SiteRef;
  seatLimits?: Partial<Record<string, number>>;
  defaultSeatLimit?: number;
}) {
  const siteRef = params.siteRef ?? SiteRef.DOCTOR_SHA_ALAM;
  const defaults = await getSlotDefaults(siteRef);
  const defaultSeatLimit = params.defaultSeatLimit ?? defaults.defaultSeatLimit;

  const slots: SlotInput[] = defaults.slots
    .filter((slot) => slot.isActive)
    .map((slot) => ({
      code: slot.code,
      label: slot.label,
      smsLabel: slot.smsLabel,
      startTime: slot.startTime,
      endTime: slot.endTime,
      seatLimit: params.seatLimits?.[slot.code] ?? slot.seatLimit ?? defaultSeatLimit,
      isActive: slot.isActive,
    }));

  return upsertScheduleByDate({
    siteRef,
    date: params.date,
    slots,
  });
}

export async function upsertScheduleByDate(input: CreateScheduleInput) {
  const existing = await prisma.appointmentSchedule.findUnique({
    where: {
      siteRef_date: {
        siteRef: input.siteRef,
        date: input.date,
      },
    },
  });

  if (existing) {
    await assertSeatLimitNotBelowBooked({
      scheduleDate: input.date,
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
      date: input.date,
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
  startDate?: string;
  endDate?: string;
}) {
  const where: Prisma.AppointmentScheduleWhereInput = {
    siteRef: params.siteRef,
  };

  if (params.startDate || params.endDate) {
    where.date = {};
    if (params.startDate) {
      where.date.gte = params.startDate;
    }
    if (params.endDate) {
      where.date.lte = params.endDate;
    }
  }

  const schedules = await prisma.appointmentSchedule.findMany({
    where,
    include: { slots: { orderBy: { startTime: "asc" } } },
    orderBy: { date: "asc" },
  });

  return schedules.map(toAdminSchedule);
}

export async function listAllSchedules() {
  const schedules = await prisma.appointmentSchedule.findMany({
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

  if (input.slots) {
    await assertSeatLimitNotBelowBooked({
      scheduleDate,
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
        date: input.date,
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
  date: string;
  siteRef: SiteRef;
}) {
  const schedule = await prisma.appointmentSchedule.findUnique({
    where: {
      siteRef_date: {
        siteRef: params.siteRef,
        date: params.date,
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
      slots: await getFallbackAvailableSlots(params.siteRef),
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
        appointmentDate: scheduleDateToAppointmentDate(params.date),
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
