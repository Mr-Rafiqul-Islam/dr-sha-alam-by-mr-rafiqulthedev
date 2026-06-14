import { Router } from "express";
import * as contactController from "../../../controllers/contact/admin/contact.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../../shared/middleware/admin/admin.middleware.js";

export const contactAdminRouter = Router();

// contactAdminRouter.use(requireAuth);
// contactAdminRouter.use(requireAdmin);

contactAdminRouter.get("/", contactController.listContactMessages);
contactAdminRouter.get("/:id", contactController.getContactMessageById);
contactAdminRouter.patch("/:id/status", contactController.updateContactMessageStatus);
contactAdminRouter.delete("/:id", contactController.deleteContactMessage);
