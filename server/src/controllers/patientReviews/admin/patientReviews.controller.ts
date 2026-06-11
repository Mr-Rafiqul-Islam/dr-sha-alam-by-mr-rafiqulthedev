/**
 * Admin HTTP API for `PatientReview` (Prisma). All routes require auth + admin role.
 *
 * Base path: `GET|POST|PATCH /api/v1/admin/patient-reviews/...`
 *
 * | Method | Path | Handler |
 * |--------|------|---------|
 * | GET | `/` | List reviews (flat Prisma rows). Query: `status` |
 * | GET | `/with-videos` | Same filter; each row includes nested `video` |
 * | POST | `/` | Create curated text/image review |
 * | PATCH | `/:id/status` | Set `status` to PENDING or ACTIVE |
 * | POST | `/:id/thumbnail/upload` | Upload thumbnail (multipart `my_file`) |
 * | POST | `/:id/video/mux-upload` | Mux direct upload URL (public playback) |
 */
import type { Request, Response } from "express";
import multer from "multer";
import { MuxVideoStatus, PatientReviewStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { uploadImageBuffer } from "../../../services/cloudinary/cloudinary.service.js";
import { createPatientReviewDirectUpload } from "../../../services/mux/muxUpload.service.js";
import { routeParamString } from "../../../utils/index.js";
import { parseRating } from "../../../utils/parsers.js";
import { toAdminReviewWithOptionalVideo } from "../../../modules/patientReviews/patientReviews.mapper.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

/** Curated create: defaults to ACTIVE unless `status: "PENDING"`. Text/image only. */
export async function createPatientReview(req: Request, res: Response) {
  try {
    const body = (req.body ?? {}) as Record<string, unknown>;

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

    let status: PatientReviewStatus = PatientReviewStatus.ACTIVE;
    if (body.status != null && String(body.status).toUpperCase() === "PENDING") {
      status = PatientReviewStatus.PENDING;
    }

    const created = await prisma.patientReview.create({
      data: {
        status,
        patientDisplayName,
        title,
        description,
        rating,
      },
    });

    res.status(201).json({ success: true, message: "Patient review created successfully" });
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

export async function uploadPatientReviewThumbnail(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Review id is required",
    });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Multipart field "my_file" is required',
    });
  }

  try {
    const existing = await prisma.patientReview.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const uploaded = await uploadImageBuffer(file.buffer);

    await prisma.patientReview.update({
      where: { id },
      data: {
        imageUrl: uploaded.optimizedUrl,
        imagePublicId: uploaded.imageId,
        videoThumbnailUrl: existing.videoThumbnailUrl ?? uploaded.optimizedUrl,
      },
    });

    res.json({
      success: true,
      payload: {
        imageId: uploaded.imageId,
        optimizedUrl: uploaded.optimizedUrl,
      },
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "CLOUDINARY_NOT_CONFIGURED") {
      return res.status(501).json({
        success: false,
        message: "Cloudinary is not configured on this service",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to upload thumbnail",
    });
  }
}

export async function createMuxUploadForPatientReview(
  req: Request,
  res: Response,
) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Review id is required",
    });
  }

  const body = req.body as Record<string, unknown>;
  const title =
    body.title != null && String(body.title).trim() !== ""
      ? String(body.title).trim()
      : undefined;

  try {
    const existing = await prisma.patientReview.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const muxResult = await createPatientReviewDirectUpload({
      patientReviewId: id,
      title: title ?? existing.videoTitle ?? existing.title,
      playbackPolicy: "public",
    });

    await prisma.patientReview.update({
      where: { id },
      data: {
        muxUploadId: muxResult.muxUploadId,
        mediaAssetId: muxResult.mediaAssetId,
        muxVideoStatus: MuxVideoStatus.PROCESSING,
        muxPlaybackPolicy: "public",
        videoTitle: title ?? existing.videoTitle ?? existing.title,
      },
    });

    res.json({
      success: true,
      payload: {
        mediaAssetId: muxResult.mediaAssetId,
        uploadUrl: muxResult.uploadUrl,
        muxUploadId: muxResult.muxUploadId,
        status: muxResult.status,
      },
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error && err.message === "MUX_NOT_CONFIGURED") {
      return res.status(501).json({
        success: false,
        message: "Mux is not configured on this service",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create Mux upload URL",
    });
  }
}
