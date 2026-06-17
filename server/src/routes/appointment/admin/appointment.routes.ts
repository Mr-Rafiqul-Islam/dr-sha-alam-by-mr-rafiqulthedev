import { Router } from "express";
import * as appointmentController from "../../../controllers/appointment/appointment.controller.js";
import { requireAdminAuth } from "../../../modules/adminAuth/adminAuth.middleware.js";

export const appointmentAdminRouter = Router();

appointmentAdminRouter.use(requireAdminAuth);

appointmentAdminRouter.get("/", appointmentController.getAllAppointments);
appointmentAdminRouter.get("/day/:date", appointmentController.getAppointmentsByDay);
appointmentAdminRouter.get(
  "/month/:month/:year/calendar",
  appointmentController.getAppointmentsByMonthForCalendar,
);
appointmentAdminRouter.get(
  "/month/:month/:year",
  appointmentController.getAppointmentsByMonth,
);
appointmentAdminRouter.patch(
  "/:id/status",
  appointmentController.updateAppointmentStatus,
);
appointmentAdminRouter.delete("/:id", appointmentController.deleteAppointment);
