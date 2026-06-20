import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import * as activityController from "./activity.controller.js";

export const activityAdminRouter = Router();

activityAdminRouter.use(requireAdminAuth);
activityAdminRouter.use(requireAdminPermission("dashboard"));

activityAdminRouter.get("/staff", activityController.getTraceableStaff);
activityAdminRouter.get("/", activityController.getActivityFeed);
