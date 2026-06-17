import type { CookieOptions } from "express";

export const ADMIN_TOKEN_COOKIE = "admin_token";

const DEFAULT_ADMIN_TOKEN_EXPIRY = "7d";

function parseExpiryToMs(expiry: string): number {
  const trimmed = expiry.trim();
  const match = /^(\d+)([smhd])$/i.exec(trimmed);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const amount = Number.parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 7 * 24 * 60 * 60 * 1000;
  }
}

export function getAdminTokenExpiry(): string {
  return process.env.ADMIN_ACCESS_TOKEN_EXPIRY ?? DEFAULT_ADMIN_TOKEN_EXPIRY;
}

export function getAdminTokenMaxAgeMs(): number {
  return parseExpiryToMs(getAdminTokenExpiry());
}

export function getAdminTokenCookieOptions(): CookieOptions {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    path: "/",
    maxAge: getAdminTokenMaxAgeMs(),
  };
}

export function getAdminTokenClearCookieOptions(): CookieOptions {
  const { maxAge: _maxAge, ...options } = getAdminTokenCookieOptions();
  return options;
}
