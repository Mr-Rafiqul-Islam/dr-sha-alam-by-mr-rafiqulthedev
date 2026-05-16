/**
 * Admin HTTP API for `PatientReview` (Prisma). All routes require auth + admin role.
 *
 * Base path (see `routes/index.ts`): `GET|POST|PATCH /api/v1/admin/patient-reviews/...`
 *
 * | Method | Path | Handler |
 * |--------|------|---------|
 * | GET | `/` | List reviews (flat Prisma rows). Query: `status` |
 * | GET | `/with-videos` | Same filter; each row includes nested `video` |
 * | POST | `/` | Create curated review (optional video fields per schema) |
 * | PATCH | `/:id/status` | Set `status` to PENDING or ACTIVE |
 * | POST | `/:id/video` | Attach EMBED or DIRECT video only (not MUX) |
 * | POST | `/:id/video/mux-upload` | Mux upload URL (501 until media service wired) |
 *
 * Query `status`: omit or `ALL` = all; `ACTIVE`; `PENDING` or `INACTIVE` (unpublished).
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
import { parseRating } from "../../../utils/parsers.js";
import { toAdminReviewWithOptionalVideo } from "../../../modules/patientReviews/patientReviews.mapper.js";

export async function listPatientReviewsForAdmin(req: Request, res: Response) {
  try {
    const rawStatus = req.query.status;
    let statusFilter: PatientReviewStatus | null = null;
    let statusAll = false;

    if (rawStatus == null || rawStatus === "") {
      statusAll = true;
    } else {
      const s = String(rawStatus).trim().toUpperCase();
      if (s === "ALL") {
        statusAll = true;
      } else if (s === "ACTIVE") {
        statusFilter = PatientReviewStatus.ACTIVE;
      } else if (s === "PENDING" || s === "INACTIVE") {
        statusFilter = PatientReviewStatus.PENDING;
      } else {
        return res.status(400).json({
          success: false,
          message:
            'status must be ACTIVE, PENDING, INACTIVE, ALL, or omitted for all',
        });
      }
    }

    const where: Prisma.PatientReviewWhereInput = {};
    if (!statusAll && statusFilter) {
      where.status = statusFilter;
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
    const rawStatus = req.query.status;
    let statusFilter: PatientReviewStatus | null = null;
    let statusAll = false;

    if (rawStatus == null || rawStatus === "") {
      statusAll = true;
    } else {
      const s = String(rawStatus).trim().toUpperCase();
      if (s === "ALL") {
        statusAll = true;
      } else if (s === "ACTIVE") {
        statusFilter = PatientReviewStatus.ACTIVE;
      } else if (s === "PENDING" || s === "INACTIVE") {
        statusFilter = PatientReviewStatus.PENDING;
      } else {
        return res.status(400).json({
          success: false,
          message:
            'status must be ACTIVE, PENDING, INACTIVE, ALL, or omitted for all',
        });
      }
    }

    const where: Prisma.PatientReviewWhereInput = {};
    if (!statusAll && statusFilter) {
      where.status = statusFilter;
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
 * Video optional — omit `videoType` and video fields for text-only (matches schema nulls).
 */
export async function createPatientReview(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    const description = String(body.description ?? "").trim();
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "description is required" });
    }

    const rating = parseRating(body.rating);
    if (rating == null) {
      return res
        .status(400)
        .json({ success: false, message: "rating must be an integer 1–5" });
    }

    const patientRaw = body.patientDisplayName;
    const patientDisplayName =
      patientRaw != null && String(patientRaw).trim() !== ""
        ? String(patientRaw).trim()
        : null;
    if (!patientDisplayName) {
      return res.status(400).json({
        success: false,
        message: "patientDisplayName is required",
      });
    }

    const titleRaw = String(body.title ?? "").trim();
    const title = titleRaw || patientDisplayName;

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
        return res
          .status(400)
          .json({ success: false, message: "sortOrder must be a number" });
      }
      sortOrder = Math.trunc(so);
    }

    let videoType: PatientReviewVideoType | null = null;
    if (body.videoType != null && body.videoType !== "") {
      const u = String(body.videoType).toUpperCase();
      if (u === "MUX" || u === "EMBED" || u === "DIRECT") {
        videoType = u as PatientReviewVideoType;
      }
    }

    const thumb =
      body.videoThumbnailUrl != null
        ? String(body.videoThumbnailUrl).trim() || null
        : null;
    const vTitle =
      body.videoTitle != null ? String(body.videoTitle).trim() || null : null;

    let videoSlice: Pick<
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

    if (!videoType) {
      videoSlice = {
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
    } else if (videoType === PatientReviewVideoType.MUX) {
      const playbackPolicyRaw = body.muxPlaybackPolicy;
      const muxPlaybackPolicy =
        playbackPolicyRaw != null && String(playbackPolicyRaw).trim() !== ""
          ? String(playbackPolicyRaw).trim()
          : "signed";

      videoSlice = {
        videoType: PatientReviewVideoType.MUX,
        muxUploadId:
          body.muxUploadId != null
            ? String(body.muxUploadId).trim() || null
            : null,
        muxAssetId:
          body.muxAssetId != null
            ? String(body.muxAssetId).trim() || null
            : null,
        muxPlaybackId:
          body.muxPlaybackId != null
            ? String(body.muxPlaybackId).trim() || null
            : null,
        muxPlaybackPolicy,
        videoThumbnailUrl: thumb,
        videoTitle: vTitle,
        embedPayload: Prisma.JsonNull,
        directVideoUrl: null,
      };
    } else if (videoType === PatientReviewVideoType.EMBED) {
      let embed: Prisma.InputJsonValue | null = null;
      const embedRaw = body.embedPayload ?? body.embed;
      if (embedRaw != null) {
        if (typeof embedRaw === "string") {
          try {
            embed = JSON.parse(embedRaw) as Prisma.InputJsonValue;
          } catch {
            embed = null;
          }
        } else if (typeof embedRaw === "object") {
          embed = embedRaw as Prisma.InputJsonValue;
        }
      }

      if (embed == null) {
        return res.status(400).json({
          success: false,
          message: "embedPayload is required when videoType is EMBED",
        });
      }

      videoSlice = {
        videoType: PatientReviewVideoType.EMBED,
        embedPayload: embed,
        videoThumbnailUrl: thumb,
        videoTitle: vTitle,
        muxUploadId: null,
        muxAssetId: null,
        muxPlaybackId: null,
        muxPlaybackPolicy: null,
        directVideoUrl: null,
      };
    } else {
      const url =
        body.directVideoUrl != null ? String(body.directVideoUrl).trim() : "";

      if (!url) {
        return res.status(400).json({
          success: false,
          message: "directVideoUrl is required when videoType is DIRECT",
        });
      }

      videoSlice = {
        videoType: PatientReviewVideoType.DIRECT,
        directVideoUrl: url,
        videoThumbnailUrl: thumb,
        videoTitle: vTitle,
        muxUploadId: null,
        muxAssetId: null,
        muxPlaybackId: null,
        muxPlaybackPolicy: null,
        embedPayload: Prisma.JsonNull,
      };
    }

    let status: PatientReviewStatus = PatientReviewStatus.ACTIVE;
    if (body.status != null && String(body.status).toUpperCase() === "PENDING") {
      status = PatientReviewStatus.PENDING;
    }

    const created = await prisma.patientReview.create({
      data: {
        status,
        authorUserId: null,
        patientDisplayName,
        title,
        description,
        rating,
        imageUrl,
        imagePublicId,
        sortOrder,
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

    let videoType: PatientReviewVideoType | null = null;
    if (body.videoType != null && body.videoType !== "") {
      const u = String(body.videoType).toUpperCase();
      if (u === "MUX" || u === "EMBED" || u === "DIRECT") {
        videoType = u as PatientReviewVideoType;
      }
    }

    if (!videoType || videoType === PatientReviewVideoType.MUX) {
      return res.status(400).json({
        success: false,
        message: 'videoType must be "EMBED" or "DIRECT" for this endpoint',
      });
    }

    const thumb =
      body.videoThumbnailUrl != null
        ? String(body.videoThumbnailUrl).trim() || null
        : null;
    const vTitle =
      body.videoTitle != null ? String(body.videoTitle).trim() || null : null;

    let slice: Pick<
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

    if (videoType === PatientReviewVideoType.EMBED) {
      let embed: Prisma.InputJsonValue | null = null;
      const embedRaw = body.embedPayload ?? body.embed;
      if (embedRaw != null) {
        if (typeof embedRaw === "string") {
          try {
            embed = JSON.parse(embedRaw) as Prisma.InputJsonValue;
          } catch {
            embed = null;
          }
        } else if (typeof embedRaw === "object") {
          embed = embedRaw as Prisma.InputJsonValue;
        }
      }

      if (embed == null) {
        return res.status(400).json({
          success: false,
          message: "embedPayload is required when videoType is EMBED",
        });
      }

      slice = {
        videoType: PatientReviewVideoType.EMBED,
        embedPayload: embed,
        videoThumbnailUrl: thumb,
        videoTitle: vTitle,
        muxUploadId: null,
        muxAssetId: null,
        muxPlaybackId: null,
        muxPlaybackPolicy: null,
        directVideoUrl: null,
      };
    } else {
      const url =
        body.directVideoUrl != null ? String(body.directVideoUrl).trim() : "";

      if (!url) {
        return res.status(400).json({
          success: false,
          message: "directVideoUrl is required when videoType is DIRECT",
        });
      }

      slice = {
        videoType: PatientReviewVideoType.DIRECT,
        directVideoUrl: url,
        videoThumbnailUrl: thumb,
        videoTitle: vTitle,
        muxUploadId: null,
        muxAssetId: null,
        muxPlaybackId: null,
        muxPlaybackPolicy: null,
        embedPayload: Prisma.JsonNull,
      };
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
