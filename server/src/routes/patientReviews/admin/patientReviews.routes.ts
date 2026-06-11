import { Router } from "express";
import * as patientReviewsAdmin from "../../../controllers/patientReviews/admin/patientReviews.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../../shared/middleware/admin/admin.middleware.js";
import { upload, parseMultipartFormFields } from "../../../shared/middleware/multer.js";
import { handleImageUpload } from "../../../utils/handleImageUpload.js";


export const patientReviewsAdminRouter = Router();

// patientReviewsAdminRouter.use(requireAuth);
// patientReviewsAdminRouter.use(requireAdmin);

patientReviewsAdminRouter.post(
  "/upload-image",
  upload.single("drsa-file"),
  handleImageUpload,
);

patientReviewsAdminRouter.get("/", patientReviewsAdmin.listPatientReviewsForAdmin);
patientReviewsAdminRouter.get(
  "/with-videos",
  patientReviewsAdmin.listPatientReviewsWithVideosForAdmin,
);
patientReviewsAdminRouter.post(
  "/",
  parseMultipartFormFields,
  patientReviewsAdmin.createPatientReview,
);
patientReviewsAdminRouter.patch(
  "/:id/status",
  patientReviewsAdmin.updatePatientReviewStatus,
);
patientReviewsAdminRouter.post(
  "/:id/thumbnail/upload",
  upload.single("my_file"),
  patientReviewsAdmin.uploadPatientReviewThumbnail,
);
patientReviewsAdminRouter.post(
  "/:id/video/mux-upload",
  patientReviewsAdmin.createMuxUploadForPatientReview,
);
