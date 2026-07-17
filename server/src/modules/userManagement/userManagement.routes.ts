import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import {
  createUserHandler,
  getUserHandler,
  listUsersHandler,
  resetUserPasswordHandler,
  updateUserActiveHandler,
  updateUserHandler,
  updateUserRoleHandler,
} from "./userManagement.controller.js";

export const userManagementAdminRouter = Router();

userManagementAdminRouter.use(requireAdminAuth);
userManagementAdminRouter.use(requireAdminPermission("userManagement"));

userManagementAdminRouter.get("/", listUsersHandler);
userManagementAdminRouter.post("/", createUserHandler);
userManagementAdminRouter.get("/:id", getUserHandler);
userManagementAdminRouter.patch("/:id", updateUserHandler);
userManagementAdminRouter.patch("/:id/role", updateUserRoleHandler);
userManagementAdminRouter.patch("/:id/active", updateUserActiveHandler);
userManagementAdminRouter.patch("/:id/password", resetUserPasswordHandler);
