import { Router } from "express";
import {
  requireAdminAuth,
  requireAdminPermission,
} from "../../../modules/adminAuth/adminAuth.middleware.js";
import { requireDeleteApprovalRole } from "../../../modules/deleteRequest/deleteRequest.middleware.js";
import * as deleteRequestController from "../../../controllers/deleteRequest/deleteRequest.controller.js";
export const deleteRequestAdminRouter = Router();

deleteRequestAdminRouter.use(requireAdminAuth);
deleteRequestAdminRouter.use(requireAdminPermission("deleteApprovals"));
deleteRequestAdminRouter.use(requireDeleteApprovalRole);

deleteRequestAdminRouter.get("/", deleteRequestController.getPendingDeleteRequests);
deleteRequestAdminRouter.post(
  "/:id/approve",
  deleteRequestController.approvePendingDeleteRequest,
);
deleteRequestAdminRouter.post(
  "/:id/reject",
  deleteRequestController.rejectPendingDeleteRequest,
);
