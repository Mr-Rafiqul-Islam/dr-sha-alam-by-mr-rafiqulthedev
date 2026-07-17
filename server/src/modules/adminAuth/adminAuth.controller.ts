import type { Request, Response } from "express";
import {
  ADMIN_TOKEN_COOKIE,
  getAdminTokenClearCookieOptions,
  getAdminTokenCookieOptions,
} from "./adminAuth.cookie.js";
import {
  AdminAuthError,
  getAdminById,
  loginAdmin,
} from "./adminAuth.service.js";
import {
  AdminAuthValidationError,
  parseAdminLoginBody,
} from "./adminAuth.validation.js";

function handleAdminAuthError(
  res: Response,
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof AdminAuthValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof AdminAuthError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const input = parseAdminLoginBody(req.body);
    const result = await loginAdmin(input);

    res.cookie(
      ADMIN_TOKEN_COOKIE,
      result.token,
      getAdminTokenCookieOptions(),
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error) {
    return handleAdminAuthError(res, error, "Login failed");
  }
}

export async function meHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.id ?? req.admin?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await getAdminById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return handleAdminAuthError(res, error, "Failed to load admin profile");
  }
}

export async function logoutHandler(_req: Request, res: Response) {
  res.clearCookie(ADMIN_TOKEN_COOKIE, getAdminTokenClearCookieOptions());

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}
