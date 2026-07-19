import { AppointmentStatus, SiteRef } from "@prisma/client";
import type { Request, Response } from "express";
import { prisma } from "../../config/db.js";
import { sendAppointmentSms } from "../../modules/appointment/appointment.sms.js";
import {
  ActivityAction,
  ActivityEntityType,
} from "../../modules/activity/activity.service.js";
import { recordActivity } from "../../modules/activity/activity.middleware.js";
import { sendCapiEvent } from "../../lib/metaCapi.js";
import {
  APPOINTMENT_ACTOR_INCLUDE,
  toPublicAppointment,
  toPublicAppointments,
} from "../../modules/appointment/appointment.mapper.js";
import {
  parseSlotCodeString,
  runSerializableTransaction,
  validateAppointmentSlotAvailability,
} from "../../modules/appointment/appointment.slot-availability.js";
import {
  annotatePendingDeleteMeta,
  buildPendingDeleteListWhere,
  canDeleteImmediately,
  createDeleteRequest,
  DeleteRequestEntityType,
  getPendingDeleteEntityMap,
  resolvePendingDeleteRequestsForEntity,
  shouldHidePendingDeletesFromLists,
} from "../../modules/deleteRequest/deleteRequest.service.js";
import { DeleteRequestError } from "../../modules/deleteRequest/deleteRequest.types.js";
import {
  AppointmentValidationError,
  getDayRange,
  handleAppointmentError,
  parseAppointmentDate,
  parseAppointmentStatus,
  parseEmail,
  parseAppointmentDateForSlot,
  parseFutureAppointmentDate,
  parseMonthYear,
  parseOptionalString,
  parseRequiredString,
} from "../../modules/appointment/appointment.utils.js";
import { routeParamString } from "../../utils/express-params.js";

function parseBodyString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return undefined;
}

const ACTIVE_APPOINTMENT_STATUSES = {
  not: AppointmentStatus.CANCEL,
} as const;

const DAY_APPOINTMENT_ORDER = [
  { preferredTime: "asc" as const },
  { serialNumber: "asc" as const },
];

const ALL_APPOINTMENTS_ORDER = [
  { appointmentDate: "desc" as const },
  ...DAY_APPOINTMENT_ORDER,
];

export async function createAppointment(req: Request, res: Response) {
  try {
    const name = parseRequiredString(req.body.fullName, "fullName");
    const phone = parseRequiredString(req.body.phoneNumber, "phoneNumber");
    const homeAddress = parseRequiredString(req.body.homeAddress, "homeAddress");
    const emailText = parseEmail(req.body.email);
    const problemText = parseOptionalString(req.body.problem);
    const slotCode = parseSlotCodeString(req.body.preferredTime);
    const selectedDate = parseAppointmentDateForSlot(
      req.body.preferredDate,
      slotCode,
      "preferredDate",
    );

    const { dayStart, dayEnd } = getDayRange(selectedDate);
    const adminId = req.admin?.id ?? null;

    let smsLabel: string | null | undefined;

    const newAppointment = await runSerializableTransaction(async (tx) => {
      const slotAvailability = await validateAppointmentSlotAvailability({
        appointmentDate: selectedDate,
        preferredTime: slotCode,
        siteRef: SiteRef.DOCTOR_SHA_ALAM,
        tx,
      });

      smsLabel = slotAvailability.smsLabel;

      const existingAppointment = await tx.appointment.findFirst({
        where: {
          phone,
          name,
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

      return tx.appointment.create({
        data: {
          name,
          phone,
          email: emailText,
          homeAddress,
          problem: problemText,
          preferredTime: slotCode,
          appointmentDate: selectedDate,
          serialNumber,
          siteRef: SiteRef.DOCTOR_SHA_ALAM,
          scheduleId: slotAvailability.scheduleId,
          slotId: slotAvailability.slotId,
          createdById: adminId,
          updatedById: adminId,
        },
        include: APPOINTMENT_ACTOR_INCLUDE,
      });
    });

    void sendAppointmentSms({
      name,
      phone,
      serialNumber: newAppointment.serialNumber,
      slotCode,
      smsLabel,
    }).catch((smsError) => {
      console.error("Failed to send appointment SMS:", smsError);
    });

    const fbEventId = parseBodyString(req.body.fbEventId);
    const fbc = parseBodyString(req.body.fbc);
    const fbp = parseBodyString(req.body.fbp);

    void sendCapiEvent({
      eventName: "Schedule",
      eventId: fbEventId ?? newAppointment.id,
      eventTime: Math.floor(Date.now() / 1000),
      actionSource: "website",
      userData: {
        email: emailText ?? undefined,
        phone,
        clientIpAddress:
          (typeof req.headers["x-forwarded-for"] === "string"
            ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
            : undefined) ?? req.ip,
        clientUserAgent:
          typeof req.headers["user-agent"] === "string"
            ? req.headers["user-agent"]
            : undefined,
        fbc,
        fbp,
      },
    });

    recordActivity(res, {
      action: ActivityAction.APPOINTMENT_CREATED,
      entityType: ActivityEntityType.Appointment,
      entityId: newAppointment.id,
      metadata: { patientName: newAppointment.name },
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: toPublicAppointment(newAppointment),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to create appointment");
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const status = parseAppointmentStatus(req.body.status);

    const existing = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        updatedById: req.admin?.id ?? null,
      },
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    recordActivity(res, {
      action: ActivityAction.APPOINTMENT_STATUS_CHANGED,
      entityType: ActivityEntityType.Appointment,
      entityId: appointment.id,
      metadata: {
        from: existing.status,
        to: appointment.status,
        patientName: appointment.name,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Internal server error");
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const existing = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!canDeleteImmediately(admin.role)) {
      try {
        await createDeleteRequest(
          DeleteRequestEntityType.APPOINTMENT,
          appointmentId,
          admin.id,
        );
      } catch (err) {
        if (err instanceof DeleteRequestError) {
          return res.status(err.statusCode).json({
            success: false,
            message: err.message,
          });
        }
        throw err;
      }

      return res.status(200).json({
        success: true,
        pending: true,
        message: "Delete request submitted and is pending confirmation.",
      });
    }

    await prisma.appointment.delete({ where: { id: appointmentId } });
    await resolvePendingDeleteRequestsForEntity(
      DeleteRequestEntityType.APPOINTMENT,
      appointmentId,
      admin.id,
    );

    recordActivity(res, {
      action: ActivityAction.APPOINTMENT_DELETED,
      entityType: ActivityEntityType.Appointment,
      entityId: appointmentId,
      metadata: { patientName: existing.name },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to delete appointment");
  }
}

export async function cancelAppointment(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCEL,
        updatedById: null,
      },
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Internal server error");
  }
}

export async function rescheduleAppointment(req: Request, res: Response) {
  const appointmentId = routeParamString(req.params.id);
  if (!appointmentId) {
    return res.status(400).json({ success: false, message: "Invalid appointment id" });
  }

  try {
    const selectedDate = parseFutureAppointmentDate(
      req.body.appointmentDate,
      "appointmentDate",
    );

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.RESCHEDULED,
        appointmentDate: selectedDate,
        updatedById: null,
      },
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment rescheduled successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Internal server error");
  }
}

async function getAdminAppointmentListContext(req: Request) {
  const admin = req.admin;
  if (!admin) {
    throw new AppointmentValidationError("Authentication required.", 401);
  }

  const pendingDeleteMap = await getPendingDeleteEntityMap(
    DeleteRequestEntityType.APPOINTMENT,
  );
  const hidePendingDeletes = shouldHidePendingDeletesFromLists(admin.role);

  return {
    pendingDeleteMap,
    hidePendingDeletes,
    pendingDeleteWhere: buildPendingDeleteListWhere(
      hidePendingDeletes,
      pendingDeleteMap,
    ),
  };
}

function mapAdminAppointments<T extends { id: string; preferredTime: string }>(
  appointments: T[],
  pendingDeleteMap: Map<string, string>,
  hidePendingDeletes: boolean,
) {
  const mapped = toPublicAppointments(appointments);
  return hidePendingDeletes
    ? mapped
    : annotatePendingDeleteMeta(mapped, pendingDeleteMap);
}

export async function getAllAppointments(req: Request, res: Response) {
  try {
    const { pendingDeleteMap, hidePendingDeletes, pendingDeleteWhere } =
      await getAdminAppointmentListContext(req);
    const appointments = await prisma.appointment.findMany({
      where: pendingDeleteWhere,
      orderBy: ALL_APPOINTMENTS_ORDER,
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: mapAdminAppointments(
        appointments,
        pendingDeleteMap,
        hidePendingDeletes,
      ),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}

export async function getAppointmentsByDay(req: Request, res: Response) {
  try {
    const dateParam = routeParamString(req.params.date);
    if (!dateParam) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const selectedDate = parseAppointmentDate(dateParam);
    if (!selectedDate) {
      return res.status(400).json({ success: false, message: "Invalid date" });
    }

    const { dayStart, dayEnd } = getDayRange(selectedDate);
    const { pendingDeleteMap, hidePendingDeletes, pendingDeleteWhere } =
      await getAdminAppointmentListContext(req);
    const appointments = await prisma.appointment.findMany({
      where: {
        ...pendingDeleteWhere,
        appointmentDate: { gte: dayStart, lte: dayEnd },
      },
      orderBy: DAY_APPOINTMENT_ORDER,
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: mapAdminAppointments(
        appointments,
        pendingDeleteMap,
        hidePendingDeletes,
      ),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}

export async function getAppointmentsByMonth(req: Request, res: Response) {
  try {
    const range = parseMonthYear(
      routeParamString(req.params.month),
      routeParamString(req.params.year),
    );
    if (!range) {
      return res.status(400).json({ success: false, message: "Invalid month or year" });
    }

    const { pendingDeleteMap, hidePendingDeletes, pendingDeleteWhere } =
      await getAdminAppointmentListContext(req);
    const appointments = await prisma.appointment.findMany({
      where: {
        ...pendingDeleteWhere,
        appointmentDate: { gte: range.startDate, lte: range.endDate },
      },
      orderBy: { appointmentDate: "asc" },
      include: APPOINTMENT_ACTOR_INCLUDE,
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: mapAdminAppointments(
        appointments,
        pendingDeleteMap,
        hidePendingDeletes,
      ),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}

export async function getAppointmentsByMonthForCalendar(req: Request, res: Response) {
  try {
    const range = parseMonthYear(
      routeParamString(req.params.month),
      routeParamString(req.params.year),
    );
    if (!range) {
      return res.status(400).json({ success: false, message: "Invalid month or year" });
    }

    const { pendingDeleteMap, hidePendingDeletes, pendingDeleteWhere } =
      await getAdminAppointmentListContext(req);
    const appointments = await prisma.appointment.findMany({
      where: {
        ...pendingDeleteWhere,
        appointmentDate: { gte: range.startDate, lte: range.endDate },
      },
      orderBy: { appointmentDate: "asc" },
      select: {
        id: true,
        name: true,
        appointmentDate: true,
        preferredTime: true,
      },
    });

    const formattedAppointments = appointments.map((appointment) => {
      const mapped = {
        id: appointment.id,
        name: appointment.name,
        appointmentDate: appointment.appointmentDate,
        preferredTime: toPublicAppointment(appointment).preferredTime,
      };
      const deleteRequestId = pendingDeleteMap.get(appointment.id);
      if (!deleteRequestId || hidePendingDeletes) {
        return mapped;
      }

      return {
        ...mapped,
        pendingDelete: true as const,
        deleteRequestId,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: formattedAppointments,
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}

export async function getAppointmentsById(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: "Invalid appointment id" });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        appointmentDate: true,
        homeAddress: true,
        name: true,
        phone: true,
        email: true,
        problem: true,
        preferredTime: true,
        serialNumber: true,
        gender: true,
        status: true,
        transactionId: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "No appointment found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointment: toPublicAppointment(appointment),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}

export async function getAppointmentsByPhone(req: Request, res: Response) {
  try {
    const phone = routeParamString(req.params.phone);
    if (!phone) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { phone },
      orderBy: { appointmentDate: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: toPublicAppointments(appointments),
    });
  } catch (error) {
    return handleAppointmentError(res, error, "Failed to get appointments");
  }
}
