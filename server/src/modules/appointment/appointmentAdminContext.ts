import type { Request } from "express";
import {
  buildPendingDeleteListWhere,
  DeleteRequestEntityType,
  getPendingDeleteEntityMap,
  shouldHidePendingDeletesFromLists,
} from "../deleteRequest/deleteRequest.service.js";
import { AppointmentValidationError } from "./appointment.utils.js";

export async function getAdminAppointmentListContext(req: Request) {
  const admin = req.admin;
  if (!admin) {
    throw new AppointmentValidationError("Authentication required.", 401);
  }

  const pendingDeleteMap = await getPendingDeleteEntityMap(
    DeleteRequestEntityType.APPOINTMENT,
  );
  const hidePendingDeletes = shouldHidePendingDeletesFromLists(admin.role);

  return {
    pendingDeleteMap,
    hidePendingDeletes,
    pendingDeleteWhere: buildPendingDeleteListWhere(
      hidePendingDeletes,
      pendingDeleteMap,
    ),
  };
}
