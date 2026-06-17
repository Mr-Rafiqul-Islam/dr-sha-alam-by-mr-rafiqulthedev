import { Router } from "express";
import {
  createOrUpsertSchedule,
  deleteScheduleHandler,
  getScheduleByIdHandler,
  listClientSchedulesHandler,
  listSchedulesHandler,
  updateScheduleHandler,
} from "./appointmentSchedule.controller.js";
import { requireAdminAuth } from "../adminAuth/adminAuth.middleware.js";

export const appointmentScheduleAdminRouter = Router();
export const appointmentScheduleClientRouter = Router();

appointmentScheduleClientRouter.get("/", listClientSchedulesHandler);

appointmentScheduleAdminRouter.use(requireAdminAuth);

appointmentScheduleAdminRouter.get("/", listSchedulesHandler);
appointmentScheduleAdminRouter.get("/:id", getScheduleByIdHandler);
appointmentScheduleAdminRouter.post("/", createOrUpsertSchedule);
appointmentScheduleAdminRouter.patch("/:id", updateScheduleHandler);
appointmentScheduleAdminRouter.delete("/:id", deleteScheduleHandler);
