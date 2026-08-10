import type { Request, Response } from "express";
import {
  ActivityAction,
  ActivityEntityType,
} from "../activity/activity.service.js";
import { recordActivity } from "../activity/activity.middleware.js";
import { getAdminAppointmentListContext } from "../appointment/appointmentAdminContext.js";
import {
  AppointmentValidationError,
  handleAppointmentError,
} from "../appointment/appointment.utils.js";
import { parseSiteRef } from "../appointmentSchedule/appointmentSchedule.validation.js";
import { parseOptionalBusinessDate } from "../../utils/bangladeshDate.js";
import {
  getAppointmentRevenueFees,
  getAppointmentRevenueSummary,
  updateAppointmentRevenueFees,
} from "./appointmentRevenue.service.js";
import { parseRevenueFeesBody } from "./appointmentRevenue.validation.js";

export async function getRevenueSummaryHandler(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.query.siteRef);
    const dateYmd = parseOptionalBusinessDate(req.query.date);
    const { pendingDeleteWhere } = await getAdminAppointmentListContext(req);

    const data = await getAppointmentRevenueSummary({
      dateYmd,
      siteRef,
      pendingDeleteWhere,
    });

    return res.status(200).json({
      success: true,
      message: "Appointment revenue summary retrieved successfully",
      data,
    });
  } catch (error) {
    return handleAppointmentError(
      res,
      error,
      "Failed to get appointment revenue summary",
    );
  }
}

export async function getRevenueFeesHandler(req: Request, res: Response) {
  try {
    const siteRef = parseSiteRef(req.query.siteRef);

    const data = await getAppointmentRevenueFees(siteRef);

    return res.status(200).json({
      success: true,
      message: "Appointment revenue fees retrieved successfully",
      data,
    });
  } catch (error) {
    return handleAppointmentError(
      res,
      error,
      "Failed to get appointment revenue fees",
    );
  }
}

export async function updateRevenueFeesHandler(req: Request, res: Response) {
  try {
    const { siteRef, fees } = parseRevenueFeesBody(req.body);
    const { data, oldFees } = await updateAppointmentRevenueFees({ siteRef, fees });

    recordActivity(res, {
      action: ActivityAction.APPOINTMENT_REVENUE_FEES_UPDATED,
      entityType: ActivityEntityType.AppointmentRevenueFee,
      entityId: siteRef,
      metadata: {
        siteRef,
        oldFees,
        newFees: data.fees,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Appointment revenue fees updated successfully",
      data,
    });
  } catch (error) {
    return handleAppointmentError(
      res,
      error,
      "Failed to update appointment revenue fees",
    );
  }
}
