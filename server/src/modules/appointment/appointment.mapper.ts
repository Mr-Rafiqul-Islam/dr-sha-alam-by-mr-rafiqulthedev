import type { SiteRef } from "@prisma/client";
import {
  BOOTSTRAP_SLOT_DEFAULTS,
} from "../appointmentSchedule/slotDefaults.bootstrap.js";
import {
  toAppointmentSerialFields,
  withPublicAppointmentSerialFields,
} from "./appointment.serial.js";

const SITE_REF_WEBSITE_LABELS: Record<SiteRef, string> = {
  DOCTOR_SHA_ALAM: "https://doctorshahalam.com ",
  TRUE_CARE_HELLING_CENTER: "True Care Helling Center website",
};

export type AppointmentActorUser = {
  id: string;
  name: string | null;
  email?: string | null;
} | null;

export function getSiteRefWebsiteLabel(siteRef: SiteRef): string {
  return SITE_REF_WEBSITE_LABELS[siteRef] ?? String(siteRef);
}

export function formatAppointmentActorLabel(
  actor: AppointmentActorUser | undefined,
  siteRef: SiteRef,
): string {
  if (actor) {
    return actor.name?.trim() || actor.email?.trim() || "Staff";
  }
  return `${getSiteRefWebsiteLabel(siteRef)} (client)`;
}

export const PREFERRED_TIME_SLOTS = Object.fromEntries(
  BOOTSTRAP_SLOT_DEFAULTS.map(({ code, label, smsLabel }) => [
    code,
    { label, smsLabel },
  ]),
) as Record<
  string,
  {
    label: string;
    smsLabel: string;
  }
>;

export type PreferredTimeCode = keyof typeof PREFERRED_TIME_SLOTS;

export function parsePreferredTimeCode(value: unknown): PreferredTimeCode | null {
  if (typeof value !== "string") {
    return null;
  }

  const code = value.trim();
  return code in PREFERRED_TIME_SLOTS ? (code as PreferredTimeCode) : null;
}

export function getPreferredTimeLabel(code: string): string {
  const slot = PREFERRED_TIME_SLOTS[code as PreferredTimeCode];
  return slot?.label ?? code;
}

export function resolveSlotLabels(
  code: string,
  slot?: { label: string; smsLabel?: string | null } | null,
): { label: string; smsLabel: string } {
  if (slot?.label) {
    const fallback = PREFERRED_TIME_SLOTS[code as PreferredTimeCode];
    return {
      label: slot.label,
      smsLabel: slot.smsLabel ?? fallback?.smsLabel ?? code,
    };
  }
  const fallback = PREFERRED_TIME_SLOTS[code as PreferredTimeCode];
  return {
    label: fallback?.label ?? code,
    smsLabel: fallback?.smsLabel ?? code,
  };
}

export function getPreferredTimeSmsLabel(
  code: PreferredTimeCode,
  override?: string | null,
): string {
  if (override) {
    return override;
  }
  return PREFERRED_TIME_SLOTS[code]?.smsLabel ?? code;
}

type AppointmentWithOptionalActors = {
  preferredTime: string;
  siteRef?: SiteRef;
  createdBy?: AppointmentActorUser;
  updatedBy?: AppointmentActorUser;
  attendTime?: unknown;
};

export function toPublicAppointment<T extends { preferredTime: string }>(
  appointment: T,
): Omit<T, "preferredTime" | "attendTime" | "createdBy" | "updatedBy" | "modifiedSerialNumber"> & {
  preferredTime: string;
  createdBy?: string;
  updatedBy?: string;
  serialNumber: number;
  effectiveSerialNumber: number;
} {
  const {
    attendTime: _attendTime,
    preferredTime,
    createdBy,
    updatedBy,
    modifiedSerialNumber: _modifiedSerialNumber,
    ...rest
  } = appointment as T & AppointmentWithOptionalActors & {
    serialNumber?: number;
    modifiedSerialNumber?: number | null;
  };

  const hasActorRelations =
    "createdBy" in (appointment as object) ||
    "updatedBy" in (appointment as object);

  const siteRef = (appointment as AppointmentWithOptionalActors).siteRef;

  const serialFields =
    "serialNumber" in (appointment as object)
      ? withPublicAppointmentSerialFields(
          appointment as T & {
            serialNumber: number;
            modifiedSerialNumber?: number | null;
          },
        )
      : null;

  const baseRest = serialFields
    ? { ...rest, serialNumber: serialFields.serialNumber, effectiveSerialNumber: serialFields.effectiveSerialNumber }
    : rest;

  if (hasActorRelations && siteRef) {
    return {
      ...baseRest,
      preferredTime: getPreferredTimeLabel(preferredTime),
      createdBy: formatAppointmentActorLabel(createdBy, siteRef),
      updatedBy: formatAppointmentActorLabel(updatedBy, siteRef),
    } as Omit<T, "preferredTime" | "attendTime" | "createdBy" | "updatedBy" | "modifiedSerialNumber"> & {
      preferredTime: string;
      createdBy?: string;
      updatedBy?: string;
      serialNumber: number;
      effectiveSerialNumber: number;
    };
  }

  return {
    ...baseRest,
    preferredTime: getPreferredTimeLabel(preferredTime),
  } as Omit<T, "preferredTime" | "attendTime" | "createdBy" | "updatedBy" | "modifiedSerialNumber"> & {
    preferredTime: string;
    createdBy?: string;
    updatedBy?: string;
    serialNumber: number;
    effectiveSerialNumber: number;
  };
}

export function toPublicAppointments<T extends { preferredTime: string }>(
  appointments: T[],
): Array<
  Omit<T, "preferredTime" | "attendTime" | "createdBy" | "updatedBy" | "modifiedSerialNumber"> & {
    preferredTime: string;
    createdBy?: string;
    updatedBy?: string;
    serialNumber: number;
    effectiveSerialNumber: number;
  }
> {
  return appointments.map(toPublicAppointment);
}

export function toAdminAppointment<T extends { preferredTime: string; serialNumber: number; modifiedSerialNumber?: number | null }>(
  appointment: T,
): ReturnType<typeof toPublicAppointment<T>> & ReturnType<typeof toAppointmentSerialFields> {
  const publicAppointment = toPublicAppointment(appointment);
  const serialFields = toAppointmentSerialFields(appointment);

  return {
    ...publicAppointment,
    serialNumber: serialFields.serialNumber,
    modifiedSerialNumber: serialFields.modifiedSerialNumber,
    effectiveSerialNumber: serialFields.effectiveSerialNumber,
  };
}

export function toAdminAppointments<
  T extends { preferredTime: string; serialNumber: number; modifiedSerialNumber?: number | null },
>(appointments: T[]) {
  return appointments.map(toAdminAppointment);
}

export const APPOINTMENT_ACTOR_INCLUDE = {
  createdBy: { select: { id: true, name: true, email: true } },
  updatedBy: { select: { id: true, name: true, email: true } },
  feesDiscount: {
    orderBy: { createdAt: "asc" as const },
  },
} as const;
