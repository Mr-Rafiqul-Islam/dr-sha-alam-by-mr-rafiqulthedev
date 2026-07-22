import bcrypt from "bcryptjs";
import { Prisma, UserRole } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { STAFF_PANEL_ROLES } from "../adminAuth/adminPermissions.js";
import {
  canAssignStaffRole,
  canManageStaffTarget,
  isStaffManagementRole,
  type CreateAdminUserInput,
  type UpdateAdminUserInput,
} from "./adminManagement.validation.js";

export class AdminManagementError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "AdminManagementError";
  }
}

const PUBLIC_ADMIN_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  active: true,
  provider: true,
  providerId: true,
  doctorId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type PublicAdminUser = Prisma.UserGetPayload<{
  select: typeof PUBLIC_ADMIN_SELECT;
}>;

export type ListAdminUsersParams = {
  search?: string;
  role?: UserRole;
  active?: boolean;
  page?: number;
  pageSize?: number;
};

function assertNotSelf(actorId: string, targetId: string): void {
  if (actorId === targetId) {
    throw new AdminManagementError("You cannot perform this action on your own account", 400);
  }
}

function assertCanManage(
  actorRole: UserRole,
  targetRole: UserRole,
  action = "manage",
): void {
  if (!isStaffManagementRole(targetRole)) {
    throw new AdminManagementError("Target user is not a staff account", 400);
  }

  if (!canManageStaffTarget(actorRole, targetRole)) {
    throw new AdminManagementError(
      `You do not have permission to ${action} this user`,
      403,
    );
  }
}

export async function listAdminUsers(
  params: ListAdminUsersParams = {},
): Promise<{ items: PublicAdminUser[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));
  const search = params.search?.trim();

  const where: Prisma.UserWhereInput = {
    role: params.role
      ? params.role
      : { in: [...STAFF_PANEL_ROLES] },
  };

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.active === true) {
    andConditions.push({ OR: [{ active: true }, { active: null }] });
  } else if (params.active === false) {
    andConditions.push({ active: false });
  }

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: PUBLIC_ADMIN_SELECT,
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return { items, total, page, pageSize };
}

export async function createAdminUser(
  actor: { id: string; role: UserRole },
  input: CreateAdminUserInput,
): Promise<PublicAdminUser> {
  if (!canAssignStaffRole(actor.role, input.role)) {
    throw new AdminManagementError(
      "You do not have permission to assign this role",
      403,
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });
  if (existing) {
    throw new AdminManagementError("An account with this email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      role: input.role,
      password: passwordHash,
      active: input.active ?? true,
    },
    select: PUBLIC_ADMIN_SELECT,
  });
}

export async function updateAdminUser(
  actor: { id: string; role: UserRole },
  targetId: string,
  input: UpdateAdminUserInput,
): Promise<PublicAdminUser> {
  assertNotSelf(actor.id, targetId);

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, role: true, email: true },
  });

  if (!target) {
    throw new AdminManagementError("User not found", 404);
  }

  assertCanManage(actor.role, target.role, "edit");

  if (input.role !== undefined) {
    if (!canAssignStaffRole(actor.role, input.role)) {
      throw new AdminManagementError(
        "You do not have permission to assign this role",
        403,
      );
    }
  }

  if (input.email && input.email !== target.email) {
    const emailTaken = await prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });
    if (emailTaken) {
      throw new AdminManagementError("An account with this email already exists", 409);
    }
  }

  const data: Prisma.UserUpdateInput = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.role !== undefined) data.role = input.role;
  if (input.password) {
    data.password = await bcrypt.hash(input.password, 10);
  }

  return prisma.user.update({
    where: { id: targetId },
    data,
    select: PUBLIC_ADMIN_SELECT,
  });
}

export async function setAdminUserActive(
  actor: { id: string; role: UserRole },
  targetId: string,
  active: boolean,
): Promise<PublicAdminUser> {
  assertNotSelf(actor.id, targetId);

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, role: true },
  });

  if (!target) {
    throw new AdminManagementError("User not found", 404);
  }

  assertCanManage(actor.role, target.role, "update status for");

  return prisma.user.update({
    where: { id: targetId },
    data: { active },
    select: PUBLIC_ADMIN_SELECT,
  });
}

export async function deleteAdminUser(
  actor: { id: string; role: UserRole },
  targetId: string,
): Promise<void> {
  assertNotSelf(actor.id, targetId);

  const target = await prisma.user.findUnique({
    where: { id: targetId },
    select: { id: true, role: true },
  });

  if (!target) {
    throw new AdminManagementError("User not found", 404);
  }

  assertCanManage(actor.role, target.role, "delete");

  await prisma.user.delete({
    where: { id: targetId },
  });
}
