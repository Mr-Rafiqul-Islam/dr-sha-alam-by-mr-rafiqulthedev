import type { Request, Response } from "express";
import { handleAppointmentError } from "../appointment/appointment.utils.js";
import { routeParamString } from "../../utils/express-params.js";
import {
  createDefaultScheduleForDate,
  deleteScheduleById,
  getAvailableSlots,
  getScheduleById,
  listSchedules,
  updateScheduleById,
  upsertScheduleByDate,
} from "./appointmentSchedule.service.js";
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

    let slots = req.body.slots;
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

      return res.status(201).json({ success: true, data: schedule });
    }

    const parsedSlots = parseSlotsInput(slots, { allowEmpty: isClosed === true });
    const schedule = await upsertScheduleByDate({
      siteRef,
      date,
      title,
      status,
      isClosed,
      slots: parsedSlots,
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
    await deleteScheduleById(id);
    return res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return handleScheduleError(res, error, "Failed to delete schedule");
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
