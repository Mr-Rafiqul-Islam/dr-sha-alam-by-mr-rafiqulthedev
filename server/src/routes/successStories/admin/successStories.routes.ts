import { Router } from "express";
import * as successStoriesAdmin from "../../../controllers/successStories/admin/successStories.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../../shared/middleware/admin/admin.middleware.js";

export const successStoriesAdminRouter = Router();

successStoriesAdminRouter.use(requireAuth);
successStoriesAdminRouter.use(requireAdmin);

successStoriesAdminRouter.get("/", successStoriesAdmin.listSuccessStoriesForAdmin);
successStoriesAdminRouter.post("/", successStoriesAdmin.createSuccessStory);
successStoriesAdminRouter.patch(
  "/:id/status",
  successStoriesAdmin.updateSuccessStoryStatus,
);
successStoriesAdminRouter.patch("/:id", successStoriesAdmin.updateSuccessStory);
