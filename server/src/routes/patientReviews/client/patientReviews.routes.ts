import { Router } from "express";
import * as patientReviewsClient from "../../../controllers/patientReviews/client/patientReviews.controller.js";

export const patientReviewsClientRouter = Router();

patientReviewsClientRouter.get("/", patientReviewsClient.getPatientReviews);
patientReviewsClientRouter.get(
  "/videos",
  patientReviewsClient.getAllPatientReviewVideos,
);
patientReviewsClientRouter.post("/", patientReviewsClient.submitPatientReview);
patientReviewsClientRouter.get(
  "/:id/video",
  patientReviewsClient.getPatientReviewVideo,
);
