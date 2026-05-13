import type { Request, Response } from "express";
import { PatientReviewStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import {
  parseOptionalUuid,
  routeParamString,
} from "../../../utils/index.js";
import {
  buildVideoInputFromBody,
  parseCoreReviewFields,
  parseIncludeCountsQuery,
  parsePatientReviewTypeQuery,
  validateVideoInput,
} from "../../../modules/patientReviews/patientReviews.helpers.js";
import {
  toPublicReviewCard,
  toPublicVideoListItem,
  toPublicVideoPayload,
} from "../../../modules/patientReviews/patientReviews.mapper.js";

export async function getPatientReviews(req: Request, res: Response) {
  try {
    const typeFilter = parsePatientReviewTypeQuery(req.query.type);
    if (!typeFilter) {
      return res.status(400).json({
        success: false,
        message:
          "type must be all, normal, success, successStory, or omitted for all",
      });
    }

    const where: Prisma.PatientReviewWhereInput = {
      status: PatientReviewStatus.ACTIVE,
    };
    if (typeFilter.mode === "one") {
      where.isSuccessStory = typeFilter.isSuccessStory;
    }

    const rows = await prisma.patientReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const includeCounts = parseIncludeCountsQuery(req.query.includeCounts);
    if (includeCounts) {
      const [normal, successStories, total] = await Promise.all([
        prisma.patientReview.count({
          where: {
            status: PatientReviewStatus.ACTIVE,
            isSuccessStory: false,
          },
        }),
        prisma.patientReview.count({
          where: {
            status: PatientReviewStatus.ACTIVE,
            isSuccessStory: true,
          },
        }),
        prisma.patientReview.count({
          where: { status: PatientReviewStatus.ACTIVE },
        }),
      ]);
      return res.json({
        success: true,
        data: rows.map(toPublicReviewCard),
        meta: {
          counts: { normal, successStories, total },
        },
      });
    }

    res.json({ success: true, data: rows.map(toPublicReviewCard) });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load patient reviews",
    });
  }
}

export async function getAllPatientReviewVideos(req: Request, res: Response) {
  try {
    const typeFilter = parsePatientReviewTypeQuery(req.query.type);
    if (!typeFilter) {
      return res.status(400).json({
        success: false,
        message:
          "type must be all, normal, success, successStory, or omitted for all",
      });
    }

    const where: Prisma.PatientReviewWhereInput = {
      status: PatientReviewStatus.ACTIVE,
      videoType: { not: null },
    };
    if (typeFilter.mode === "one") {
      where.isSuccessStory = typeFilter.isSuccessStory;
    }

    const rows = await prisma.patientReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    const data = rows
      .map(toPublicVideoListItem)
      .filter((item): item is NonNullable<typeof item> => item != null);
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load patient review videos",
    });
  }
}

export async function getPatientReviewVideo(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id is required",
      });
    }
    const row = await prisma.patientReview.findFirst({
      where: { id, status: PatientReviewStatus.ACTIVE },
    });
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    const video = toPublicVideoPayload(row);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "This review has no video",
      });
    }
    res.json({ success: true, data: video });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load video",
    });
  }
}

/**
 * Patient-submitted reviews are always stored as **PENDING** for moderation
 * (client cannot set ACTIVE).
 *
 * **Video is optional:** omit `videoType` and all video-related fields for a
 * text/image-only review. When present, use `MUX`, `EMBED`, or `DIRECT` as documented.
 */
export async function submitPatientReview(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;
    const parsed = parseCoreReviewFields(body, "normal");
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const videoSlice = buildVideoInputFromBody(body);
    const videoErr = validateVideoInput(videoSlice);
    if (videoErr) {
      return res.status(400).json({ success: false, message: videoErr });
    }

    const authorUserId = parseOptionalUuid(body.authorUserId);

    const created = await prisma.patientReview.create({
      data: {
        status: PatientReviewStatus.PENDING,
        isSuccessStory: false,
        authorUserId: authorUserId ?? null,
        patientDisplayName: parsed.data.patientDisplayName,
        title: parsed.data.title,
        description: parsed.data.description,
        age: parsed.data.age,
        rating: parsed.data.rating,
        problems: parsed.data.problems,
        treatments: parsed.data.treatments,
        result: parsed.data.result,
        imageUrl: parsed.data.imageUrl,
        imagePublicId: parsed.data.imagePublicId,
        sortOrder: parsed.data.sortOrder,
        ...videoSlice,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to submit patient review",
    });
  }
}
