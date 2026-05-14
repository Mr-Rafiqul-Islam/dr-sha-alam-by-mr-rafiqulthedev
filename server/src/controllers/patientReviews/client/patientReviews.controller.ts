/**
 * Public HTTP API for approved patient reviews (`PatientReview` with `status: ACTIVE`).
 *
 * Base path: `GET|POST /api/v1/client/patient-reviews/...` (see `routes/index.ts`).
 *
 * | Method | Path | Purpose |
 * |--------|------|---------|
 * | GET | `/` | List review cards; query `type`, optional `includeCounts` |
 * | GET | `/videos` | Active reviews that have a `videoType` |
 * | GET | `/:id/video` | Single playback payload for one review |
 * | POST | `/` | Patient submit → always stored as `PENDING` until admin approves |
 */
import type { Request, Response } from "express";
import { PatientReviewStatus, PatientReviewVideoType, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import {
  parseOptionalUuid,
  routeParamString,
} from "../../../utils/index.js";
import {
  parseOptionalAge,
  parseRating,
  parseStringArray,
} from "../../../utils/parsers.js";
import {
  toPublicReviewCard,
  toPublicVideoListItem,
  toPublicVideoPayload,
} from "../../../modules/patientReviews/patientReviews.mapper.js";

export async function getPatientReviews(req: Request, res: Response) {
  try {
    const typeWhere = parseListTypeQuery(req.query.type);
    if (!typeWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          "type must be all, normal, success, successStory, or omitted for all",
      });
    }

    const where: Prisma.PatientReviewWhereInput = {
      status: PatientReviewStatus.ACTIVE,
    };
    if (typeWhere.mode === "one") {
      where.isSuccessStory = typeWhere.isSuccessStory;
    }

    const rows = await prisma.patientReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    let includeCounts = false;
    const rawCounts = req.query.includeCounts;
    if (rawCounts != null && rawCounts !== "") {
      if (typeof rawCounts === "boolean") {
        includeCounts = rawCounts;
      } else {
        const c = String(rawCounts).trim().toLowerCase();
        if (c === "true" || c === "1" || c === "yes") {
          includeCounts = true;
        }
      }
    }

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
    const typeWhere = parseListTypeQuery(req.query.type);
    if (!typeWhere.ok) {
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
    if (typeWhere.mode === "one") {
      where.isSuccessStory = typeWhere.isSuccessStory;
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
 * Patient submissions: `status` is always `PENDING`. Video is optional (omit `videoType`
 * and related fields for text/image-only — matches nullable columns on `PatientReview`).
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

// --- List `type` query (maps to `PatientReview.isSuccessStory`) --------------

function parseListTypeQuery(raw: unknown):
  | { ok: true; mode: "all" }
  | { ok: true; mode: "one"; isSuccessStory: boolean }
  | { ok: false } {
  if (raw == null || raw === "") {
    return { ok: true, mode: "all" };
  }
  const s = String(raw).trim().toLowerCase();
  if (s === "all") {
    return { ok: true, mode: "all" };
  }
  if (s === "normal") {
    return { ok: true, mode: "one", isSuccessStory: false };
  }
  if (s === "success" || s === "successstory" || s === "success_story") {
    return { ok: true, mode: "one", isSuccessStory: true };
  }
  return { ok: false };
}

// --- Body → Prisma (same shapes as admin; patient path uses `normal` only) -----

type PatientReviewVideoSlice = Pick<
  Prisma.PatientReviewCreateInput,
  | "videoType"
  | "muxUploadId"
  | "muxAssetId"
  | "muxPlaybackId"
  | "muxPlaybackPolicy"
  | "videoThumbnailUrl"
  | "videoTitle"
  | "embedPayload"
  | "directVideoUrl"
>;

type CoreReviewFields = {
  title: string;
  description: string;
  result: string;
  age: number | null;
  rating: number;
  patientDisplayName: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  problems: string[];
  treatments: string[];
  sortOrder: number;
};

function emptyVideoSlice(): PatientReviewVideoSlice {
  return {
    videoType: null,
    muxUploadId: null,
    muxAssetId: null,
    muxPlaybackId: null,
    muxPlaybackPolicy: null,
    videoThumbnailUrl: null,
    videoTitle: null,
    embedPayload: Prisma.JsonNull,
    directVideoUrl: null,
  };
}

function parseVideoType(raw: unknown): PatientReviewVideoType | null {
  if (raw == null || raw === "") {
    return null;
  }
  const u = String(raw).toUpperCase();
  if (u === "MUX" || u === "EMBED" || u === "DIRECT") {
    return u as PatientReviewVideoType;
  }
  return null;
}

function parseEmbedPayload(raw: unknown): Prisma.InputJsonValue | null {
  if (raw == null) {
    return null;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Prisma.InputJsonValue;
    } catch {
      return null;
    }
  }
  if (typeof raw === "object") {
    return raw as Prisma.InputJsonValue;
  }
  return null;
}

function buildVideoInputFromBody(
  body: Record<string, unknown>,
): PatientReviewVideoSlice {
  const vt = parseVideoType(body.videoType);
  if (!vt) {
    return emptyVideoSlice();
  }

  const thumb =
    body.videoThumbnailUrl != null
      ? String(body.videoThumbnailUrl).trim() || null
      : null;
  const vTitle =
    body.videoTitle != null ? String(body.videoTitle).trim() || null : null;

  const clearEmbedDirect = {
    embedPayload: Prisma.JsonNull,
    directVideoUrl: null as string | null,
  };

  const clearMux = {
    muxUploadId: null as string | null,
    muxAssetId: null as string | null,
    muxPlaybackId: null as string | null,
    muxPlaybackPolicy: null as string | null,
  };

  if (vt === PatientReviewVideoType.MUX) {
    const playbackPolicyRaw = body.muxPlaybackPolicy;
    const muxPlaybackPolicy =
      playbackPolicyRaw != null && String(playbackPolicyRaw).trim() !== ""
        ? String(playbackPolicyRaw).trim()
        : "signed";

    return {
      videoType: PatientReviewVideoType.MUX,
      muxUploadId:
        body.muxUploadId != null
          ? String(body.muxUploadId).trim() || null
          : null,
      muxAssetId:
        body.muxAssetId != null ? String(body.muxAssetId).trim() || null : null,
      muxPlaybackId:
        body.muxPlaybackId != null
          ? String(body.muxPlaybackId).trim() || null
          : null,
      muxPlaybackPolicy,
      videoThumbnailUrl: thumb,
      videoTitle: vTitle,
      ...clearEmbedDirect,
    };
  }

  if (vt === PatientReviewVideoType.EMBED) {
    const embed = parseEmbedPayload(body.embedPayload ?? body.embed);
    return {
      videoType: PatientReviewVideoType.EMBED,
      embedPayload: embed ?? Prisma.JsonNull,
      videoThumbnailUrl: thumb,
      videoTitle: vTitle,
      ...clearMux,
      directVideoUrl: null,
    };
  }

  const url =
    body.directVideoUrl != null ? String(body.directVideoUrl).trim() : "";

  return {
    videoType: PatientReviewVideoType.DIRECT,
    directVideoUrl: url || null,
    videoThumbnailUrl: thumb,
    videoTitle: vTitle,
    ...clearMux,
    embedPayload: Prisma.JsonNull,
  };
}

function validateVideoInput(slice: PatientReviewVideoSlice): string | null {
  if (!slice.videoType) {
    return null;
  }
  if (slice.videoType === PatientReviewVideoType.EMBED) {
    if (slice.embedPayload === Prisma.JsonNull) {
      return "embedPayload is required when videoType is EMBED";
    }
  }
  if (slice.videoType === PatientReviewVideoType.DIRECT) {
    if (!slice.directVideoUrl?.trim()) {
      return "directVideoUrl is required when videoType is DIRECT";
    }
  }
  return null;
}

function parseCoreReviewFields(
  body: Record<string, unknown>,
  kind: "normal",
):
  | { ok: true; data: CoreReviewFields }
  | { ok: false; message: string } {
  const description = String(body.description ?? "").trim();
  if (!description) {
    return { ok: false, message: "description is required" };
  }

  const rating = parseRating(body.rating);
  if (rating == null) {
    return { ok: false, message: "rating must be an integer 1–5" };
  }

  const patientRaw = body.patientDisplayName;
  const patientDisplayName =
    patientRaw != null && String(patientRaw).trim() !== ""
      ? String(patientRaw).trim()
      : null;

  if (!patientDisplayName) {
    return { ok: false, message: "patientDisplayName is required" };
  }

  const titleRaw = String(body.title ?? "").trim();
  const title = titleRaw || patientDisplayName;

  const result = String(body.result ?? "").trim();

  const problems = parseStringArray(body.problems);
  const treatments = parseStringArray(body.treatments);

  if (treatments.length === 0) {
    return { ok: false, message: "at least one treatment is required" };
  }

  const age = parseOptionalAge(body.age);

  const imageUrl =
    body.imageUrl != null && String(body.imageUrl).trim() !== ""
      ? String(body.imageUrl).trim()
      : null;
  const imagePublicId =
    body.imagePublicId != null && String(body.imagePublicId).trim() !== ""
      ? String(body.imagePublicId).trim()
      : null;

  let sortOrder = 0;
  if (body.sortOrder != null && body.sortOrder !== "") {
    const so = Number(body.sortOrder);
    if (!Number.isFinite(so)) {
      return { ok: false, message: "sortOrder must be a number" };
    }
    sortOrder = Math.trunc(so);
  }

  return {
    ok: true,
    data: {
      title,
      description,
      result,
      patientDisplayName,
      imageUrl,
      imagePublicId,
      problems: problems.length === 0 ? [] : problems,
      treatments,
      sortOrder,
      rating,
      age,
    },
  };
}
