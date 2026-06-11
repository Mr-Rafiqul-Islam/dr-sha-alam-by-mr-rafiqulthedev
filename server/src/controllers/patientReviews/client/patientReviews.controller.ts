/**
 * Public HTTP API for approved patient reviews (`PatientReview` with `status: ACTIVE`).
 *
 * Base path: `GET|POST /api/v1/client/patient-reviews/...`
 *
 * | Method | Path | Purpose |
 * |--------|------|---------|
 * | GET | `/` | List review cards (id, patientDisplayName, title, description, rating) |
 * | GET | `/videos` | Active reviews with ready Mux video metadata |
 * | POST | `/` | Patient submit → always stored as `PENDING` until admin approves |
 */
import type { Request, Response } from "express";
import { MuxVideoStatus, PatientReviewStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { parseOptionalUuid } from "../../../utils/index.js";
import { parseRating } from "../../../utils/parsers.js";
import {
  toPublicReviewSimple,
  toPublicVideoListItem,
} from "../../../modules/patientReviews/patientReviews.mapper.js";

export async function getPatientReviews(req: Request, res: Response) {
  try {
    const rows = await prisma.patientReview.findMany({
      where: { status: PatientReviewStatus.ACTIVE },
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
      const total = await prisma.patientReview.count({
        where: { status: PatientReviewStatus.ACTIVE },
      });
      return res.json({
        success: true,
        data: rows.map(toPublicReviewSimple),
        meta: {
          counts: { total },
        },
      });
    }

    res.json({ success: true, data: rows.map(toPublicReviewSimple) });
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
    const rows = await prisma.patientReview.findMany({
      where: {
        status: PatientReviewStatus.ACTIVE,
        muxPlaybackId: { not: null },
        muxVideoStatus: MuxVideoStatus.READY,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    console.log("rows", rows);
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

/** Patient submissions: text/image only, always `PENDING`. */
export async function submitPatientReview(req: Request, res: Response) {
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

    const authorUserId = parseOptionalUuid(body.authorUserId);

    const created = await prisma.patientReview.create({
      data: {
        status: PatientReviewStatus.PENDING,
        authorUserId: authorUserId ?? null,
        patientDisplayName,
        title,
        description,
        rating,
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
      message: "Failed to submit patient review",
    });
  }
}
