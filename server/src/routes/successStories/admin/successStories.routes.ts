import { Router } from "express";
import * as successStoriesAdmin from "../../../controllers/successStories/admin/successStories.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../../shared/middleware/admin/admin.middleware.js";
import { upload } from "../../../shared/middleware/multer.js";
import { handleSuccessStoryImageUpload } from "../../../utils/handleImageUpload.js";

export const successStoriesAdminRouter = Router();

// successStoriesAdminRouter.use(requireAuth);
// successStoriesAdminRouter.use(requireAdmin);

successStoriesAdminRouter.post(
  "/upload-image",
  upload.single("drsa-file"),
  handleSuccessStoryImageUpload,
);

successStoriesAdminRouter.get("/", successStoriesAdmin.listSuccessStoriesForAdmin);
successStoriesAdminRouter.post("/", successStoriesAdmin.createSuccessStory);
successStoriesAdminRouter.patch(
  "/:id/status",
  successStoriesAdmin.updateSuccessStoryStatus,
);
successStoriesAdminRouter.post(
  "/:id/image/upload",
  upload.single("drsa-file"),
  successStoriesAdmin.uploadSuccessStoryImage,
);
successStoriesAdminRouter.patch("/:id", successStoriesAdmin.updateSuccessStory);
