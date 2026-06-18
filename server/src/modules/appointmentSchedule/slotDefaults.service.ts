import type { AppointmentSlotDefault, AppointmentSlotDefaultConfig } from "@prisma/client";
import { SiteRef } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { AppointmentValidationError } from "../appointment/appointment.utils.js";
import {
  BOOTSTRAP_DEFAULT_SEAT_LIMIT,
  BOOTSTRAP_SLOT_DEFAULTS,
} from "./slotDefaults.bootstrap.js";
import type { SlotInput } from "./appointmentSchedule.validation.js";

type SlotDefaultConfigWithSlots = AppointmentSlotDefaultConfig & {
  slots: AppointmentSlotDefault[];
};

export type SlotDefaultRecord = {
  code: string;
  label: string;
  smsLabel: string | null;
  startTime: string;
  endTime: string | null;
  seatLimit: number;
  isActive: boolean;
};

export type SlotDefaultsConfig = {
  siteRef: SiteRef;
  defaultSeatLimit: number;
  slots: SlotDefaultRecord[];
  updatedAt: Date;
};

function toSlotDefaultRecord(slot: AppointmentSlotDefault): SlotDefaultRecord {
  return {
    code: slot.code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    startTime: slot.startTime,
    endTime: slot.endTime,
    seatLimit: slot.seatLimit,
    isActive: slot.isActive,
  };
}

function toPublicConfig(config: SlotDefaultConfigWithSlots): SlotDefaultsConfig {
  return {
    siteRef: config.siteRef,
    defaultSeatLimit: config.defaultSeatLimit,
    slots: config.slots.map(toSlotDefaultRecord),
    updatedAt: config.updatedAt,
  };
}

function slotDefaultCreateData() {
  return BOOTSTRAP_SLOT_DEFAULTS.map((slot, sortOrder) => ({
    code: slot.code,
    label: slot.label,
    smsLabel: slot.smsLabel,
    startTime: slot.startTime,
    endTime: slot.endTime,
    seatLimit: slot.seatLimit,
    isActive: slot.isActive,
    sortOrder,
  }));
}

export async function ensureSlotDefaults(
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
): Promise<SlotDefaultConfigWithSlots> {
  const existing = await prisma.appointmentSlotDefaultConfig.findUnique({
    where: { siteRef },
    include: { slots: { orderBy: { sortOrder: "asc" } } },
  });

  if (existing) {
    return existing;
  }

  return prisma.appointmentSlotDefaultConfig.create({
    data: {
      siteRef,
      defaultSeatLimit: BOOTSTRAP_DEFAULT_SEAT_LIMIT,
      slots: {
        create: slotDefaultCreateData(),
      },
    },
    include: { slots: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getSlotDefaults(
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
): Promise<SlotDefaultsConfig> {
  const config = await ensureSlotDefaults(siteRef);
  return toPublicConfig(config);
}

export async function upsertSlotDefaults(
  siteRef: SiteRef,
  input: { defaultSeatLimit: number; slots: SlotInput[] },
): Promise<SlotDefaultsConfig> {
  if (!Number.isInteger(input.defaultSeatLimit) || input.defaultSeatLimit < 0) {
    throw new AppointmentValidationError("defaultSeatLimit must be a non-negative integer");
  }

  const config = await ensureSlotDefaults(siteRef);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.appointmentSlotDefault.deleteMany({ where: { configId: config.id } });

    return tx.appointmentSlotDefaultConfig.update({
      where: { id: config.id },
      data: {
        defaultSeatLimit: input.defaultSeatLimit,
        slots: {
          create: input.slots.map((slot, sortOrder) => ({
            code: slot.code,
            label: slot.label,
            smsLabel: slot.smsLabel,
            startTime: slot.startTime,
            endTime: slot.endTime,
            seatLimit: slot.seatLimit,
            isActive: slot.isActive ?? true,
            sortOrder,
          })),
        },
      },
      include: { slots: { orderBy: { sortOrder: "asc" } } },
    });
  });

  return toPublicConfig(updated);
}

export async function getSlotDefaultsAsSlotInput(
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
): Promise<SlotInput[]> {
  const config = await ensureSlotDefaults(siteRef);

  return config.slots
    .filter((slot) => slot.isActive)
    .map((slot) => ({
      code: slot.code,
      label: slot.label,
      smsLabel: slot.smsLabel,
      startTime: slot.startTime,
      endTime: slot.endTime,
      seatLimit: slot.seatLimit,
      isActive: slot.isActive,
    }));
}

export async function getKnownSlotCodes(
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
): Promise<string[]> {
  const config = await ensureSlotDefaults(siteRef);
  return config.slots.filter((slot) => slot.isActive).map((slot) => slot.code);
}

export async function isKnownSlotCode(
  code: string,
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
): Promise<boolean> {
  const codes = await getKnownSlotCodes(siteRef);
  return codes.includes(code);
}

export async function getFallbackAvailableSlots(
  siteRef: SiteRef = SiteRef.DOCTOR_SHA_ALAM,
) {
  const config = await ensureSlotDefaults(siteRef);

  return config.slots
    .filter((slot) => slot.isActive)
    .map((slot) => ({
      code: slot.code,
      label: slot.label,
      smsLabel: slot.smsLabel,
      seatLimit: null as number | null,
      bookedSeats: 0,
      availableSeats: null as number | null,
      isAvailable: true,
    }));
}
