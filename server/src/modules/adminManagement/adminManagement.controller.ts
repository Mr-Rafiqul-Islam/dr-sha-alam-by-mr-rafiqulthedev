import type { Request, Response } from "express";
import { UserRole } from "@prisma/client";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  AdminManagementError,
  setAdminUserActive,
  updateAdminUser,
} from "./adminManagement.service.js";
import {
  AdminManagementValidationError,
  parseActiveBody,
  parseCreateAdminBody,
  parseStaffRole,
  parseUpdateAdminBody,
} from "./adminManagement.validation.js";

function getActor(req: Request): { id: string; role: UserRole } | null {
  if (!req.admin) {
    return null;
  }
  return { id: req.admin.id, role: req.admin.role };
}

function handleError(res: Response, error: unknown, fallback: string) {
  if (
    error instanceof AdminManagementError ||
    error instanceof AdminManagementValidationError
  ) {
    const statusCode =
      error instanceof AdminManagementError ? error.statusCode : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(fallback, error);
  return res.status(500).json({
    success: false,
    message: fallback,
  });
}

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return undefined;
}

function parsePositiveInt(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(1, Math.floor(value));
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return Math.max(1, parsed);
    }
  }
  return fallback;
}

export async function listAdminUsersHandler(req: Request, res: Response) {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const role = parseStaffRole(req.query.role) ?? undefined;
    const active = parseOptionalBoolean(req.query.active);
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 50);

    const result = await listAdminUsers({
      search,
      role: role as UserRole | undefined,
      active,
      page,
      pageSize,
    });

    return res.status(200).json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
    });
  } catch (error) {
    return handleError(res, error, "Failed to list admin users");
  }
}

export async function createAdminUserHandler(req: Request, res: Response) {
  try {
    const actor = getActor(req);
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const input = parseCreateAdminBody(req.body);
    const user = await createAdminUser(actor, input);

    return res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, "Failed to create admin user");
  }
}

export async function updateAdminUserHandler(req: Request, res: Response) {
  try {
    const actor = getActor(req);
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const id = typeof req.params.id === "string" ? req.params.id : "";
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const input = parseUpdateAdminBody(req.body);
    const user = await updateAdminUser(actor, id, input);

    return res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update admin user");
  }
}

export async function setAdminUserActiveHandler(req: Request, res: Response) {
  try {
    const actor = getActor(req);
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const id = typeof req.params.id === "string" ? req.params.id : "";
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const active = parseActiveBody(req.body);
    const user = await setAdminUserActive(actor, id, active);

    return res.status(200).json({
      success: true,
      message: active
        ? "Admin user activated successfully"
        : "Admin user deactivated successfully",
      data: user,
    });
  } catch (error) {
    return handleError(res, error, "Failed to update admin user status");
  }
}

export async function deleteAdminUserHandler(req: Request, res: Response) {
  try {
    const actor = getActor(req);
    if (!actor) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const id = typeof req.params.id === "string" ? req.params.id : "";
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    await deleteAdminUser(actor, id);

    return res.status(200).json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    return handleError(res, error, "Failed to delete admin user");
  }
}
