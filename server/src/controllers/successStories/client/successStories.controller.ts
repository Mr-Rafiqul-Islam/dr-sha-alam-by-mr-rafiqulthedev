/**
 * Public list of approved success stories (`SuccessStory` with `status: ACTIVE`).
 *
 * Base path: `GET /api/v1/client/success-stories` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { PatientReviewStatus } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { toPublicSuccessStoryCard } from "../../../modules/successStories/successStories.mapper.js";

export async function getSuccessStories(_req: Request, res: Response) {
  try {
    const rows = await prisma.successStory.findMany({
      where: { status: PatientReviewStatus.ACTIVE },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: rows.map(toPublicSuccessStoryCard) });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load success stories",
    });
  }
}
