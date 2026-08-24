import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import { FULL_ACCESS_ROLES } from "../adminAuth/adminPermissions.js";
import { upload } from "../../shared/middleware/multer.js";
import {
  createImageDeleteHandler,
  createImageUploadHandler,
} from "../../utils/handleImageUpload.js";
import {
  getPaymentSettingsHandler,
  upsertPaymentSettingsHandler,
} from "./paymentSettings.controller.js";
import type { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";

export const paymentSettingsAdminRouter = Router();

paymentSettingsAdminRouter.use(requireAdminAuth);
paymentSettingsAdminRouter.use(requireAdminPermission("appointments"));

function requireFullAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const role = req.admin?.role;
  if (!role || !FULL_ACCESS_ROLES.has(role as UserRole)) {
    res.status(403).json({
      success: false,
      message: "You do not have permission to update payment settings.",
    });
    return;
  }
  next();
}

export const handlePaymentSettingImageUpload = createImageUploadHandler(
  "payment-settings",
  (uploaded) => ({
    image: uploaded.optimizedUrl,
    imagePublicId: uploaded.imageId,
  }),
);
export const handlePaymentSettingImageDelete =
  createImageDeleteHandler("imagePublicId");

paymentSettingsAdminRouter.get("/", getPaymentSettingsHandler);
paymentSettingsAdminRouter.patch("/", requireFullAccess, upsertPaymentSettingsHandler);
paymentSettingsAdminRouter.post(
  "/upload-image",
  requireFullAccess,
  upload.single("drsa-file"),
  handlePaymentSettingImageUpload,
);
paymentSettingsAdminRouter.delete(
  "/upload-image",
  requireFullAccess,
  handlePaymentSettingImageDelete,
);
