/**
 * Public blogs API: only rows with `published: true`.
 *
 * Base: `GET /api/v1/client/blogs` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/express-params.js";
import { parseIntInRange } from "../../../utils/parsers.js";
import { toPublicBlog } from "../../../modules/blogs/blogs.mapper.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export async function listBlogs(req: Request, res: Response) {
  try {
    const limitRaw = req.query.limit;
    const offsetRaw = req.query.offset;
    let limit =
      limitRaw != null && limitRaw !== ""
        ? parseIntInRange(limitRaw, 1, MAX_LIMIT)
        : DEFAULT_LIMIT;
    if (limit === null) {
      return res.status(400).json({
        success: false,
        message: `limit must be an integer from 1 to ${MAX_LIMIT}`,
      });
    }
    let offset = 0;
    if (offsetRaw != null && offsetRaw !== "") {
      const o = parseIntInRange(offsetRaw, 0, 1_000_000);
      if (o === null) {
        return res.status(400).json({
          success: false,
          message: "offset must be a non‑negative integer",
        });
      }
      offset = o;
    }

    const categoryWhere = parseOptionalCategory(req.query.category);
    if (!categoryWhere.ok) {
      return res.status(400).json({
        success: false,
        message: "category must be a non‑empty string when provided",
      });
    }

    const featuredWhere = parseOptionalFeaturedTriState(req);
    if (!featuredWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          "featured / isFeatured must be true/false or omitted (use true, false, 1, 0)",
      });
    }

    const where: Prisma.BlogWhereInput = { published: true };
    if (categoryWhere.category != null) {
      where.category = categoryWhere.category;
    }
    if (featuredWhere.mode === "one") {
      where.isFeatured = featuredWhere.isFeatured;
    }

    const [total, rows] = await prisma.$transaction([
      prisma.blog.count({ where }),
      prisma.blog.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
    ]);

    res.json({
      success: true,
      data: rows.map(toPublicBlog),
      meta: { total, limit, offset },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load blogs",
    });
  }
}

export async function getBlogBySlug(req: Request, res: Response) {
  try {
    const slugRaw = routeParamString(req.params.slug);
    const slug =
      slugRaw != null ? normalizeSlugForLookup(slugRaw) : "";
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "slug is required",
      });
    }

    const exists = await prisma.blog.findUnique({
      where: { slug },
      select: { id: true, published: true },
    });
    if (!exists?.published) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    await prisma.blog.update({
      where: { id: exists.id },
      data: { views: { increment: 1 } },
    });

    const row = await prisma.blog.findUnique({
      where: { id: exists.id },
    });
    if (!row?.published) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({ success: true, data: toPublicBlog(row) });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load blog",
    });
  }
}

function parseOptionalCategory(raw: unknown):
  | { ok: true; category: string | null }
  | { ok: false } {
  if (raw == null || raw === "") {
    return { ok: true, category: null };
  }
  const s = String(raw).trim();
  if (!s) return { ok: false };
  return { ok: true, category: s };
}

function parseOptionalFeaturedTriState(req: Request):
  | { ok: true; mode: "all" }
  | { ok: true; mode: "one"; isFeatured: boolean }
  | { ok: false } {
  const rawFeatured = req.query.featured ?? req.query.isFeatured;
  if (rawFeatured == null || rawFeatured === "") {
    return { ok: true, mode: "all" };
  }

  let v: unknown = rawFeatured;
  if (typeof v === "string") {
    const t = v.trim().toLowerCase();
    if (t === "true" || t === "1" || t === "yes") return { ok: true, mode: "one", isFeatured: true };
    if (t === "false" || t === "0" || t === "no") return { ok: true, mode: "one", isFeatured: false };
    return { ok: false };
  }
  if (typeof v === "boolean") {
    return { ok: true, mode: "one", isFeatured: v };
  }
  if (typeof v === "number") {
    if (v === 1) return { ok: true, mode: "one", isFeatured: true };
    if (v === 0) return { ok: true, mode: "one", isFeatured: false };
  }
  return { ok: false };
}

/** Match stored slug: trim + lowercase (same normalization as admin create/update). */
function normalizeSlugForLookup(s: string): string {
  return s.trim().toLowerCase();
}
