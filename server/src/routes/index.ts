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


/**
 * Mount all routes on the app. Base paths match `/api/v1/...`.
 */
export function mountRoutes(app: Express): void {
  app.use("/api/v1/admin/auth", adminAuthRouter);
  app.use("/api/v1/client/appointments", appointmentClientRouter);
  app.use("/api/v1/admin/appointments", appointmentAdminRouter);
  app.use("/api/v1/admin/appointment-schedules", appointmentScheduleAdminRouter);
  app.use("/api/v1/client/appointment-schedules", appointmentScheduleClientRouter);
  app.use("/api/v1/client/blogs", blogsClientRouter);
  app.use("/api/v1/admin/blogs", blogsAdminRouter);
  app.use("/api/v1/client/contact-messages", contactClientRouter);
  app.use("/api/v1/admin/contact-messages", contactAdminRouter);
  app.use("/api/v1/payment", paymentRouter);
}
