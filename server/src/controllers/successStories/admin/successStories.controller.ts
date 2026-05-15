/**
 * Admin HTTP API for `SuccessStory`. Routes require auth + admin role.
 *
 * Base path: `/api/v1/admin/success-stories`
 */
import type { Request, Response } from "express";
import { PatientReviewStatus, Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/index.js";
import {
  parseAge,
  parseRating,
  parseStringArray,
} from "../../../utils/parsers.js";

export async function listSuccessStoriesForAdmin(req: Request, res: Response) {
  try {
    const statusWhere = parseListStatusQuery(req.query.status);
    if (!statusWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'status must be ACTIVE, PENDING, INACTIVE, ALL, or omitted for all',
      });
    }

    const where: Prisma.SuccessStoryWhereInput = {};
    if (statusWhere.mode === "one") {
      where.status = statusWhere.status;
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
    const parsed = parseSuccessStoryFields(body);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    let status: PatientReviewStatus = PatientReviewStatus.ACTIVE;
    if (body.status != null && String(body.status).toUpperCase() === "PENDING") {
      status = PatientReviewStatus.PENDING;
    }

    const created = await prisma.successStory.create({
      data: {
        status,
        age: parsed.data.age,
        rating: parsed.data.rating,
        problems: parsed.data.problems,
        treatments: parsed.data.treatments,
        result: parsed.data.result,
        imageUrl: parsed.data.imageUrl,
        imagePublicId: parsed.data.imagePublicId,
        sortOrder: parsed.data.sortOrder,
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
    const parsed = parseSuccessStoryFields(body);
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const updated = await prisma.successStory.update({
      where: { id },
      data: {
        age: parsed.data.age,
        rating: parsed.data.rating,
        problems: parsed.data.problems,
        treatments: parsed.data.treatments,
        result: parsed.data.result,
        imageUrl: parsed.data.imageUrl,
        imagePublicId: parsed.data.imagePublicId,
        sortOrder: parsed.data.sortOrder,
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

type SuccessStoryFields = {
  age: number;
  rating: number;
  problems: string[];
  treatments: string[];
  result: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  sortOrder: number;
};

function parseSuccessStoryFields(body: Record<string, unknown>):
  | { ok: true; data: SuccessStoryFields }
  | { ok: false; message: string } {
  const age = parseAge(body.age);
  if (age == null) {
    return { ok: false, message: "age must be an integer 0–150" };
  }

  const rating = parseRating(body.rating);
  if (rating == null) {
    return { ok: false, message: "rating must be an integer 1–5" };
  }

  const problems = parseStringArray(body.problems);
  if (problems.length === 0) {
    return { ok: false, message: "at least one problem is required" };
  }

  const treatments = parseStringArray(body.treatments);
  if (treatments.length === 0) {
    return { ok: false, message: "at least one treatment is required" };
  }

  const result = String(body.result ?? "").trim();
  if (!result) {
    return { ok: false, message: "result is required" };
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
      age,
      rating,
      problems,
      treatments,
      result,
      imageUrl,
      imagePublicId,
      sortOrder,
    },
  };
}
