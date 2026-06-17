import { Router } from "express";
import * as contactController from "../../../controllers/contact/admin/contact.controller.js";
import { requireAdminAuth } from "../../../modules/adminAuth/adminAuth.middleware.js";

export const contactAdminRouter = Router();

contactAdminRouter.use(requireAdminAuth);

contactAdminRouter.get("/", contactController.listContactMessages);
contactAdminRouter.get("/:id", contactController.getContactMessageById);
contactAdminRouter.patch("/:id/status", contactController.updateContactMessageStatus);
contactAdminRouter.delete("/:id", contactController.deleteContactMessage);
