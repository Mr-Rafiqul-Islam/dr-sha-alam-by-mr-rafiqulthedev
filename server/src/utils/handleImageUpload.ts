import type { Request, Response } from "express";
import { uploadImageBuffer } from "../services/cloudinary/cloudinary.service.js";

export function createImageUploadHandler(defaultFolder: string) {
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
        payload: {
          imageId: uploaded.imageId,
          optimizedUrl: uploaded.optimizedUrl,
        },
      });
    } catch (error) {
      console.error("Image Upload Error:", error);

      const message =
        error instanceof Error ? error.message : "Image upload failed";

      if (message === "CLOUDINARY_NOT_CONFIGURED") {
        return res.status(503).json({
          success: false,
          message: "Image upload is not configured",
        });
      }

      return res.status(500).json({
        success: false,
        message,
      });
    }
  };
}

export const handleImageUpload = createImageUploadHandler("patient-reviews");
export const handleSuccessStoryImageUpload =
  createImageUploadHandler("success-stories");
