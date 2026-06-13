/**
 * Public blogs API: only rows with `published: true`.
 *
 * Base: `GET /api/v1/client/blogs` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/express-params.js";
import { toPublicBlog } from "../../../modules/blogs/blogs.mapper.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export async function listBlogs(req: Request, res: Response) {
  try {
    const limitRaw = req.query.limit;
    const offsetRaw = req.query.offset;
    let limit =
      limitRaw != null && limitRaw !== ""
        ? parseInt(limitRaw as string, 10)
        : DEFAULT_LIMIT;
    if (limit === null) {
      return res.status(400).json({
        success: false,
        message: `limit must be an integer from 1 to ${MAX_LIMIT}`,
      });
    }
    let offset = 0;
    if (offsetRaw != null && offsetRaw !== "") {
      const o = parseInt(offsetRaw as string, 10);
      if (isNaN(o)) {
        return res.status(400).json({
          success: false,
          message: "offset must be a non‑negative integer",
        });
      }
      offset = o;
    }

    const rawCategory = req.query.category;
    let categoryFilter: string | null = null;
    if (rawCategory != null && rawCategory !== "") {
      const s = String(rawCategory).trim();
      if (!s) {
        return res.status(400).json({
          success: false,
          message: "category must be a non‑empty string when provided",
        });
      }
      categoryFilter = s;
    }

    const rawFeatured = req.query.featured ?? req.query.isFeatured;
    let featuredFilter: boolean | null = null;
    let featuredAll = false;
    if (rawFeatured == null || rawFeatured === "") {
      featuredAll = true;
    } else if (typeof rawFeatured === "string") {
      const t = rawFeatured.trim().toLowerCase();
      if (t === "true" || t === "1" || t === "yes") featuredFilter = true;
      else if (t === "false" || t === "0" || t === "no") featuredFilter = false;
      else {
        return res.status(400).json({
          success: false,
          message:
            "featured / isFeatured must be true/false or omitted (use true, false, 1, 0)",
        });
      }
    } else if (typeof rawFeatured === "boolean") {
      featuredFilter = rawFeatured;
    } else if (typeof rawFeatured === "number") {
      if (rawFeatured === 1) featuredFilter = true;
      else if (rawFeatured === 0) featuredFilter = false;
      else {
        return res.status(400).json({
          success: false,
          message:
            "featured / isFeatured must be true/false or omitted (use true, false, 1, 0)",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message:
          "featured / isFeatured must be true/false or omitted (use true, false, 1, 0)",
      });
    }

    const where: Prisma.BlogWhereInput = { published: true };
    if (categoryFilter != null) {
      where.category = { has: categoryFilter };
    }
    if (!featuredAll && featuredFilter !== null) {
      where.isFeatured = featuredFilter;
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
    const slug = slugRaw != null ? slugRaw.trim().toLowerCase() : "";
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
