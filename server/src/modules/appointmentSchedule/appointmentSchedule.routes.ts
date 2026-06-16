import { Router } from "express";
import {
  createOrUpsertSchedule,
  deleteScheduleHandler,
  getScheduleByIdHandler,
  listSchedulesHandler,
  updateScheduleHandler,
} from "./appointmentSchedule.controller.js";
// import { requireAdmin, requireAuth } from "../../shared/middleware/admin/admin.middleware.js";

export const appointmentScheduleAdminRouter = Router();

// appointmentScheduleAdminRouter.use(requireAuth);
// appointmentScheduleAdminRouter.use(requireAdmin);

appointmentScheduleAdminRouter.get("/", listSchedulesHandler);
appointmentScheduleAdminRouter.get("/:id", getScheduleByIdHandler);
appointmentScheduleAdminRouter.post("/", createOrUpsertSchedule);
appointmentScheduleAdminRouter.patch("/:id", updateScheduleHandler);
appointmentScheduleAdminRouter.delete("/:id", deleteScheduleHandler);
