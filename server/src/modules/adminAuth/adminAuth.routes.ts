import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  meHandler,
} from "./adminAuth.controller.js";
import { requireAdminAuth } from "./adminAuth.middleware.js";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", loginHandler);
adminAuthRouter.get("/me", requireAdminAuth, meHandler);
adminAuthRouter.post("/logout", logoutHandler);
