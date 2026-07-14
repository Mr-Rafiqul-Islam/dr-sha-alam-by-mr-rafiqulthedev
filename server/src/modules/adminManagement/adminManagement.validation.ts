import { UserRole } from "@prisma/client";
import { FULL_ACCESS_ROLES, isStaffPanelRole } from "../adminAuth/adminPermissions.js";

export const STAFF_MANAGEMENT_ROLES = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.SUPPORT,
  UserRole.EDITOR,
] as const;

export type StaffManagementRole = (typeof STAFF_MANAGEMENT_ROLES)[number];

/** Roles an ADMIN actor is allowed to create or manage. */
export const ADMIN_ASSIGNABLE_ROLES = new Set<UserRole>([
  UserRole.ADMIN,
  UserRole.SUPPORT,
  UserRole.EDITOR,
]);

export function isStaffManagementRole(role: UserRole): role is StaffManagementRole {
  return isStaffPanelRole(role);
}

export function canAccessAdminManagement(role: UserRole): boolean {
  return FULL_ACCESS_ROLES.has(role);
}

export function canAssignStaffRole(actorRole: UserRole, targetRole: UserRole): boolean {
  if (!isStaffManagementRole(targetRole)) {
    return false;
  }

  if (actorRole === UserRole.SUPER_ADMIN || actorRole === UserRole.MANAGER) {
    return true;
  }

  if (actorRole === UserRole.ADMIN) {
    return ADMIN_ASSIGNABLE_ROLES.has(targetRole);
  }

  return false;
}

export function canManageStaffTarget(actorRole: UserRole, targetRole: UserRole): boolean {
  return canAssignStaffRole(actorRole, targetRole);
}

export function isUserActive(active: boolean | null | undefined): boolean {
  return active !== false;
}

export function parseStaffRole(value: unknown): StaffManagementRole | null {
  if (typeof value !== "string") {
    return null;
  }

  if ((STAFF_MANAGEMENT_ROLES as readonly string[]).includes(value)) {
    return value as StaffManagementRole;
  }

  return null;
}

export type CreateAdminUserInput = {
  name: string;
  email: string;
  phone?: string | null;
  role: StaffManagementRole;
  password: string;
  active?: boolean;
};

export type UpdateAdminUserInput = {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: StaffManagementRole;
  password?: string;
};

export function parseCreateAdminBody(body: unknown): CreateAdminUserInput {
  if (!body || typeof body !== "object") {
    throw new AdminManagementValidationError("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const phone =
    typeof data.phone === "string" ? data.phone.trim() || null : null;
  const role = parseStaffRole(data.role);
  const password = typeof data.password === "string" ? data.password : "";

  if (!name) {
    throw new AdminManagementValidationError("Full name is required");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AdminManagementValidationError("A valid email is required");
  }
  if (!role) {
    throw new AdminManagementValidationError("A valid staff role is required");
  }
  if (!isValidPassword(password)) {
    throw new AdminManagementValidationError(
      "Password must contain at least 8 characters, one number, and one symbol",
    );
  }

  let active = true;
  if (typeof data.active === "boolean") {
    active = data.active;
  } else if (data.active === "true") {
    active = true;
  } else if (data.active === "false") {
    active = false;
  }

  return { name, email, phone, role, password, active };
}

export function parseUpdateAdminBody(body: unknown): UpdateAdminUserInput {
  if (!body || typeof body !== "object") {
    throw new AdminManagementValidationError("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  const result: UpdateAdminUserInput = {};

  if (data.name !== undefined) {
    if (typeof data.name !== "string" || !data.name.trim()) {
      throw new AdminManagementValidationError("Full name is required");
    }
    result.name = data.name.trim();
  }

  if (data.email !== undefined) {
    if (typeof data.email !== "string") {
      throw new AdminManagementValidationError("A valid email is required");
    }
    const email = data.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AdminManagementValidationError("A valid email is required");
    }
    result.email = email;
  }

  if (data.phone !== undefined) {
    if (data.phone === null) {
      result.phone = null;
    } else if (typeof data.phone === "string") {
      result.phone = data.phone.trim() || null;
    } else {
      throw new AdminManagementValidationError("Invalid phone number");
    }
  }

  if (data.role !== undefined) {
    const role = parseStaffRole(data.role);
    if (!role) {
      throw new AdminManagementValidationError("A valid staff role is required");
    }
    result.role = role;
  }

  if (data.password !== undefined && data.password !== null && data.password !== "") {
    if (typeof data.password !== "string" || !isValidPassword(data.password)) {
      throw new AdminManagementValidationError(
        "Password must contain at least 8 characters, one number, and one symbol",
      );
    }
    result.password = data.password;
  }

  if (
    result.name === undefined &&
    result.email === undefined &&
    result.phone === undefined &&
    result.role === undefined &&
    result.password === undefined
  ) {
    throw new AdminManagementValidationError("No fields to update");
  }

  return result;
}

export function parseActiveBody(body: unknown): boolean {
  if (!body || typeof body !== "object") {
    throw new AdminManagementValidationError("Invalid request body");
  }

  const data = body as Record<string, unknown>;
  if (typeof data.active === "boolean") {
    return data.active;
  }
  if (data.active === "true") {
    return true;
  }
  if (data.active === "false") {
    return false;
  }

  throw new AdminManagementValidationError("Active status is required");
}

function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  if (!/\d/.test(password)) {
    return false;
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return false;
  }
  return true;
}

export class AdminManagementValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminManagementValidationError";
  }
}
