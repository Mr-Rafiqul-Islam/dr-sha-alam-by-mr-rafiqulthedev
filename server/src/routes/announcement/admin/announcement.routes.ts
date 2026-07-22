import { Router } from "express";
import * as announcementController from "../../../controllers/announcement/admin/announcement.controller.js";
import { adminActivityTracing } from "../../../modules/activity/activity.middleware.js";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../../../modules/adminAuth/adminAuth.middleware.js";

export const announcementAdminRouter = Router();

announcementAdminRouter.use(requireAdminAuth);
announcementAdminRouter.use(requireAdminPermission("announcements"));
announcementAdminRouter.use(adminActivityTracing());

announcementAdminRouter.get("/", announcementController.listAnnouncements);
announcementAdminRouter.get(
  "/active",
  announcementController.listActiveAnnouncements,
);
announcementAdminRouter.get("/feed", announcementController.listAnnouncementFeed);
announcementAdminRouter.get(
  "/unread-count",
  announcementController.getUnreadAnnouncementCount,
);
announcementAdminRouter.get("/:id", announcementController.getAnnouncementById);
announcementAdminRouter.post("/", announcementController.createAnnouncement);
announcementAdminRouter.patch(
  "/:id",
  announcementController.updateAnnouncement,
);
announcementAdminRouter.delete(
  "/:id",
  announcementController.deleteAnnouncement,
);
announcementAdminRouter.post(
  "/:id/read",
  announcementController.markAnnouncementRead,
);
