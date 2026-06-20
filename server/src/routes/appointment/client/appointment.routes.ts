import { Router } from "express";
import * as appointmentController from "../../../controllers/appointment/appointment.controller.js";
import { adminActivityTracing } from "../../../modules/activity/activity.middleware.js";
import { optionalAdminAuth } from "../../../modules/adminAuth/adminAuth.middleware.js";
import { getAvailableSlotsHandler } from "../../../modules/appointmentSchedule/appointmentSchedule.controller.js";

export const appointmentClientRouter = Router();

appointmentClientRouter.get("/schedules/available", getAvailableSlotsHandler);
appointmentClientRouter.post(
  "/",
  optionalAdminAuth,
  adminActivityTracing(),
  appointmentController.createAppointment,
);
appointmentClientRouter.get(
  "/phone/:phone",
  appointmentController.getAppointmentsByPhone,
);
appointmentClientRouter.patch(
  "/:id/cancel",
  appointmentController.cancelAppointment,
);
appointmentClientRouter.patch(
  "/:id/reschedule",
  appointmentController.rescheduleAppointment,
);
appointmentClientRouter.get("/:id", appointmentController.getAppointmentsById);
