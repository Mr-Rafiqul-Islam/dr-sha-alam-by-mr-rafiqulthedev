/**
 * Admin HTTP API for `PatientReview` (Prisma). All routes require auth + admin role.
 *
 * Base path (see `routes/index.ts`): `GET|POST|PATCH /api/v1/admin/patient-reviews/...`
 *
 * | Method | Path | Handler |
 * |--------|------|---------|
 * | GET | `/` | List reviews (flat Prisma rows). Query: `status`, `type` |
 * | GET | `/with-videos` | Same filter; each row includes nested `video` |
 * | POST | `/` | Create curated review (optional video fields per schema) |
 * | PATCH | `/:id/status` | Set `status` to PENDING or ACTIVE |
 * | POST | `/:id/video` | Attach EMBED or DIRECT video only (not MUX) |
 * | POST | `/:id/video/mux-upload` | Mux upload URL (501 until media service wired) |
 *
 * Query `status`: omit or `ALL` = all; `ACTIVE`; `PENDING` or `INACTIVE` (unpublished).
 * Query `type`: omit or `all`; `normal`; `success` / `successStory`.
 */
import type { Request, Response } from "express";
import {
  PatientReviewStatus,
  PatientReviewVideoType,
  Prisma,
} from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { createMuxUploadViaMediaService } from "../../../services/media/muxUpload.stub.js";
import { routeParamString } from "../../../utils/index.js";
import {
  parseAge,
  parseOptionalAge,
  parseRating,
  parseStringArray,
} from "../../../utils/parsers.js";
import { toAdminReviewWithOptionalVideo } from "../../../modules/patientReviews/patientReviews.mapper.js";

// --- Handlers ----------------------------------------------------------------

export async function listPatientReviewsForAdmin(req: Request, res: Response) {
  try {
    const statusWhere = parseListStatusQuery(req.query.status);
    if (!statusWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'status must be ACTIVE, PENDING, INACTIVE, ALL, or omitted for all',
      });
    }

    const typeWhere = parseListTypeQuery(req.query.type);
    if (!typeWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'type must be all, normal, success, successStory, or omitted for all',
      });
    }

    const where: Prisma.PatientReviewWhereInput = {};
    if (statusWhere.mode === "one") {
      where.status = statusWhere.status;
    }
    if (typeWhere.mode === "one") {
      where.isSuccessStory = typeWhere.isSuccessStory;
    }

    const rows = await prisma.patientReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load patient reviews",
    });
  }
}

export async function listPatientReviewsWithVideosForAdmin(
  req: Request,
  res: Response,
) {
  try {
    const statusWhere = parseListStatusQuery(req.query.status);
    if (!statusWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'status must be ACTIVE, PENDING, INACTIVE, ALL, or omitted for all',
      });
    }

    const typeWhere = parseListTypeQuery(req.query.type);
    if (!typeWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'type must be all, normal, success, successStory, or omitted for all',
      });
    }

    const where: Prisma.PatientReviewWhereInput = {};
    if (statusWhere.mode === "one") {
      where.status = statusWhere.status;
    }
    if (typeWhere.mode === "one") {
      where.isSuccessStory = typeWhere.isSuccessStory;
    }

    const rows = await prisma.patientReview.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({
      success: true,
      data: rows.map(toAdminReviewWithOptionalVideo),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load patient reviews",
    });
  }
}

/**
 * Curated create: defaults to ACTIVE unless `status: "PENDING"`.
 * Success story if `feature` or `isSuccessStory` is truthy (stricter fields).
 * Video optional — omit `videoType` and video fields for text-only (matches schema nulls).
 */
export async function createPatientReview(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    let isSuccessStory = false;
    const rawStory = body.isSuccessStory ?? body.feature;
    if (rawStory != null && rawStory !== "") {
      if (typeof rawStory === "boolean") {
        isSuccessStory = rawStory;
      } else {
        const t = String(rawStory).trim().toLowerCase();
        if (t === "true" || t === "1" || t === "yes") {
          isSuccessStory = true;
        }
      }
    }

    const kind = isSuccessStory ? "successStory" : "normal";
    const parsed = parseCoreReviewFields(body, kind);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const videoSlice = buildVideoInputFromBody(body);
    const videoErr = validateVideoInput(videoSlice);
    if (videoErr) {
      return res.status(400).json({ success: false, message: videoErr });
    }

    let status: PatientReviewStatus = PatientReviewStatus.ACTIVE;
    if (body.status != null && String(body.status).toUpperCase() === "PENDING") {
      status = PatientReviewStatus.PENDING;
    }

    const created = await prisma.patientReview.create({
      data: {
        status,
        isSuccessStory,
        authorUserId: null,
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
      message: "Failed to create patient review",
    });
  }
}

export async function updatePatientReviewStatus(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id is required",
      });
    }

    const raw = (req.body as Record<string, unknown>)?.status;
    let status: PatientReviewStatus | null = null;
    if (raw != null) {
      const s = String(raw).toUpperCase();
      if (s === "PENDING") {
        status = PatientReviewStatus.PENDING;
      } else if (s === "ACTIVE") {
        status = PatientReviewStatus.ACTIVE;
      }
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'status must be "PENDING" or "ACTIVE"',
      });
    }

    const updated = await prisma.patientReview.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to update review status",
    });
  }
}

export async function attachEmbedOrDirectVideo(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Review id is required",
      });
    }
    const body = req.body as Record<string, unknown>;
    const slice = buildVideoInputFromBody(body);

    if (
      !slice.videoType ||
      slice.videoType === PatientReviewVideoType.MUX
    ) {
      return res.status(400).json({
        success: false,
        message: 'videoType must be "EMBED" or "DIRECT" for this endpoint',
      });
    }

    const videoErr = validateVideoInput(slice);
    if (videoErr) {
      return res.status(400).json({ success: false, message: videoErr });
    }

    const updated = await prisma.patientReview.update({
      where: { id },
      data: { ...slice },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to attach video",
    });
  }
}

/** Contract placeholder: returns 501 until Mux/media is configured (`muxUpload.stub.ts`). */
export async function createMuxUploadForPatientReview(
  req: Request,
  res: Response,
) {
  const adminId = req.admin?.id;
  const body = req.body as Record<string, unknown>;

  try {
    await createMuxUploadViaMediaService({
      title: body.title != null ? String(body.title) : "",
      level: body.level != null ? String(body.level) : "",
      access: body.access != null ? String(body.access) : "",
      imageId: body.imageId != null ? String(body.imageId) : "",
      playbackPolicy:
        body.playbackPolicy != null ? String(body.playbackPolicy) : "signed",
      adminId: adminId ?? (body.adminId != null ? String(body.adminId) : null),
    });
  } catch {
    return res.status(501).json({
      success: false,
      message:
        "Video upload URL creation failed — Mux/media integration not configured on this service",
    });
  }
}

// --- List query parsing (aligned with Prisma `PatientReview` filters) --------

function parseListStatusQuery(raw: unknown):
  | { ok: true; mode: "all" }
  | { ok: true; mode: "one"; status: PatientReviewStatus }
  | { ok: false } {
  if (raw == null || raw === "") {
    return { ok: true, mode: "all" };
  }
  const s = String(raw).trim().toUpperCase();
  if (s === "ALL") {
    return { ok: true, mode: "all" };
  }
  if (s === "ACTIVE") {
    return { ok: true, mode: "one", status: PatientReviewStatus.ACTIVE };
  }
  if (s === "PENDING" || s === "INACTIVE") {
    return { ok: true, mode: "one", status: PatientReviewStatus.PENDING };
  }
  return { ok: false };
}

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

// --- Body → Prisma field parsing (matches `PatientReview` model) --------------

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

type CoreReviewKind = "normal" | "successStory";

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
  kind: CoreReviewKind,
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

  if (kind === "normal") {
    if (!patientDisplayName) {
      return { ok: false, message: "patientDisplayName is required" };
    }
  }

  const titleRaw = String(body.title ?? "").trim();
  const title =
    kind === "normal" ? titleRaw || patientDisplayName! : titleRaw;

  if (kind === "successStory" && !title) {
    return { ok: false, message: "title is required" };
  }

  const result = String(body.result ?? "").trim();

  if (kind === "successStory" && !result) {
    return { ok: false, message: "result is required" };
  }

  const problems = parseStringArray(body.problems);
  const treatments = parseStringArray(body.treatments);

  if (kind === "successStory") {
    if (problems.length === 0) {
      return { ok: false, message: "at least one problem is required" };
    }
    if (treatments.length === 0) {
      return { ok: false, message: "at least one treatment is required" };
    }
  } else {
    if (treatments.length === 0) {
      return { ok: false, message: "at least one treatment is required" };
    }
  }

  const age =
    kind === "successStory" ? parseAge(body.age) : parseOptionalAge(body.age);

  if (kind === "successStory" && age == null) {
    return { ok: false, message: "age must be an integer 0–150" };
  }

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
      problems: kind === "normal" && problems.length === 0 ? [] : problems,
      treatments,
      sortOrder,
      rating,
      age,
    },
  };
}
