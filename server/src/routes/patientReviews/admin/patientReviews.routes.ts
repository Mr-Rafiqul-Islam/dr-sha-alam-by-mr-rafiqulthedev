import { Router } from "express";
import * as patientReviewsAdmin from "../../../controllers/patientReviews/admin/patientReviews.controller.js";

export const patientReviewsAdminRouter = Router();

patientReviewsAdminRouter.post("/", patientReviewsAdmin.createPatientReview);
patientReviewsAdminRouter.patch(
  "/:id/status",
  patientReviewsAdmin.updatePatientReviewStatus,
);
patientReviewsAdminRouter.post(
  "/:id/video/mux-upload",
  patientReviewsAdmin.createMuxUploadForPatientReview,
);
patientReviewsAdminRouter.post(
  "/:id/video",
  patientReviewsAdmin.attachEmbedOrDirectVideo,
);
