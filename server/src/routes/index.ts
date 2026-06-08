import type { Express } from "express";
import { appointmentAdminRouter } from "./appointment/admin/appointment.routes.js";
import { appointmentClientRouter } from "./appointment/client/appointment.routes.js";
import { blogsAdminRouter } from "./blogs/admin/blogs.routes.js";
import { blogsClientRouter } from "./blogs/client/blogs.routes.js";
import { patientReviewsAdminRouter } from "./patientReviews/admin/patientReviews.routes.js";
import { patientReviewsClientRouter } from "./patientReviews/client/patientReviews.routes.js";
import { successStoriesAdminRouter } from "./successStories/admin/successStories.routes.js";
import { successStoriesClientRouter } from "./successStories/client/successStories.routes.js";

/**
 * Mount all routes on the app. Base paths match `/api/v1/...`.
 */
export function mountRoutes(app: Express): void {
  app.use("/api/v1/client/appointments", appointmentClientRouter);
  app.use("/api/v1/admin/appointments", appointmentAdminRouter);
  app.use("/api/v1/client/patient-reviews", patientReviewsClientRouter);
  app.use("/api/v1/admin/patient-reviews", patientReviewsAdminRouter);
  app.use("/api/v1/client/success-stories", successStoriesClientRouter);
  app.use("/api/v1/admin/success-stories", successStoriesAdminRouter);
  app.use("/api/v1/client/blogs", blogsClientRouter);
  app.use("/api/v1/admin/blogs", blogsAdminRouter);
}
