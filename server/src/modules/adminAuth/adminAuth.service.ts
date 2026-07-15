import bcrypt from "bcryptjs";
import { AdminOtpPurpose, type User } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { signAccessToken } from "../../shared/utils/token.js";
import type { AdminRequestUser } from "../../types/express.js";
import {
  AdminOtpDeliveryError,
  sendAdminLoginOtp,
} from "./adminAuth.notification.js";
import {
  generateAdminOtp,
  getAdminOtpExpiryMinutes,
  getAdminOtpExpirySeconds,
  getAdminOtpMaxAttempts,
  getAdminOtpMaxResends,
  getAdminOtpResendCooldownSeconds,
  hashAdminOtp,
  verifyAdminOtpHash,
} from "./adminAuth.otp.js";
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
  isActive: true,
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

export type AdminOtpChallengeResult = {
  challengeId: string;
  expiresIn: number;
  maskedDestination: string;
  resendAvailableIn: number;
};

export type AdminResendOtpResult = {
  challengeId: string;
  expiresIn: number;
  maskedDestination: string;
  resendAvailableIn: number;
};

export { isStaffPanelRole };

function toPublicUser(user: User): AdminRequestUser {
  const { password: _password, ...publicUser } = user;
  return publicUser;
}

async function invalidateOpenLoginChallenges(userId: string): Promise<void> {
  const now = new Date();
  await prisma.adminOtpChallenge.updateMany({
    where: {
      userId,
      purpose: AdminOtpPurpose.LOGIN,
      consumedAt: null,
    },
    data: {
      consumedAt: now,
    },
  });
}

async function assertStaffUserForChallenge(userId: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !isStaffPanelRole(user.role) || !user.password) {
    throw new AdminAuthError("Invalid or expired verification challenge");
  }

  if (!user.isActive) {
    throw new AdminAuthError("Account is deactivated. Contact an administrator.", 403);
  }

  return user;
}

export async function initiateAdminLoginOtp(params: {
  email: string;
  password: string;
}): Promise<AdminOtpChallengeResult> {
  const user = await prisma.user.findUnique({
    where: { email: params.email },
  });

  if (!user || !isStaffPanelRole(user.role) || !user.password) {
    throw new AdminAuthError("Invalid email or password");
  }

  if (!user.isActive) {
    throw new AdminAuthError("Account is deactivated. Contact an administrator.", 403);
  }

  const passwordMatches = await bcrypt.compare(params.password, user.password);
  if (!passwordMatches) {
    throw new AdminAuthError("Invalid email or password");
  }

  await invalidateOpenLoginChallenges(user.id);

  const otp = generateAdminOtp();
  const otpHash = hashAdminOtp(otp);
  const expiresAt = new Date(Date.now() + getAdminOtpExpiryMinutes() * 60_000);

  const challenge = await prisma.adminOtpChallenge.create({
    data: {
      userId: user.id,
      purpose: AdminOtpPurpose.LOGIN,
      otpHash,
      expiresAt,
    },
  });

  try {
    const delivery = await sendAdminLoginOtp({
      destinationEmail: user.email,
      destinationPhone: user.phone,
      otp,
      recipientName: user.name,
    });

    return {
      challengeId: challenge.id,
      expiresIn: getAdminOtpExpirySeconds(),
      maskedDestination: delivery.maskedDestination,
      resendAvailableIn: getAdminOtpResendCooldownSeconds(),
    };
  } catch (error) {
    await prisma.adminOtpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    });

    if (error instanceof AdminOtpDeliveryError) {
      throw new AdminAuthError(error.message, 500);
    }

    throw error;
  }
}

export async function verifyAdminLoginOtp(params: {
  challengeId: string;
  otp: string;
}): Promise<AdminLoginResult> {
  const challenge = await prisma.adminOtpChallenge.findUnique({
    where: { id: params.challengeId },
  });

  if (!challenge || challenge.purpose !== AdminOtpPurpose.LOGIN) {
    throw new AdminAuthError("Invalid or expired verification code");
  }

  if (challenge.consumedAt || challenge.verifiedAt) {
    throw new AdminAuthError("Invalid or expired verification code");
  }

  if (challenge.expiresAt.getTime() <= Date.now()) {
    await prisma.adminOtpChallenge.updateMany({
      where: { id: challenge.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    throw new AdminAuthError("Verification code expired");
  }

  if (challenge.attempts >= getAdminOtpMaxAttempts()) {
    await prisma.adminOtpChallenge.updateMany({
      where: { id: challenge.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    throw new AdminAuthError(
      "Too many invalid attempts. Please sign in again.",
    );
  }

  const otpMatches = verifyAdminOtpHash(params.otp, challenge.otpHash);

  if (!otpMatches) {
    const updated = await prisma.adminOtpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });

    if (updated.attempts >= getAdminOtpMaxAttempts()) {
      await prisma.adminOtpChallenge.updateMany({
        where: { id: challenge.id, consumedAt: null },
        data: { consumedAt: new Date() },
      });
      throw new AdminAuthError(
        "Too many invalid attempts. Please sign in again.",
      );
    }

    throw new AdminAuthError("Invalid verification code");
  }

  const now = new Date();
  const consumed = await prisma.adminOtpChallenge.updateMany({
    where: {
      id: challenge.id,
      purpose: AdminOtpPurpose.LOGIN,
      consumedAt: null,
      verifiedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: getAdminOtpMaxAttempts() },
    },
    data: {
      verifiedAt: now,
      consumedAt: now,
    },
  });

  if (consumed.count !== 1) {
    throw new AdminAuthError("Invalid or expired verification code");
  }

  const user = await assertStaffUserForChallenge(challenge.userId);

  const token = signAccessToken(user.id, {
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: toPublicUser(user),
  };
}

export async function resendAdminLoginOtp(params: {
  challengeId: string;
}): Promise<AdminResendOtpResult> {
  const challenge = await prisma.adminOtpChallenge.findUnique({
    where: { id: params.challengeId },
  });

  if (!challenge || challenge.purpose !== AdminOtpPurpose.LOGIN) {
    throw new AdminAuthError("Invalid or expired verification challenge");
  }

  if (challenge.consumedAt || challenge.verifiedAt) {
    throw new AdminAuthError("Invalid or expired verification challenge");
  }

  const user = await assertStaffUserForChallenge(challenge.userId);

  if (challenge.resendCount >= getAdminOtpMaxResends()) {
    await prisma.adminOtpChallenge.updateMany({
      where: { id: challenge.id, consumedAt: null },
      data: { consumedAt: new Date() },
    });
    throw new AdminAuthError(
      "Maximum resend limit reached. Please sign in again.",
      429,
    );
  }

  const cooldownMs = getAdminOtpResendCooldownSeconds() * 1000;
  const elapsedMs = Date.now() - challenge.lastSentAt.getTime();
  if (elapsedMs < cooldownMs) {
    const resendAvailableIn = Math.ceil((cooldownMs - elapsedMs) / 1000);
    throw new AdminAuthError(
      `Please wait ${resendAvailableIn}s before requesting another code`,
      429,
    );
  }

  const otp = generateAdminOtp();
  const otpHash = hashAdminOtp(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + getAdminOtpExpiryMinutes() * 60_000);

  const updated = await prisma.adminOtpChallenge.update({
    where: { id: challenge.id },
    data: {
      otpHash,
      expiresAt,
      lastSentAt: now,
      attempts: 0,
      resendCount: { increment: 1 },
    },
  });

  try {
    const delivery = await sendAdminLoginOtp({
      destinationEmail: user.email,
      destinationPhone: user.phone,
      otp,
      recipientName: user.name,
    });

    return {
      challengeId: updated.id,
      expiresIn: getAdminOtpExpirySeconds(),
      maskedDestination: delivery.maskedDestination,
      resendAvailableIn: getAdminOtpResendCooldownSeconds(),
    };
  } catch (error) {
    // Keep challenge usable; roll back the latest OTP replacement to avoid
    // locking the user out with an undelivered code.
    await prisma.adminOtpChallenge.update({
      where: { id: challenge.id },
      data: {
        otpHash: challenge.otpHash,
        expiresAt: challenge.expiresAt,
        lastSentAt: challenge.lastSentAt,
        attempts: challenge.attempts,
        resendCount: challenge.resendCount,
      },
    });

    if (error instanceof AdminOtpDeliveryError) {
      throw new AdminAuthError(error.message, 500);
    }

    throw error;
  }
}

export async function getAdminById(id: string): Promise<AdminRequestUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });

  if (!user || !isStaffPanelRole(user.role) || !user.isActive) {
    return null;
  }

  return user;
}
