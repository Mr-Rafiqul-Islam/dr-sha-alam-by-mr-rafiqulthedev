import type { Express } from "express";
import { appointmentAdminRouter } from "./appointment/admin/appointment.routes.js";
import { appointmentClientRouter } from "./appointment/client/appointment.routes.js";
import {
  appointmentScheduleAdminRouter,
  appointmentScheduleClientRouter,
} from "../modules/appointmentSchedule/appointmentSchedule.routes.js";
import { blogsAdminRouter } from "./blogs/admin/blogs.routes.js";
import { blogsClientRouter } from "./blogs/client/blogs.routes.js";
import { contactAdminRouter } from "./contact/admin/contact.routes.js";
import { contactClientRouter } from "./contact/client/contact.routes.js";
import { paymentRouter } from "./payment/payment.routes.js";
import { adminAuthRouter } from "../modules/adminAuth/adminAuth.routes.js";
import { activityAdminRouter } from "../modules/activity/activity.routes.js";
import { adminManagementRouter } from "../modules/adminManagement/adminManagement.routes.js";
import { deleteRequestAdminRouter } from "./deleteRequest/admin/deleteRequest.routes.js";
import {
  analyticsSettingsAdminRouter,
  analyticsSettingsClientRouter,
} from "../modules/analyticsSettings/analyticsSettings.routes.js";
import { appointmentRevenueAdminRouter } from "../modules/appointmentRevenue/appointmentRevenue.route.js";
import { announcementAdminRouter } from "./announcement/admin/announcement.routes.js";
import { paymentSettingsAdminRouter } from "../modules/paymentSettings/paymentSettings.routes.js";


/**
 * Mount all routes on the app. Base paths match `/api/v1/...`.
 */
export function mountRoutes(app: Express): void {
  app.use("/api/v1/admin/auth", adminAuthRouter);
  app.use("/api/v1/admin/activity", activityAdminRouter);
  app.use("/api/v1/admin/users", adminManagementRouter);
  app.use("/api/v1/admin/delete-requests", deleteRequestAdminRouter);
  app.use("/api/v1/admin/analytics-settings", analyticsSettingsAdminRouter);
  app.use("/api/v1/client/analytics-config", analyticsSettingsClientRouter);
  app.use("/api/v1/client/appointments", appointmentClientRouter);
  app.use("/api/v1/admin/appointments", appointmentAdminRouter);
  app.use("/api/v1/admin/appointment-schedules", appointmentScheduleAdminRouter);
  app.use("/api/v1/client/appointment-schedules", appointmentScheduleClientRouter);
  app.use("/api/v1/client/blogs", blogsClientRouter);
  app.use("/api/v1/admin/blogs", blogsAdminRouter);
  app.use("/api/v1/client/contact-messages", contactClientRouter);
  app.use("/api/v1/admin/contact-messages", contactAdminRouter);
  app.use("/api/v1/admin/announcements", announcementAdminRouter);
  app.use("/api/v1/admin/appointment-revenue", appointmentRevenueAdminRouter);
  app.use("/api/v1/admin/payment-settings", paymentSettingsAdminRouter);
  app.use("/api/v1/payment", paymentRouter);
}
