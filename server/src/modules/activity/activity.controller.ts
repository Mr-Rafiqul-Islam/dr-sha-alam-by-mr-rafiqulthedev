import type { Request, Response } from "express";
import { listActivities, listTraceableStaff } from "./activity.service.js";

function parseLimit(raw: unknown): number | undefined {
  if (raw == null || raw === "") {
    return undefined;
  }

  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    return undefined;
  }

  return value;
}

export async function getActivityFeed(req: Request, res: Response) {
  try {
    const actorId =
      typeof req.query.actorId === "string" && req.query.actorId.trim()
        ? req.query.actorId.trim()
        : undefined;
    const cursor =
      typeof req.query.cursor === "string" && req.query.cursor.trim()
        ? req.query.cursor.trim()
        : undefined;
    const limit = parseLimit(req.query.limit);

    const result = await listActivities({ actorId, cursor, limit });

    return res.status(200).json({
      success: true,
      data: result.items,
      nextCursor: result.nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load activity feed",
    });
  }
}

export async function getTraceableStaff(_req: Request, res: Response) {
  try {
    const staff = await listTraceableStaff();

    return res.status(200).json({
      success: true,
      data: staff,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to load traceable staff",
    });
  }
}
