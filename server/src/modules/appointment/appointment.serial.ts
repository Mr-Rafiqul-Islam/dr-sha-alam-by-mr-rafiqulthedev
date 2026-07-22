import {
  AppointmentStatus,
  Prisma,
  SiteRef,
  type PrismaClient,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import { APPOINTMENT_ACTOR_INCLUDE } from "./appointment.mapper.js";
import { SEAT_CONSUMING_STATUSES } from "./appointment.slot-availability.js";
import { runSerializableTransaction } from "./appointment.slot-availability.js";
import {
  AppointmentValidationError,
  getDayRange,
  parseAdminNote,
} from "./appointment.utils.js";

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export type AppointmentSerialFields = {
  serialNumber: number;
  modifiedSerialNumber: number | null;
  effectiveSerialNumber: number;
};

export type QueueAppointment = {
  id: string;
  appointmentDate: Date;
  siteRef: SiteRef;
  preferredTime: string;
  slotId?: string | null;
  serialNumber: number;
  modifiedSerialNumber?: number | null;
  status: AppointmentStatus;
};

export const getEffectiveSerialNumber = (appointment: {
  serialNumber: number;
  modifiedSerialNumber?: number | null;
}): number => appointment.modifiedSerialNumber ?? appointment.serialNumber;

export function toAppointmentSerialFields(appointment: {
  serialNumber: number;
  modifiedSerialNumber?: number | null;
}): AppointmentSerialFields {
  const modifiedSerialNumber = appointment.modifiedSerialNumber ?? null;
  return {
    serialNumber: appointment.serialNumber,
    modifiedSerialNumber,
    effectiveSerialNumber: getEffectiveSerialNumber({
      serialNumber: appointment.serialNumber,
      modifiedSerialNumber,
    }),
  };
}

export function formatSerialDisplay(serial: number): string {
  return `#${String(serial).padStart(2, "0")}`;
}

export function parseModifiedSerialNumberFromBody(
  body: Record<string, unknown>,
): number | null {
  if (!Object.prototype.hasOwnProperty.call(body, "modifiedSerialNumber")) {
    throw new AppointmentValidationError("modifiedSerialNumber is required");
  }

  const value = body.modifiedSerialNumber;
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      throw new AppointmentValidationError(
        "modifiedSerialNumber must be a positive integer",
      );
    }
    if (!/^-?\d+$/.test(trimmed)) {
      throw new AppointmentValidationError(
        "modifiedSerialNumber must be a positive integer",
      );
    }
    const parsed = Number(trimmed);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      throw new AppointmentValidationError(
        "modifiedSerialNumber must be a positive integer",
      );
    }
    return parsed;
  }

  if (typeof value === "number") {
    if (!Number.isInteger(value) || value <= 0) {
      throw new AppointmentValidationError(
        "modifiedSerialNumber must be a positive integer",
      );
    }
    return value;
  }

  throw new AppointmentValidationError(
    "modifiedSerialNumber must be a positive integer or null",
  );
}

export function parseSerialModificationReason(value: unknown): string | null {
  return parseAdminNote(value);
}

export function assertSerialModificationAllowed(status: AppointmentStatus): void {
  if (status === AppointmentStatus.CANCEL || status === AppointmentStatus.RESCHEDULED) {
    throw new AppointmentValidationError(
      "Serial cannot be modified for a cancelled or rescheduled appointment.",
    );
  }
}

export function buildQueueWhereClause(appointment: {
  appointmentDate: Date;
  siteRef: SiteRef;
  preferredTime: string;
  slotId?: string | null;
}) {
  const { dayStart, dayEnd } = getDayRange(appointment.appointmentDate);

  if (!appointment.preferredTime?.trim() && appointment.slotId) {
    return {
      appointmentDate: { gte: dayStart, lte: dayEnd },
      siteRef: appointment.siteRef,
      slotId: appointment.slotId,
    };
  }

  return {
    appointmentDate: { gte: dayStart, lte: dayEnd },
    siteRef: appointment.siteRef,
    preferredTime: appointment.preferredTime,
  };
}

export function hasEffectiveSerialConflict(
  appointment: Pick<
    QueueAppointment,
    "serialNumber" | "modifiedSerialNumber"
  >,
  requestedSerial: number,
): boolean {
  const effective = getEffectiveSerialNumber(appointment);
  return effective === requestedSerial;
}

export function buildEffectiveSerialConflictWhere(requestedSerial: number) {
  return {
    OR: [
      { modifiedSerialNumber: requestedSerial },
      {
        modifiedSerialNumber: null,
        serialNumber: requestedSerial,
      },
    ],
  };
}

export async function findSerialConflict(params: {
  queue: ReturnType<typeof buildQueueWhereClause>;
  requestedSerial: number;
  excludeId: string;
  tx?: TransactionClient;
}) {
  const client = params.tx ?? prisma;

  return client.appointment.findFirst({
    where: {
      ...params.queue,
      id: { not: params.excludeId },
      status: { in: SEAT_CONSUMING_STATUSES },
      ...buildEffectiveSerialConflictWhere(params.requestedSerial),
    },
    select: { id: true },
  });
}

export async function assignNextSerialNumber(params: {
  tx: TransactionClient;
  appointmentDate: Date;
  siteRef: SiteRef;
  preferredTime: string;
  slotId?: string | null;
  excludeId: string;
}): Promise<number> {
  const queue = buildQueueWhereClause({
    appointmentDate: params.appointmentDate,
    siteRef: params.siteRef,
    preferredTime: params.preferredTime,
    slotId: params.slotId,
  });

  const { _max } = await params.tx.appointment.aggregate({
    where: {
      ...queue,
      id: { not: params.excludeId },
      status: { in: SEAT_CONSUMING_STATUSES },
    },
    _max: { serialNumber: true },
  });

  return (_max.serialNumber ?? 0) + 1;
}

export type ModifyAppointmentSerialResult = {
  appointment: Prisma.AppointmentGetPayload<{
    include: typeof APPOINTMENT_ACTOR_INCLUDE;
  }>;
  metadata: {
    originalSerialNumber: number;
    previousModifiedSerialNumber: number | null;
    newModifiedSerialNumber: number | null;
    previousEffectiveSerialNumber: number;
    newEffectiveSerialNumber: number;
    reason: string | null;
    appointmentDate: string;
    slotId: string | null;
    preferredTime: string;
    isReset: boolean;
    patientName: string;
  };
};

export async function modifyAppointmentSerial(params: {
  appointmentId: string;
  modifiedSerialNumber: number | null;
  reason: string | null;
  adminId: string;
}): Promise<ModifyAppointmentSerialResult> {
  return runSerializableTransaction(async (tx) => {
    const existing = await tx.appointment.findUnique({
      where: { id: params.appointmentId },
    });

    if (!existing) {
      throw new AppointmentValidationError("Appointment not found", 404);
    }

    assertSerialModificationAllowed(existing.status);

    const previousModifiedSerialNumber = existing.modifiedSerialNumber ?? null;
    const previousEffectiveSerialNumber = getEffectiveSerialNumber(existing);

    if (params.modifiedSerialNumber === null) {
      if (previousModifiedSerialNumber === null) {
        throw new AppointmentValidationError(
          "Appointment is already using the original serial.",
        );
      }
    } else {
      if (params.modifiedSerialNumber === existing.serialNumber) {
        throw new AppointmentValidationError(
          "Modified serial matches the original serial. Use reset instead or choose a different number.",
        );
      }

      if (params.modifiedSerialNumber === previousModifiedSerialNumber) {
        throw new AppointmentValidationError(
          "Appointment already has this modified serial number.",
        );
      }

      const queue = buildQueueWhereClause(existing);
      const conflict = await findSerialConflict({
        queue,
        requestedSerial: params.modifiedSerialNumber,
        excludeId: existing.id,
        tx,
      });

      if (conflict) {
        throw new AppointmentValidationError(
          "This serial number is already assigned to another active appointment in this slot.",
          409,
        );
      }
    }

    const appointment = await tx.appointment.update({
      where: { id: params.appointmentId },
      data: {
        modifiedSerialNumber: params.modifiedSerialNumber,
        updatedById: params.adminId,
      },
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    const newEffectiveSerialNumber = getEffectiveSerialNumber(appointment);
    const isReset = params.modifiedSerialNumber === null;

    return {
      appointment,
      metadata: {
        originalSerialNumber: existing.serialNumber,
        previousModifiedSerialNumber,
        newModifiedSerialNumber: params.modifiedSerialNumber,
        previousEffectiveSerialNumber,
        newEffectiveSerialNumber,
        reason: params.reason,
        appointmentDate: existing.appointmentDate.toISOString(),
        slotId: existing.slotId,
        preferredTime: existing.preferredTime,
        isReset,
        patientName: appointment.name,
      },
    };
  });
}

export function withAdminAppointmentSerialFields<
  T extends {
    serialNumber: number;
    modifiedSerialNumber?: number | null;
    preferredTime: string;
  },
>(
  appointment: T,
): T & AppointmentSerialFields {
  return {
    ...appointment,
    ...toAppointmentSerialFields(appointment),
  };
}

export function withPublicAppointmentSerialFields<
  T extends {
    serialNumber: number;
    modifiedSerialNumber?: number | null;
  },
>(appointment: T): Omit<T, "modifiedSerialNumber"> & {
  serialNumber: number;
  effectiveSerialNumber: number;
} {
  const effectiveSerialNumber = getEffectiveSerialNumber(appointment);
  const { modifiedSerialNumber: _modified, ...rest } = appointment as T & {
    modifiedSerialNumber?: number | null;
  };

  return {
    ...rest,
    serialNumber: effectiveSerialNumber,
    effectiveSerialNumber,
  };
}
