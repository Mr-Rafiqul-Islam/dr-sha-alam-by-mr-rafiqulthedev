import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { extractTokenFromHeader, verifyAccessToken } from "../../shared/utils/token.js";
import {
  canAccessAdminPermission,
  isStaffPanelRole,
  type AdminPermission,
} from "./adminPermissions.js";
import { getAdminById } from "./adminAuth.service.js";
import { ADMIN_TOKEN_COOKIE } from "./adminAuth.cookie.js";

function extractAdminToken(req: Request): string | null {
  const headerToken = extractTokenFromHeader(req);
  if (headerToken) {
    return headerToken;
  }

  const cookieToken = req.cookies?.[ADMIN_TOKEN_COOKIE];
  if (typeof cookieToken === "string" && cookieToken.trim()) {
    return cookieToken.trim();
  }

  return null;
}

export async function requireAdminAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractAdminToken(req);
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
    return;
  }

  let payload: jwt.JwtPayload;
  try {
    payload = verifyAccessToken(token);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Access token expired. Please sign in again.",
      });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid access token.",
      });
      return;
    }
    if (err instanceof Error && err.message === "JWT_SECRET is not set") {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Authentication error.",
      });
      return;
    }
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
    return;
  }

  const userId =
    (typeof payload.sub === "string" && payload.sub) ||
    (typeof payload.id === "string" && payload.id) ||
    null;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
    return;
  }

  try {
    const user = await getAdminById(userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Account not found.",
      });
      return;
    }

    if (!isStaffPanelRole(user.role)) {
      res.status(403).json({
        success: false,
        message: "Admin privileges required.",
      });
      return;
    }

    req.user = user;
    req.admin = user;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Authentication error.",
    });
  }
}

export async function optionalAdminAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractAdminToken(req);
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const userId =
      (typeof payload.sub === "string" && payload.sub) ||
      (typeof payload.id === "string" && payload.id) ||
      null;

    if (!userId) {
      next();
      return;
    }

    const user = await getAdminById(userId);
    if (user && isStaffPanelRole(user.role)) {
      req.user = user;
      req.admin = user;
      req.tokenPayload = payload;
    }
  } catch {
    // Public route — ignore invalid or expired admin tokens.
  }

  next();
}

export function requireAdminPermission(...permissions: AdminPermission[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const hasAccess = permissions.every((permission) =>
      canAccessAdminPermission(req.admin!.role, permission),
    );

    if (!hasAccess) {
      res.status(403).json({
        success: false,
        message: "Insufficient privileges.",
      });
      return;
    }

    next();
  };
}
