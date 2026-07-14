import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  meHandler,
  resendOtpHandler,
  verifyOtpHandler,
} from "./adminAuth.controller.js";
import { requireAdminAuth } from "./adminAuth.middleware.js";
import {
  adminLoginRateLimiter,
  adminResendOtpRateLimiter,
  adminVerifyOtpRateLimiter,
} from "./adminAuth.rateLimit.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", adminLoginRateLimiter, loginHandler);
adminAuthRouter.post(
  "/verify-otp",
  adminVerifyOtpRateLimiter,
  verifyOtpHandler,
);
adminAuthRouter.post(
  "/resend-otp",
  adminResendOtpRateLimiter,
  resendOtpHandler,
);
adminAuthRouter.get("/me", requireAdminAuth, meHandler);
adminAuthRouter.post("/logout", logoutHandler);
