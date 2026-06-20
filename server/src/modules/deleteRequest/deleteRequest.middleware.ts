import type { NextFunction, Request, Response } from "express";
import { DELETE_APPROVAL_ROLES } from "./deleteRequest.types.js";

export function requireDeleteApprovalRole(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.admin) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  if (!DELETE_APPROVAL_ROLES.has(req.admin.role)) {
    res.status(403).json({
      success: false,
      message: "Insufficient privileges.",
    });
    return;
  }

  next();
}
