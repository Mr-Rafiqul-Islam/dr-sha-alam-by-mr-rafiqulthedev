import type { Request, Response } from "express";
import { PatientReviewVideoType, Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma.js";
import { createMuxUploadViaMediaService } from "../../../services/media/muxUpload.stub.js";
import {
  buildVideoInputFromBody,
  parseAdminStatus,
  parseCoreReviewFields,
  parsePatchStatus,
  routeParamString,
  validateVideoInput,
} from "../patientReviews.helpers.js";

/**
 * Curated admin-created reviews default to **ACTIVE** unless `status: "PENDING"`
 * is sent.
 *
 * **Video is optional:** omit `videoType` and all video-related fields when the
 * story has no clip (same as patient submit).
 */
export async function createPatientReview(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;
    const parsed = parseCoreReviewFields(body);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const videoSlice = buildVideoInputFromBody(body);
    const videoErr = validateVideoInput(videoSlice);
    if (videoErr) {
      return res.status(400).json({ success: false, message: videoErr });
    }

    const status = parseAdminStatus(body.status);

    const created = await prisma.patientReview.create({
      data: {
        status,
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
    const status = parsePatchStatus(
      (req.body as Record<string, unknown>)?.status,
    );
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
      data: {
        ...slice,
      },
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

/** Mirrors your Core `handleVideoUpload` contract; returns 501 until media service is wired (see muxUpload.stub.ts). */
export async function createMuxUploadForPatientReview(
  req: Request,
  res: Response,
) {
  const adminReq = req as Request & { admin?: { id?: string } };
  const adminId = adminReq.admin?.id;
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
