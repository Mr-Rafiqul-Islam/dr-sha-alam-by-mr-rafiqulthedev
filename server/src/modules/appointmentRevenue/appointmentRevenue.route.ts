import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import { adminActivityTracing } from "../activity/activity.middleware.js";
import {
  getRevenueFeesHandler,
  getRevenueSummaryHandler,
  updateRevenueFeesHandler,
} from "./appointmentRevenue.controller.js";

export const appointmentRevenueAdminRouter = Router();

appointmentRevenueAdminRouter.use(requireAdminAuth);
appointmentRevenueAdminRouter.use(requireAdminPermission("appointments"));
appointmentRevenueAdminRouter.use(adminActivityTracing());

appointmentRevenueAdminRouter.get("/summary", getRevenueSummaryHandler);
appointmentRevenueAdminRouter.get("/fees", getRevenueFeesHandler);
appointmentRevenueAdminRouter.patch("/fees", updateRevenueFeesHandler);
