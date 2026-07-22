import { Router } from "express";
import * as appointmentController from "../../../controllers/appointment/appointment.controller.js";
import { adminActivityTracing } from "../../../modules/activity/activity.middleware.js";
import { requireAdminAuth, requireAdminPermission } from "../../../modules/adminAuth/adminAuth.middleware.js";

export const appointmentAdminRouter = Router();

appointmentAdminRouter.use(requireAdminAuth);
appointmentAdminRouter.use(requireAdminPermission("appointments"));
appointmentAdminRouter.use(adminActivityTracing());

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
appointmentAdminRouter.patch(
  "/:id/serial",
  appointmentController.updateAppointmentSerial,
);
appointmentAdminRouter.delete("/:id", appointmentController.deleteAppointment);
