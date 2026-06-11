/**
 * Admin HTTP API for `SuccessStory`. Routes require auth + admin role.
 *
 * Base path: `/api/v1/admin/success-stories`
 */
import type { Request, Response } from "express";
import { PatientReviewStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { uploadImageBuffer } from "../../../services/cloudinary/cloudinary.service.js";
import { routeParamString } from "../../../utils/index.js";
import {
  parseAge,
  parseRating,
  parseStringArray,
} from "../../../utils/parsers.js";

export async function listSuccessStoriesForAdmin(req: Request, res: Response) {
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

    const where: Prisma.SuccessStoryWhereInput = {};
    if (!statusAll && statusFilter) {
      where.status = statusFilter;
    }

    const rows = await prisma.successStory.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load success stories",
    });
  }
}

export async function createSuccessStory(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    const patientName = String(body.patientName ?? "").trim();
    if (!patientName) {
      return res
        .status(400)
        .json({ success: false, message: "patientName is required" });
    }

    const patientReview = String(body.patientReview ?? "").trim();
    if (!patientReview) {
      return res
        .status(400)
        .json({ success: false, message: "patientReview is required" });
    }

    const age = parseAge(body.age);
    if (age == null) {
      return res
        .status(400)
        .json({ success: false, message: "age must be an integer 0–150" });
    }

    const rating = parseRating(body.rating);
    if (rating == null) {
      return res
        .status(400)
        .json({ success: false, message: "rating must be an integer 1–5" });
    }

    const problems = parseStringArray(body.problems);
    if (problems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "at least one problem is required" });
    }

    const treatments = parseStringArray(body.treatments);
    if (treatments.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "at least one treatment is required" });
    }

    const result = String(body.result ?? "").trim();
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "result is required" });
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

    const created = await prisma.successStory.create({
      data: {
        status,
        patientName,
        patientReview,
        age,
        rating,
        problems,
        treatments,
        result,
        imageUrl,
        imagePublicId,
        sortOrder,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create success story",
    });
  }
}

export async function updateSuccessStoryStatus(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Success story id is required",
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

    const updated = await prisma.successStory.update({
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
          message: "Success story not found",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to update success story status",
    });
  }
}

export async function updateSuccessStory(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Success story id is required",
      });
    }

    const body = req.body as Record<string, unknown>;

    const patientName = String(body.patientName ?? "").trim();
    if (!patientName) {
      return res
        .status(400)
        .json({ success: false, message: "patientName is required" });
    }

    const patientReview = String(body.patientReview ?? "").trim();
    if (!patientReview) {
      return res
        .status(400)
        .json({ success: false, message: "patientReview is required" });
    }

    const age = parseAge(body.age);
    if (age == null) {
      return res
        .status(400)
        .json({ success: false, message: "age must be an integer 0–150" });
    }

    const rating = parseRating(body.rating);
    if (rating == null) {
      return res
        .status(400)
        .json({ success: false, message: "rating must be an integer 1–5" });
    }

    const problems = parseStringArray(body.problems);
    if (problems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "at least one problem is required" });
    }

    const treatments = parseStringArray(body.treatments);
    if (treatments.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "at least one treatment is required" });
    }

    const result = String(body.result ?? "").trim();
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "result is required" });
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
        return res
          .status(400)
          .json({ success: false, message: "sortOrder must be a number" });
      }
      sortOrder = Math.trunc(so);
    }

    const updated = await prisma.successStory.update({
      where: { id },
      data: {
        patientName,
        patientReview,
        age,
        rating,
        problems,
        treatments,
        result,
        imageUrl,
        imagePublicId,
        sortOrder,
      },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Success story not found",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to update success story",
    });
  }
}

export async function uploadSuccessStoryImage(req: Request, res: Response) {
  const id = routeParamString(req.params.id);
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Success story id is required",
    });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Multipart field "drsa-file" is required',
    });
  }

  try {
    const existing = await prisma.successStory.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Success story not found",
      });
    }

    const uploaded = await uploadImageBuffer(file.buffer, "success-stories");

    await prisma.successStory.update({
      where: { id },
      data: {
        imageUrl: uploaded.optimizedUrl,
        imagePublicId: uploaded.imageId,
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
      message: "Failed to upload image",
    });
  }
}
