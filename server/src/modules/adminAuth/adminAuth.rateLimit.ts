import type { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message?: string;
};

const hitCache = new NodeCache({
  stdTTL: 15 * 60,
  checkperiod: 60,
  useClones: false,
});

function clientKey(req: Request, bucket: string): string {
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedIp =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim()
      : Array.isArray(forwarded)
        ? forwarded[0]?.trim()
        : undefined;

  const ip = forwardedIp || req.ip || req.socket.remoteAddress || "unknown";
  return `${bucket}:${ip}`;
}

/**
 * Lightweight IP rate limiter using the project's existing `node-cache` dependency.
 * No separate rate-limit package is installed in this server.
 */
export function createAdminAuthRateLimiter(
  bucket: string,
  options: RateLimitOptions,
) {
  const ttlSeconds = Math.max(1, Math.ceil(options.windowMs / 1000));
  const message =
    options.message ?? "Too many requests. Please try again later.";

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = clientKey(req, bucket);
    const current = hitCache.get<number>(key) ?? 0;

    if (current >= options.max) {
      res.status(429).json({
        success: false,
        message,
      });
      return;
    }

    hitCache.set(key, current + 1, ttlSeconds);
    next();
  };
}

export const adminLoginRateLimiter = createAdminAuthRateLimiter("admin-login", {
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

export const adminVerifyOtpRateLimiter = createAdminAuthRateLimiter(
  "admin-verify-otp",
  {
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many verification attempts. Please try again later.",
  },
);

export const adminResendOtpRateLimiter = createAdminAuthRateLimiter(
  "admin-resend-otp",
  {
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: "Too many resend attempts. Please try again later.",
  },
);
