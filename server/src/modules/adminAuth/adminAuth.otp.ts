import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const DEFAULT_OTP_EXPIRY_MINUTES = 5;
const DEFAULT_OTP_MAX_ATTEMPTS = 5;
const DEFAULT_OTP_RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_OTP_MAX_RESENDS = 3;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

export function getAdminOtpExpiryMinutes(): number {
  return parsePositiveInt(
    process.env.ADMIN_OTP_EXPIRY_MINUTES,
    DEFAULT_OTP_EXPIRY_MINUTES,
  );
}

export function getAdminOtpExpirySeconds(): number {
  return getAdminOtpExpiryMinutes() * 60;
}

export function getAdminOtpMaxAttempts(): number {
  return parsePositiveInt(
    process.env.ADMIN_OTP_MAX_ATTEMPTS,
    DEFAULT_OTP_MAX_ATTEMPTS,
  );
}

export function getAdminOtpResendCooldownSeconds(): number {
  return parsePositiveInt(
    process.env.ADMIN_OTP_RESEND_COOLDOWN_SECONDS,
    DEFAULT_OTP_RESEND_COOLDOWN_SECONDS,
  );
}

export function getAdminOtpMaxResends(): number {
  return parsePositiveInt(
    process.env.ADMIN_OTP_MAX_RESENDS,
    DEFAULT_OTP_MAX_RESENDS,
  );
}

function getOtpHashSecret(): string {
  const secret = process.env.ADMIN_OTP_HASH_SECRET?.trim();
  if (!secret) {
    throw new Error("ADMIN_OTP_HASH_SECRET is not set");
  }
  return secret;
}

/** Cryptographically secure six-digit numeric OTP (000000–999999). */
export function generateAdminOtp(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export function hashAdminOtp(otp: string): string {
  return createHmac("sha256", getOtpHashSecret()).update(otp).digest("hex");
}

export function verifyAdminOtpHash(otp: string, otpHash: string): boolean {
  const submittedHash = hashAdminOtp(otp);

  try {
    const submitted = Buffer.from(submittedHash, "utf8");
    const stored = Buffer.from(otpHash, "utf8");

    if (submitted.length !== stored.length) {
      return false;
    }

    return timingSafeEqual(submitted, stored);
  } catch {
    return false;
  }
}

export function maskEmailDestination(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return "***";
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function maskPhoneDestination(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) {
    return "***";
  }

  const last4 = digits.slice(-4);
  const prefix = digits.slice(0, Math.min(3, digits.length - 4));
  return `${prefix}****${last4}`;
}
