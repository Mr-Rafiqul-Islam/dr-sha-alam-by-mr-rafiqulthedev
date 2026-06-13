import type { Request, Response } from "express";
import {
  type CloudinaryUploadResult,
  deleteImageByPublicId,
  uploadImageBuffer,
} from "../services/cloudinary/cloudinary.service.js";

function handleCloudinaryImageError(
  res: Response,
  error: unknown,
  logLabel: string,
  fallbackMessage: string,
): Response {
  console.error(`${logLabel}:`, error);

  const message = error instanceof Error ? error.message : fallbackMessage;

  if (message === "CLOUDINARY_NOT_CONFIGURED") {
    return res.status(503).json({
      success: false,
      message: "Image service is not configured",
    });
  }

  return res.status(500).json({
    success: false,
    message,
  });
}

export function createImageUploadHandler(
  defaultFolder: string,
  mapPayload?: (uploaded: CloudinaryUploadResult) => Record<string, string>,
) {
  return async (req: Request, res: Response) => {
    try {
      if (!req.file?.buffer) {
        return res.status(400).json({
          success: false,
          message: 'Multipart field "drsa-file" is required',
        });
      }

      const folder =
        typeof req.body?.folder === "string" && req.body.folder.trim() !== ""
          ? req.body.folder.trim()
          : defaultFolder;

      const uploaded = await uploadImageBuffer(req.file.buffer, folder);

      return res.status(201).json({
        success: true,
        payload: mapPayload
          ? mapPayload(uploaded)
          : {
              imageId: uploaded.imageId,
              optimizedUrl: uploaded.optimizedUrl,
            },
      });
    } catch (error) {
      return handleCloudinaryImageError(
        res,
        error,
        "Image Upload Error",
        "Image upload failed",
      );
    }
  };
}

export function createImageDeleteHandler(publicIdField = "imagePublicId") {
  return async (req: Request, res: Response) => {
    try {
      const raw = req.body?.[publicIdField];
      if (raw === undefined || raw === null) {
        return res.status(400).json({
          success: false,
          message: `${publicIdField} is required`,
        });
      }

      const publicId = String(raw).trim();
      if (!publicId.length) {
        return res.status(400).json({
          success: false,
          message: `${publicIdField} cannot be empty`,
        });
      }

      const result = await deleteImageByPublicId(publicId);
      if (result === "not found") {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      return res.json({
        success: true,
        message: "Image deleted",
        payload: { imagePublicId: publicId },
      });
    } catch (error) {
      return handleCloudinaryImageError(
        res,
        error,
        "Image Delete Error",
        "Image delete failed",
      );
    }
  };
}

export const handleImageUpload = createImageUploadHandler("patient-reviews");
export const handleSuccessStoryImageUpload =
  createImageUploadHandler("success-stories");
export const handleBlogImageUpload = createImageUploadHandler(
  "blogs",
  (uploaded) => ({
    image: uploaded.optimizedUrl,
    imagePublicId: uploaded.imageId,
  }),
);
export const handleBlogImageDelete = createImageDeleteHandler("imagePublicId");
