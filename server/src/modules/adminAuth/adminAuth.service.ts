import bcrypt from "bcryptjs";
import { prisma } from "../../config/db.js";
import { signAccessToken } from "../../shared/utils/token.js";
import type { AdminRequestUser } from "../../types/express.js";
import { isStaffPanelRole } from "./adminPermissions.js";

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
  active: true,
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

export { isStaffPanelRole };

function isUserActive(active: boolean | null | undefined): boolean {
  return active !== false;
}

export async function loginAdmin(params: {
  email: string;
  password: string;
}): Promise<AdminLoginResult> {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (
    !user ||
    !isStaffPanelRole(user.role) ||
    !user.password
  ) {
    throw new AdminAuthError("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(params.password, user.password);
  if (!passwordMatches) {
    throw new AdminAuthError("Invalid email or password");
  }

  if (!isUserActive(user.active)) {
    throw new AdminAuthError("Account is inactive. Contact an administrator.", 403);
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

  if (!user || !isStaffPanelRole(user.role) || !isUserActive(user.active)) {
    return null;
  }

  return user;
}
