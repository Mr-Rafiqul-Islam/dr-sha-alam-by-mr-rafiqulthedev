import type { Request } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";

const DEFAULT_ACCESS_EXPIRY = "15m";

/**
 * Reads `Authorization: Bearer <token>`. Returns `null` if missing or not Bearer.
 */
export function extractTokenFromHeader(req: Request): string | null {
  const raw = req.headers.authorization;
  if (raw == null || typeof raw !== "string") {
    return null;
  }
  const [scheme, token] = raw.split(/\s+/, 2);
  if (
    !scheme ||
    !token ||
    scheme.toLowerCase() !== "bearer" ||
    !token.trim()
  ) {
    return null;
  }
  return token.trim();
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

/** Verifies an access token (HS256). Throws `jsonwebtoken` errors on failure. */
export function verifyAccessToken(token: string): jwt.JwtPayload {
  const secret = getJwtSecret();
  return jwt.verify(token, secret, {
    algorithms: ["HS256"],
  }) as jwt.JwtPayload;
}

/** Issues an access token with subject = user id (for admin login flows). */
export function signAccessToken(
  userId: string,
  extraPayload?: jwt.JwtPayload,
): string {
  const secret = getJwtSecret();
  const expiresIn =
    process.env.ADMIN_ACCESS_TOKEN_EXPIRY ?? DEFAULT_ACCESS_EXPIRY;
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: expiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign({ sub: userId, ...extraPayload }, secret, options);
}
