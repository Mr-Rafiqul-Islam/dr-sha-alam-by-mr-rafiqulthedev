import type { Request, Response } from "express";
import { DeleteRequestEntityType } from "@prisma/client";
import { routeParamString } from "../../utils/express-params.js";
import {
  approveDeleteRequest,
  listPendingDeleteRequests,
  rejectDeleteRequest,
} from "../../modules/deleteRequest/deleteRequest.service.js";
import { DeleteRequestError } from "../../modules/deleteRequest/deleteRequest.types.js";

function parseEntityType(raw: unknown): DeleteRequestEntityType | undefined {
  if (typeof raw !== "string" || !raw.trim()) {
    return undefined;
  }

  const normalized = raw.trim().toUpperCase();
  if (
    normalized === DeleteRequestEntityType.BLOG ||
    normalized === DeleteRequestEntityType.APPOINTMENT ||
    normalized === DeleteRequestEntityType.CONTACT_MESSAGE
  ) {
    return normalized as DeleteRequestEntityType;
  }

  return undefined;
}

function handleDeleteRequestError(res: Response, error: unknown, fallback: string) {
  if (error instanceof DeleteRequestError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: fallback,
  });
}

export async function getPendingDeleteRequests(req: Request, res: Response) {
  try {
    const entityType = parseEntityType(req.query.entityType);
    const data = await listPendingDeleteRequests(entityType);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return handleDeleteRequestError(
      res,
      error,
      "Failed to load pending delete requests",
    );
  }
}

export async function approvePendingDeleteRequest(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Delete request id is required",
    });
  }

  try {
    const request = await approveDeleteRequest(id, req.admin!.id);

    return res.status(200).json({
      success: true,
      message: "Delete request approved",
      data: request,
    });
  } catch (error) {
    return handleDeleteRequestError(
      res,
      error,
      "Failed to approve delete request",
    );
  }
}

export async function rejectPendingDeleteRequest(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Delete request id is required",
    });
  }

  try {
    const request = await rejectDeleteRequest(id, req.admin!.id);

    return res.status(200).json({
      success: true,
      message: "Delete request rejected",
      data: request,
    });
  } catch (error) {
    return handleDeleteRequestError(
      res,
      error,
      "Failed to reject delete request",
    );
  }
}
