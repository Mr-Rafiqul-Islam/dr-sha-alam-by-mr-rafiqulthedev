/**
 * Admin blogs API (Prisma `Blog`). Routes use `requireAuth` + `requireContentManager`.
 *
 * Base: `/api/v1/admin/blogs` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/express-params.js";
import { parseCommaSeparatedField } from "../../../modules/blogs/parse-comma-separated.js";

export async function listBlogsForAdmin(req: Request, res: Response) {
  try {
    const rawPub = req.query.published;
    let publishedFilter: boolean | null = null;
    let publishedAll = false;

    if (rawPub == null || rawPub === "") {
      publishedAll = true;
    } else {
      const s = String(rawPub).trim().toUpperCase();
      if (s === "ALL") {
        publishedAll = true;
      } else if (s === "TRUE" || s === "1" || s === "YES") {
        publishedFilter = true;
      } else if (s === "FALSE" || s === "0" || s === "NO") {
        publishedFilter = false;
      } else {
        return res.status(400).json({
          success: false,
          message:
            'published must be "true", "false", "ALL", or omitted for all',
        });
      }
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
      if (t === "true" || t === "1" || t === "yes") {
        featuredFilter = true;
      } else if (t === "false" || t === "0" || t === "no") {
        featuredFilter = false;
      } else {
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

    const where: Prisma.BlogWhereInput = {};
    if (!publishedAll && publishedFilter !== null) {
      where.published = publishedFilter;
    }
    if (categoryFilter != null) {
      where.category = { has: categoryFilter };
    }
    if (!featuredAll && featuredFilter !== null) {
      where.isFeatured = featuredFilter;
    }

    const rows = await prisma.blog.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load blogs",
    });
  }
}

export async function getBlogByIdForAdmin(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    const row = await prisma.blog.findUnique({ where: { id } });
    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({ success: true, data: row });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to load blog",
    });
  }
}

export async function createBlog(req: Request, res: Response) {
  try {
    const body = req.body as Record<string, unknown>;

    const requiredStringFields: Array<[keyof typeof body, string]> = [
      ["title", "title"],
      ["shortDesc", "shortDesc"],
      ["content", "content"],
      ["slug", "slug"],
      ["image", "image"],
      ["imagePublicId", "imagePublicId"],
    ];

    const trimmed: Record<string, string> = {};
    for (const [key, label] of requiredStringFields) {
      const raw = body[key];
      if (raw === undefined || raw === null) {
        return res
          .status(400)
          .json({ success: false, message: `${label} is required` });
      }
      const s = String(raw).trim();
      if (!s.length) {
        return res
          .status(400)
          .json({ success: false, message: `${label} cannot be empty` });
      }
      trimmed[String(key)] = s;
    }

    const categoryParsed = parseCommaSeparatedField(body.category, "category");
    if (!categoryParsed.ok) {
      return res.status(400).json({ success: false, message: categoryParsed.message });
    }

    const authorParsed = parseCommaSeparatedField(body.author, "author");
    if (!authorParsed.ok) {
      return res.status(400).json({ success: false, message: authorParsed.message });
    }

    let published = false;
    const publishedRaw = body.published;
    if (
      publishedRaw !== undefined &&
      publishedRaw !== null &&
      publishedRaw !== ""
    ) {
      if (typeof publishedRaw === "boolean") {
        published = publishedRaw;
      } else if (typeof publishedRaw === "number") {
        if (publishedRaw === 1) published = true;
        else if (publishedRaw === 0) published = false;
        else {
          return res.status(400).json({
            success: false,
            message: "published must be a boolean (true/false when provided)",
          });
        }
      } else if (typeof publishedRaw === "string") {
        const t = publishedRaw.trim().toLowerCase();
        if (t === "true" || t === "1" || t === "yes") published = true;
        else if (t === "false" || t === "0" || t === "no") published = false;
        else {
          return res.status(400).json({
            success: false,
            message: "published must be a boolean (true/false when provided)",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "published must be a boolean (true/false when provided)",
        });
      }
    }

    let views = 0;
    if (body.views != null && body.views !== "") {
      const v = typeof body.views === "number" ? body.views : Number(body.views);
      if (!Number.isInteger(v) || v < 0) {
        return res
          .status(400)
          .json({ success: false, message: "views must be a non‑negative integer" });
      }
      views = v;
    }

    const createData: Prisma.BlogCreateInput = {
      title: trimmed.title,
      shortDesc: trimmed.shortDesc,
      content: trimmed.content,
      category: categoryParsed.values,
      author: authorParsed.values,
      slug: trimmed.slug.trim().toLowerCase(),
      image: trimmed.image,
      imagePublicId: trimmed.imagePublicId,
      isFeatured: false,
      published,
      views,
      comments: body.comments as string[],
    };

    if ("meta" in body) {
      if (body.meta === null) {
        createData.meta = Prisma.JsonNull;
      } else {
        createData.meta = body.meta as Prisma.InputJsonValue;
      }
    }

    if ("notes" in body) {
      if (body.notes === null) {
        createData.notes = Prisma.JsonNull;
      } else {
        createData.notes = body.notes as Prisma.InputJsonValue;
      }
    }

    const created = await prisma.blog.create({ data: createData });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "A blog with this slug already exists.",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    const body = req.body as Record<string, unknown>;
    const data: Prisma.BlogUpdateInput = {};

    const stringFields: Array<
      [
        keyof Pick<
          Prisma.BlogUncheckedUpdateInput,
          "title" | "shortDesc" | "content" | "image" | "imagePublicId"
        >,
        string,
      ]
    > = [
      ["title", "title"],
      ["shortDesc", "shortDesc"],
      ["content", "content"],
      ["image", "image"],
      ["imagePublicId", "imagePublicId"],
    ];

    for (const [field, label] of stringFields) {
      if (!(field in body)) continue;
      const raw = body[field];
      if (raw === undefined) continue;
      const v = raw === null ? "" : String(raw).trim();
      if (!v.length) {
        return res
          .status(400)
          .json({ success: false, message: `${label} cannot be empty` });
      }
      (data as Record<string, string>)[field] = v;
    }

    if ("category" in body) {
      const categoryParsed = parseCommaSeparatedField(body.category, "category");
      if (!categoryParsed.ok) {
        return res.status(400).json({ success: false, message: categoryParsed.message });
      }
      data.category = { set: categoryParsed.values };
    }

    if ("author" in body) {
      const authorParsed = parseCommaSeparatedField(body.author, "author");
      if (!authorParsed.ok) {
        return res.status(400).json({ success: false, message: authorParsed.message });
      }
      data.author = { set: authorParsed.values };
    }

    if ("slug" in body) {
      const raw = body.slug;
      if (raw !== undefined) {
        const v = raw === null ? "" : String(raw).trim();
        if (!v.length) {
          return res
            .status(400)
            .json({ success: false, message: "slug cannot be empty" });
        }
        data.slug = v.toLowerCase();
      }
    }

    if ("isFeatured" in body) {
      return res.status(400).json({
        success: false,
        message: "Use PATCH /:id/featured to change featured status",
      });
    }

    if ("published" in body) {
      const raw = body.published;
      let b: boolean | null = null;
      if (raw === undefined || raw === null || raw === "") b = null;
      else if (typeof raw === "boolean") b = raw;
      else if (typeof raw === "number") {
        if (raw === 1) b = true;
        else if (raw === 0) b = false;
      } else if (typeof raw === "string") {
        const t = raw.trim().toLowerCase();
        if (t === "true" || t === "1" || t === "yes") b = true;
        else if (t === "false" || t === "0" || t === "no") b = false;
      }
      if (b === null) {
        return res.status(400).json({
          success: false,
          message: "published must be a boolean (true/false when provided)",
        });
      }
      data.published = b;
    }

    if ("views" in body && body.views !== undefined) {
      if (body.views === "") {
        return res
          .status(400)
          .json({ success: false, message: "views cannot be empty" });
      }
      const n = typeof body.views === "number" ? body.views : Number(body.views);
      if (!Number.isInteger(n) || n < 0) {
        return res
          .status(400)
          .json({ success: false, message: "views must be a non‑negative integer" });
      }
      data.views = n;
    }

    if ("comments" in body) {
      data.comments = { set: body.comments as string[] };
    }

    if ("meta" in body) {
      if (body.meta === null) data.meta = Prisma.JsonNull;
      else data.meta = body.meta as Prisma.InputJsonValue;
    }

    if ("notes" in body) {
      if (body.notes === null) data.notes = Prisma.JsonNull;
      else data.notes = body.notes as Prisma.InputJsonValue;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updated = await prisma.blog.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }
      if (err.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "A blog with this slug already exists.",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    await prisma.blog.delete({ where: { id } });
    res.json({ success: true, message: "Blog deleted" });
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return res.status(404).json({
          success: false,
          message: "Blog not found",
        });
      }
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
}
