import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { signAccessToken } from "../../shared/utils/token.js";
import type { AdminRequestUser } from "../../types/express.js";

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 401,
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

const PUBLIC_USER_SELECT = {
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
} as const;

export type AdminLoginResult = {
  token: string;
  user: AdminRequestUser;
};

export async function loginAdmin(params: {
  email: string;
  password: string;
}): Promise<AdminLoginResult> {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (
    !user ||
    user.role !== UserRole.ADMIN ||
    !user.password
  ) {
    throw new AdminAuthError("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(params.password, user.password);
  if (!passwordMatches) {
    throw new AdminAuthError("Invalid email or password");
  }

  const token = signAccessToken(user.id, {
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password: _password, ...publicUser } = user;

  return {
    token,
    user: publicUser,
  };
}

export async function getAdminById(id: string): Promise<AdminRequestUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return user;
}
