import { Router } from "express";
import * as appointmentController from "../../../controllers/appointment/appointment.controller.js";
import { getAvailableSlotsHandler } from "../../../modules/appointmentSchedule/appointmentSchedule.controller.js";

export const appointmentClientRouter = Router();

appointmentClientRouter.get("/schedules/available", getAvailableSlotsHandler);
appointmentClientRouter.post("/", appointmentController.createAppointment);
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
