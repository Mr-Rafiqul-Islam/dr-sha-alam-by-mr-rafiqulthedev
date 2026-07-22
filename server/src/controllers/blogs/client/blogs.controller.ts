/**
 * Public blogs API: only rows with `published: true`.
 *
 * Base: `GET /api/v1/client/blogs` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/express-params.js";
import { decodeRouteParam } from "../../../utils/decode-route-param.js";
import {
  BLOG_LIST_SELECT,
  toPublicBlog,
  toPublicBlogListItem,
} from "../../../modules/blogs/blogs.mapper.js";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 100;

type BlogListPagination = {
  limit: number;
  offset: number;
  page: number;
};

function parseBlogListPagination(req: Request): BlogListPagination | null {
  const limitRaw = req.query.limit;
  const offsetRaw = req.query.offset;
  const pageRaw = req.query.page;

  let limit = DEFAULT_LIMIT;
  if (limitRaw != null && limitRaw !== "") {
    const parsedLimit = parseInt(String(limitRaw), 10);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > MAX_LIMIT) {
      return null;
    }
    limit = parsedLimit;
  }

  let offset = 0;
  if (pageRaw != null && pageRaw !== "") {
    if (offsetRaw != null && offsetRaw !== "") {
      return null;
    }

    const parsedPage = parseInt(String(pageRaw), 10);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      return null;
    }

    offset = (parsedPage - 1) * limit;
  } else if (offsetRaw != null && offsetRaw !== "") {
    const parsedOffset = parseInt(String(offsetRaw), 10);
    if (!Number.isInteger(parsedOffset) || parsedOffset < 0) {
      return null;
    }
    offset = parsedOffset;
  }

  return {
    limit,
    offset,
    page: Math.floor(offset / limit) + 1,
  };
}

export async function listBlogs(req: Request, res: Response) {
  try {
    const pagination = parseBlogListPagination(req);
    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination. Use limit (1-${MAX_LIMIT}), offset (>= 0), or page (>= 1). Do not combine page with offset.`,
      });
    }

    const { limit, offset, page } = pagination;

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
        select: BLOG_LIST_SELECT,
        orderBy: [{ createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    res.json({
      success: true,
      data: rows.map(toPublicBlogListItem),
      meta: {
        total,
        limit,
        offset,
        page,
        totalPages,
        hasMore: offset + rows.length < total,
      },
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
      slugRaw != null ? decodeRouteParam(slugRaw).toLowerCase() : "";
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
