import type { Request, Response } from "express";
import { routeParamString } from "../../utils/express-params.js";
import {
  createManagedUser,
  getManagedUserById,
  listManagedUsers,
  parseStaffRole,
  resetManagedUserPassword,
  setManagedUserActive,
  updateManagedUser,
  updateManagedUserRole,
  UserManagementError,
} from "./userManagement.service.js";

function handleUserManagementError(
  res: Response,
  error: unknown,
  fallback: string,
) {
  if (error instanceof UserManagementError) {
    return res.status(error.statusCode).json({
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

function parseRequiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new UserManagementError(`${field} is required.`);
  }
  return value.trim();
}

function parseOptionalPhone(value: unknown): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  if (typeof value !== "string") {
    throw new UserManagementError("Invalid phone number.");
  }
  return value.trim() || null;
}

function parseBoolean(value: unknown, field: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new UserManagementError(`${field} must be a boolean.`);
}

export async function listUsersHandler(_req: Request, res: Response) {
  try {
    const users = await listManagedUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to list users");
  }
}

export async function getUserHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await getManagedUserById(id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to get user");
  }
}

export async function createUserHandler(req: Request, res: Response) {
  try {
    const user = await createManagedUser(req.admin!, {
      name: parseRequiredString(req.body.name, "Name"),
      email: parseRequiredString(req.body.email, "Email"),
      phone: parseOptionalPhone(req.body.phone) ?? null,
      role: parseStaffRole(req.body.role),
      password: parseRequiredString(req.body.password, "Password"),
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to create user");
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await updateManagedUser(req.admin!, id, {
      name:
        req.body.name === undefined
          ? undefined
          : parseRequiredString(req.body.name, "Name"),
      email:
        req.body.email === undefined
          ? undefined
          : parseRequiredString(req.body.email, "Email"),
      phone: parseOptionalPhone(req.body.phone),
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to update user");
  }
}

export async function updateUserRoleHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await updateManagedUserRole(
      req.admin!,
      id,
      parseStaffRole(req.body.role),
    );

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to update user role");
  }
}

export async function updateUserActiveHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await setManagedUserActive(
      req.admin!,
      id,
      parseBoolean(req.body.isActive, "isActive"),
    );

    return res.status(200).json({
      success: true,
      message: user.isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data: user,
    });
  } catch (error) {
    return handleUserManagementError(
      res,
      error,
      "Failed to update user status",
    );
  }
}

export async function resetUserPasswordHandler(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid user id" });
  }

  try {
    const user = await resetManagedUserPassword(
      req.admin!,
      id,
      parseRequiredString(req.body.password, "Password"),
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: user,
    });
  } catch (error) {
    return handleUserManagementError(res, error, "Failed to reset password");
  }
}
