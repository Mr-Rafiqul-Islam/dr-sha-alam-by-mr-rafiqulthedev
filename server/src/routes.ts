import type { Express } from "express";
import { patientReviewsAdminRouter } from "./routes/patientReviews/admin/patientReviews.routes.js";
import { patientReviewsClientRouter } from "./routes/patientReviews/client/patientReviews.routes.js";

/**
 * Mount all routes on the app. Base paths match `/api/v1/...`.
 */
export function mountRoutes(app: Express): void {
  app.use("/api/v1/client/patient-reviews", patientReviewsClientRouter);
  app.use("/api/v1/admin/patient-reviews", patientReviewsAdminRouter);
}
