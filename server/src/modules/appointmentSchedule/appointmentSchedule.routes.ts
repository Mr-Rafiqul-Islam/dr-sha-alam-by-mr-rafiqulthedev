import { Router } from "express";
import {
  createOrUpsertSchedule,
  deleteScheduleHandler,
  getScheduleByIdHandler,
  getSlotDefaultsHandler,
  listClientSchedulesHandler,
  listSchedulesHandler,
  updateScheduleHandler,
  updateSlotDefaultsHandler,
} from "./appointmentSchedule.controller.js";
import { requireAdminAuth, requireAdminPermission } from "../adminAuth/adminAuth.middleware.js";
import { adminActivityTracing } from "../activity/activity.middleware.js";

export const appointmentScheduleAdminRouter = Router();
export const appointmentScheduleClientRouter = Router();

appointmentScheduleClientRouter.get("/", listClientSchedulesHandler);
appointmentScheduleClientRouter.get("/defaults", getSlotDefaultsHandler);

appointmentScheduleAdminRouter.use(requireAdminAuth);
appointmentScheduleAdminRouter.use(requireAdminPermission("appointmentSchedules"));
appointmentScheduleAdminRouter.use(adminActivityTracing());

appointmentScheduleAdminRouter.get("/defaults", getSlotDefaultsHandler);
appointmentScheduleAdminRouter.patch("/defaults", updateSlotDefaultsHandler);
appointmentScheduleAdminRouter.get("/", listSchedulesHandler);
appointmentScheduleAdminRouter.get("/:id", getScheduleByIdHandler);
appointmentScheduleAdminRouter.post("/", createOrUpsertSchedule);
appointmentScheduleAdminRouter.patch("/:id", updateScheduleHandler);
appointmentScheduleAdminRouter.delete("/:id", deleteScheduleHandler);
