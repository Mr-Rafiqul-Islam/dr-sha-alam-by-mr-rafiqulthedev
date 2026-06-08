import { Router } from "express";
import * as appointmentController from "../../../controllers/appointment/appointment.controller.js";

export const appointmentClientRouter = Router();

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
