import type { AppointmentSchedule, AppointmentSlot } from "@prisma/client";

type ScheduleWithSlots = AppointmentSchedule & { slots: AppointmentSlot[] };

export function toAdminSchedule(schedule: ScheduleWithSlots) {
  return {
    id: schedule.id,
    siteRef: schedule.siteRef,
    status: schedule.status,
    title: schedule.title,
    date: schedule.date,
    isClosed: schedule.isClosed,
    slots: schedule.slots.map(toAdminSlot),
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

export function toAdminSlot(slot: AppointmentSlot) {
  return {
    id: slot.id,
    scheduleId: slot.scheduleId,
    code: slot.code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    startTime: slot.startTime,
    endTime: slot.endTime,
    seatLimit: slot.seatLimit,
    isActive: slot.isActive,
    createdAt: slot.createdAt,
    updatedAt: slot.updatedAt,
  };
}

export type PublicAvailableSlot = {
  code: string;
  label: string;
  smsLabel: string | null;
  seatLimit: number | null;
  bookedSeats: number;
  availableSeats: number | null;
  isAvailable: boolean;
};

export function toPublicAvailableSlot(
  slot: AppointmentSlot,
  bookedSeats: number,
): PublicAvailableSlot {
  const availableSeats = Math.max(0, slot.seatLimit - bookedSeats);
  return {
    code: slot.code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    seatLimit: slot.seatLimit,
    bookedSeats,
    availableSeats,
    isAvailable: availableSeats > 0,
  };
}
