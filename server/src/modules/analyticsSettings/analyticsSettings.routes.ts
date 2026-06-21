import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import {
  getAnalyticsSettingsHandler,
  getClientAnalyticsConfigHandler,
  upsertAnalyticsSettingsHandler,
} from "./analyticsSettings.controller.js";

export const analyticsSettingsAdminRouter = Router();
export const analyticsSettingsClientRouter = Router();

analyticsSettingsClientRouter.get("/", getClientAnalyticsConfigHandler);

analyticsSettingsAdminRouter.use(requireAdminAuth);
analyticsSettingsAdminRouter.use(requireAdminPermission("analyticsSettings"));

analyticsSettingsAdminRouter.get("/", getAnalyticsSettingsHandler);
analyticsSettingsAdminRouter.patch("/", upsertAnalyticsSettingsHandler);
