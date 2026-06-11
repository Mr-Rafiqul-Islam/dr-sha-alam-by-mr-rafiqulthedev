import type { NextFunction, Request, Response } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

/** Parses multipart text fields only when the request is actually form-data. */
export function parseMultipartFormFields(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const contentType = req.headers["content-type"] ?? "";
  if (contentType.includes("multipart/form-data")) {
    upload.none()(req, res, next);
    return;
  }
  next();
}
