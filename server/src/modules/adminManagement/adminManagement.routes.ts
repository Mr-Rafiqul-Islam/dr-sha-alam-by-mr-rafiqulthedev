import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../adminAuth/adminAuth.middleware.js";
import {
  createAdminUserHandler,
  deleteAdminUserHandler,
  listAdminUsersHandler,
  setAdminUserActiveHandler,
  updateAdminUserHandler,
} from "./adminManagement.controller.js";

export const adminManagementRouter = Router();

adminManagementRouter.use(requireAdminAuth);
adminManagementRouter.use(requireAdminPermission("adminManagement"));

adminManagementRouter.get("/", listAdminUsersHandler);
adminManagementRouter.post("/", createAdminUserHandler);
adminManagementRouter.patch("/:id/active", setAdminUserActiveHandler);
adminManagementRouter.patch("/:id", updateAdminUserHandler);
adminManagementRouter.delete("/:id", deleteAdminUserHandler);
