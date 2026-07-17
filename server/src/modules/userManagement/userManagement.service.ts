import bcrypt from "bcryptjs";
import { UserRole, type User } from "@prisma/client";
import { prisma } from "../../config/db.js";
import type { AdminRequestUser } from "../../types/express.js";
import {
  isStaffPanelRole,
  STAFF_PANEL_ROLES,
} from "../adminAuth/adminPermissions.js";

const BCRYPT_ROUNDS = 10;

const MANAGED_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  isActive: true,
  provider: true,
  providerId: true,
  doctorId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type ManagedUser = Omit<User, "password">;

export class UserManagementError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "UserManagementError";
  }
}

export type CreateStaffUserInput = {
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  password: string;
};

export type UpdateStaffUserInput = {
  name?: string;
  email?: string;
  phone?: string | null;
};

const ASSIGNABLE_BY_ADMIN = new Set<UserRole>([
  UserRole.ADMIN,
  UserRole.MANAGER,
  UserRole.SUPPORT,
  UserRole.EDITOR,
]);

function toManagedUser(user: User): ManagedUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

function assertActorCanManageTarget(
  actor: AdminRequestUser,
  target: Pick<User, "id" | "role">,
): void {
  if (actor.role === UserRole.SUPER_ADMIN) {
    return;
  }

  if (actor.role === UserRole.ADMIN) {
    if (target.role === UserRole.SUPER_ADMIN) {
      throw new UserManagementError(
        "Insufficient privileges to manage Super Admin accounts.",
        403,
      );
    }
    return;
  }

  throw new UserManagementError("Insufficient privileges.", 403);
}

function assertCanAssignRole(actor: AdminRequestUser, role: UserRole): void {
  if (!STAFF_PANEL_ROLES.has(role)) {
    throw new UserManagementError("Invalid staff role.");
  }

  if (actor.role === UserRole.SUPER_ADMIN) {
    return;
  }

  if (actor.role === UserRole.ADMIN && ASSIGNABLE_BY_ADMIN.has(role)) {
    return;
  }

  throw new UserManagementError(
    "Insufficient privileges to assign this role.",
    403,
  );
}

async function countActiveSuperAdmins(): Promise<number> {
  return prisma.user.count({
    where: {
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });
}

export async function listManagedUsers(): Promise<ManagedUser[]> {
  return prisma.user.findMany({
    where: {
      role: { in: [...STAFF_PANEL_ROLES] },
    },
    select: MANAGED_USER_SELECT,
    orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
  });
}

export async function getManagedUserById(id: string): Promise<ManagedUser> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: MANAGED_USER_SELECT,
  });

  if (!user || !isStaffPanelRole(user.role)) {
    throw new UserManagementError("User not found.", 404);
  }

  return user;
}

export async function createManagedUser(
  actor: AdminRequestUser,
  input: CreateStaffUserInput,
): Promise<ManagedUser> {
  assertCanAssignRole(actor, input.role);

  const email = input.email.trim().toLowerCase();
  if (!email) {
    throw new UserManagementError("Email is required.");
  }

  if (input.password.trim().length < 8) {
    throw new UserManagementError("Password must be at least 8 characters.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new UserManagementError("A user with this email already exists.", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim() || null,
      email,
      phone: input.phone?.trim() || null,
      role: input.role,
      password: passwordHash,
      isActive: true,
    },
  });

  return toManagedUser(user);
}

export async function updateManagedUser(
  actor: AdminRequestUser,
  id: string,
  input: UpdateStaffUserInput,
): Promise<ManagedUser> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || !isStaffPanelRole(existing.role)) {
    throw new UserManagementError("User not found.", 404);
  }

  assertActorCanManageTarget(actor, existing);

  const data: {
    name?: string | null;
    email?: string;
    phone?: string | null;
  } = {};

  if (input.name !== undefined) {
    data.name = input.name.trim() || null;
  }

  if (input.email !== undefined) {
    const email = input.email.trim().toLowerCase();
    if (!email) {
      throw new UserManagementError("Email is required.");
    }

    if (email !== existing.email) {
      const conflict = await prisma.user.findUnique({ where: { email } });
      if (conflict) {
        throw new UserManagementError(
          "A user with this email already exists.",
          409,
        );
      }
      data.email = email;
    }
  }

  if (input.phone !== undefined) {
    data.phone = input.phone?.trim() || null;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return toManagedUser(user);
}

export async function updateManagedUserRole(
  actor: AdminRequestUser,
  id: string,
  role: UserRole,
): Promise<ManagedUser> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || !isStaffPanelRole(existing.role)) {
    throw new UserManagementError("User not found.", 404);
  }

  assertActorCanManageTarget(actor, existing);
  assertCanAssignRole(actor, role);

  if (existing.id === actor.id && existing.role === UserRole.SUPER_ADMIN) {
    if (role !== UserRole.SUPER_ADMIN) {
      throw new UserManagementError(
        "You cannot remove your own Super Admin role.",
        403,
      );
    }
  }

  if (
    existing.role === UserRole.SUPER_ADMIN &&
    role !== UserRole.SUPER_ADMIN &&
    existing.isActive
  ) {
    const activeSuperAdmins = await countActiveSuperAdmins();
    if (activeSuperAdmins <= 1) {
      throw new UserManagementError(
        "Cannot demote the last active Super Admin.",
        403,
      );
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return toManagedUser(user);
}

export async function setManagedUserActive(
  actor: AdminRequestUser,
  id: string,
  isActive: boolean,
): Promise<ManagedUser> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || !isStaffPanelRole(existing.role)) {
    throw new UserManagementError("User not found.", 404);
  }

  assertActorCanManageTarget(actor, existing);

  if (existing.id === actor.id && !isActive) {
    throw new UserManagementError("You cannot deactivate your own account.", 403);
  }

  if (
    existing.role === UserRole.SUPER_ADMIN &&
    existing.isActive &&
    !isActive
  ) {
    const activeSuperAdmins = await countActiveSuperAdmins();
    if (activeSuperAdmins <= 1) {
      throw new UserManagementError(
        "Cannot deactivate the last active Super Admin.",
        403,
      );
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });

  return toManagedUser(user);
}

export async function resetManagedUserPassword(
  actor: AdminRequestUser,
  id: string,
  password: string,
): Promise<ManagedUser> {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing || !isStaffPanelRole(existing.role)) {
    throw new UserManagementError("User not found.", 404);
  }

  assertActorCanManageTarget(actor, existing);

  if (password.trim().length < 8) {
    throw new UserManagementError("Password must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.update({
    where: { id },
    data: { password: passwordHash },
  });

  return toManagedUser(user);
}

export function parseStaffRole(value: unknown): UserRole {
  if (typeof value !== "string" || !STAFF_PANEL_ROLES.has(value as UserRole)) {
    throw new UserManagementError("Invalid staff role.");
  }

  return value as UserRole;
}
