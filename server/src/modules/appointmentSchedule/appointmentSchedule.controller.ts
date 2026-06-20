import type { Request, Response } from "express";
import { prisma } from "../../config/db.js";
import { handleAppointmentError } from "../appointment/appointment.utils.js";
import {
  ActivityAction,
  ActivityEntityType,
} from "../activity/activity.service.js";
import { recordActivity } from "../activity/activity.middleware.js";
import { routeParamString } from "../../utils/express-params.js";
import {
  createDefaultScheduleForDate,
  deleteScheduleById,
  getAvailableSlots,
  getScheduleById,
  listAllSchedules,
  listSchedules,
  updateScheduleById,
  upsertScheduleByDate,
} from "./appointmentSchedule.service.js";
import {
  getSlotDefaults,
  upsertSlotDefaults,
} from "./slotDefaults.service.js";
import {
  parseOptionalBoolean,
  parseOptionalScheduleDate,
  parseOptionalScheduleStatus,
  parseOptionalString,
  parseScheduleDate,
  parseSiteRef,
  parseSlotsInput,
} from "./appointmentSchedule.validation.js";

function handleScheduleError(res: Response, error: unknown, fallbackMessage: string) {
  return handleAppointmentError(res, error, fallbackMessage);
}

export async function createOrUpsertSchedule(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.body.siteRef);
    const date = parseScheduleDate(req.body.date);
    const title = parseOptionalString(req.body.title);
    const status = parseOptionalScheduleStatus(req.body.status);
    const isClosed = parseOptionalBoolean(req.body.isClosed);
    const useDefaults = Boolean(req.body.useDefaults);

    if (useDefaults) {
      const seatLimits = req.body.seatLimits as Record<string, number> | undefined;
      const defaultSeatLimit =
        req.body.defaultSeatLimit !== undefined
          ? Number(req.body.defaultSeatLimit)
          : undefined;

      const schedule = await createDefaultScheduleForDate({
        date,
        siteRef,
        seatLimits: seatLimits as Parameters<typeof createDefaultScheduleForDate>[0]["seatLimits"],
        defaultSeatLimit: Number.isInteger(defaultSeatLimit) ? defaultSeatLimit : undefined,
      });

      recordActivity(res, {
        action: ActivityAction.SCHEDULE_CREATED,
        entityType: ActivityEntityType.AppointmentSchedule,
        entityId: schedule.id,
        metadata: { date: schedule.date },
      });

      return res.status(201).json({ success: true, data: schedule });
    }

    const slots = req.body.slots;
    const parsedSlots = parseSlotsInput(slots, { allowEmpty: isClosed === true });

    const existingSchedule = await prisma.appointmentSchedule.findUnique({
      where: {
        siteRef_date: {
          siteRef,
          date,
        },
      },
      select: { id: true },
    });

    const schedule = await upsertScheduleByDate({
      siteRef,
      date,
      title,
      status,
      isClosed,
      slots: parsedSlots,
    });

    recordActivity(res, {
      action: existingSchedule
        ? ActivityAction.SCHEDULE_UPDATED
        : ActivityAction.SCHEDULE_CREATED,
      entityType: ActivityEntityType.AppointmentSchedule,
      entityId: schedule.id,
      metadata: { date: schedule.date },
    });

    return res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to create schedule");
  }
}

export async function listSchedulesHandler(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.query.siteRef);
    const startDate = parseOptionalScheduleDate(req.query.startDate, "startDate");
    const endDate = parseOptionalScheduleDate(req.query.endDate, "endDate");

    const schedules = await listSchedules({ siteRef, startDate, endDate });

    return res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to list schedules");
  }
}

export async function listClientSchedulesHandler(_req: Request, res: Response) {
  try {
    const schedules = await listAllSchedules();

    return res.status(200).json({ success: true, data: schedules });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to list schedules");
  }
}

export async function getScheduleByIdHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid schedule id" });
  }

  try {
    const schedule = await getScheduleById(id);
    return res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to get schedule");
  }
}

export async function updateScheduleHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid schedule id" });
  }

  try {
    const date = parseOptionalScheduleDate(req.body.date, "date");
    const title = parseOptionalString(req.body.title);
    const status = parseOptionalScheduleStatus(req.body.status);
    const isClosed = parseOptionalBoolean(req.body.isClosed);
    const slots =
      req.body.slots !== undefined
        ? parseSlotsInput(req.body.slots, { allowEmpty: isClosed === true })
        : undefined;

    const schedule = await updateScheduleById(id, {
      date,
      title,
      status,
      isClosed,
      slots,
    });

    recordActivity(res, {
      action: ActivityAction.SCHEDULE_UPDATED,
      entityType: ActivityEntityType.AppointmentSchedule,
      entityId: schedule.id,
      metadata: { date: schedule.date },
    });

    return res.status(200).json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to update schedule");
  }
}

export async function deleteScheduleHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid schedule id" });
  }

  try {
    const existing = await prisma.appointmentSchedule.findUnique({
      where: { id },
      select: { id: true, date: true },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    await deleteScheduleById(id);

    recordActivity(res, {
      action: ActivityAction.SCHEDULE_DELETED,
      entityType: ActivityEntityType.AppointmentSchedule,
      entityId: id,
      metadata: { date: existing.date },
    });

    return res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to delete schedule");
  }
}

export async function getSlotDefaultsHandler(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.query.siteRef);
    const defaults = await getSlotDefaults(siteRef);
    return res.status(200).json({ success: true, data: defaults });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to get slot defaults");
  }
}

export async function updateSlotDefaultsHandler(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.body.siteRef ?? req.query.siteRef);
    const defaultSeatLimit = Number(req.body.defaultSeatLimit);
    const slots = parseSlotsInput(req.body.slots);

    if (!Number.isInteger(defaultSeatLimit) || defaultSeatLimit < 0) {
      return res.status(400).json({
        success: false,
        message: "defaultSeatLimit must be a non-negative integer",
      });
    }

    const updated = await upsertSlotDefaults(siteRef, {
      defaultSeatLimit,
      slots,
    });

    recordActivity(res, {
      action: ActivityAction.SLOT_DEFAULTS_UPDATED,
      entityType: ActivityEntityType.AppointmentSlotDefaultConfig,
      entityId: null,
      metadata: { siteRef },
    });

    return res.status(200).json({
      success: true,
      message: "Slot defaults updated successfully",
      data: updated,
    });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to update slot defaults");
  }
}

export async function getAvailableSlotsHandler(req: Request, res: Response) {
  try {
    const dateParam = req.query.date;
    if (typeof dateParam !== "string" || !dateParam.trim()) {
      return res.status(400).json({ success: false, message: "date query parameter is required" });
    }

    const date = parseScheduleDate(dateParam, "date");
    const siteRef = parseSiteRef(req.query.siteRef);

    const result = await getAvailableSlots({ date, siteRef });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to get available slots");
  }
}
