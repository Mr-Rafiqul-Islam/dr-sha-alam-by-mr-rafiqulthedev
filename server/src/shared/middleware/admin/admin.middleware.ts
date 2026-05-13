import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { extractTokenFromHeader, verifyAccessToken } from "../../utils/token.js";

const CONTENT_MANAGER_ROLES = new Set<UserRole>([
  UserRole.ADMIN,
  UserRole.EDITOR,
]);

/**
 * Proves a valid admin access JWT and loads the current user from PostgreSQL
 * (subject claim = user id). Sets `req.admin` and `req.tokenPayload`.
 *
 * Chain role middleware **after** this; it assumes `req.admin` may be set.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = extractTokenFromHeader(req);
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authorization header missing or invalid.",
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

  const sub = payload.sub;
  if (!sub) {
    res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        provider: true,
        providerId: true,
        doctorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Account not found.",
      });
      return;
    }

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

function sendAuthRequired(res: Response): void {
  res.status(401).json({
    success: false,
    message: "Authentication required.",
  });
}

/** `UserRole.ADMIN` only (staff admin panel). */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.admin) {
    sendAuthRequired(res);
    return;
  }
  if (req.admin.role !== UserRole.ADMIN) {
    res.status(403).json({
      success: false,
      message: "Admin privileges required.",
    });
    return;
  }
  next();
}

/**
 * Alias for this schema: super-admin style routes still use `UserRole.ADMIN`.
 * Extend when you add finer-grained roles in Prisma.
 */
export function requireSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  requireAdmin(req, res, next);
}

/** `ADMIN` or `EDITOR` — intended for create/update/delete on content. */
export function requireContentManager(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.admin) {
    sendAuthRequired(res);
    return;
  }
  if (!CONTENT_MANAGER_ROLES.has(req.admin.role)) {
    res.status(403).json({
      success: false,
      message: "Admin or Editor privileges required.",
    });
    return;
  }
  next();
}

/** Ad-hoc role check using the loaded `req.admin` user. */
export function hasRole(
  admin: Request["admin"],
  role: UserRole,
): boolean {
  if (!admin) {
    return false;
  }
  return admin.role === role;
}
