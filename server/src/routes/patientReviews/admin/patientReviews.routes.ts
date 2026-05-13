import { Router } from "express";
import * as patientReviewsAdmin from "../../../controllers/patientReviews/admin/patientReviews.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../../shared/middleware/admin/admin.middleware.js";

export const patientReviewsAdminRouter = Router();

patientReviewsAdminRouter.use(requireAuth);
patientReviewsAdminRouter.use(requireAdmin);

patientReviewsAdminRouter.get("/", patientReviewsAdmin.listPatientReviewsForAdmin);
patientReviewsAdminRouter.get(
  "/with-videos",
  patientReviewsAdmin.listPatientReviewsWithVideosForAdmin,
);
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
