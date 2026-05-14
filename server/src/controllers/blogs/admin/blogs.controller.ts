/**
 * Admin blogs API (Prisma `Blog`). Routes use `requireAuth` + `requireContentManager`.
 *
 * Base: `/api/v1/admin/blogs` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import { routeParamString } from "../../../utils/express-params.js";
import { parseStringArray } from "../../../utils/parsers.js";

export async function listBlogsForAdmin(req: Request, res: Response) {
  try {
    const pubWhere = parsePublishedListFilter(req.query.published);
    if (!pubWhere.ok) {
      return res.status(400).json({
        success: false,
        message:
          'published must be "true", "false", "ALL", or omitted for all',
      });
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

    const where: Prisma.BlogWhereInput = {};
    if (pubWhere.mode === "one") where.published = pubWhere.published;
    if (categoryWhere.category != null) where.category = categoryWhere.category;
    if (featuredWhere.mode === "one") where.isFeatured = featuredWhere.isFeatured;

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
    const parsed = parseCreateBlogFields(body);
    if (!parsed.ok) {
      return res.status(400).json({
        success: false,
        message: parsed.message,
      });
    }

    const createData: Prisma.BlogCreateInput = {
      title: parsed.data.title,
      shortDesc: parsed.data.shortDesc,
      content: parsed.data.content,
      category: parsed.data.category,
      author: parsed.data.author,
      slug: normalizeSlug(parsed.data.slug),
      image: parsed.data.image,
      imagePublicId: parsed.data.imagePublicId,
      isFeatured: parsed.data.isFeatured,
      published: parsed.data.published,
      views: parsed.data.views,
      comments: parsed.data.comments,
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
    const slice = buildBlogPatchData(body);

    if (slice.error) {
      return res.status(400).json({
        success: false,
        message: slice.error,
      });
    }

    if (Object.keys(slice.data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updated = await prisma.blog.update({
      where: { id },
      data: slice.data,
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

// --- Query parsing ------------------------------------------------------------

function parsePublishedListFilter(raw: unknown):
  | { ok: true; mode: "all" }
  | { ok: true; mode: "one"; published: boolean }
  | { ok: false } {
  if (raw == null || raw === "") {
    return { ok: true, mode: "all" };
  }
  const s = String(raw).trim().toUpperCase();
  if (s === "ALL") return { ok: true, mode: "all" };
  if (s === "TRUE" || s === "1" || s === "YES")
    return { ok: true, mode: "one", published: true };
  if (s === "FALSE" || s === "0" || s === "NO")
    return { ok: true, mode: "one", published: false };
  return { ok: false };
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
    if (t === "true" || t === "1" || t === "yes") {
      return { ok: true, mode: "one", isFeatured: true };
    }
    if (t === "false" || t === "0" || t === "no") {
      return { ok: true, mode: "one", isFeatured: false };
    }
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

// --- Create / patch body helpers ---------------------------------------------

type CreateBlogData = {
  title: string;
  shortDesc: string;
  content: string;
  category: string;
  author: string;
  slug: string;
  image: string;
  imagePublicId: string;
  isFeatured: boolean;
  published: boolean;
  views: number;
  comments: string[];
};

function parseCreateBlogFields(
  body: Record<string, unknown>,
): { ok: true; data: CreateBlogData } | { ok: false; message: string } {
  const title = parseRequiredTrimmed(body.title, "title");
  if (!title.ok) return { ok: false, message: title.message };
  const shortDesc = parseRequiredTrimmed(body.shortDesc, "shortDesc");
  if (!shortDesc.ok) return { ok: false, message: shortDesc.message };
  const content = parseRequiredTrimmed(body.content, "content");
  if (!content.ok) return { ok: false, message: content.message };
  const category = parseRequiredTrimmed(body.category, "category");
  if (!category.ok) return { ok: false, message: category.message };
  const author = parseRequiredTrimmed(body.author, "author");
  if (!author.ok) return { ok: false, message: author.message };
  const slugRaw = parseRequiredTrimmed(body.slug, "slug");
  if (!slugRaw.ok) return { ok: false, message: slugRaw.message };
  const image = parseRequiredTrimmed(body.image, "image");
  if (!image.ok) return { ok: false, message: image.message };
  const imagePublicId = parseRequiredTrimmed(
    body.imagePublicId,
    "imagePublicId",
  );
  if (!imagePublicId.ok) {
    return { ok: false, message: imagePublicId.message };
  }

  const fb = parseRequiredBoolean(body.isFeatured);
  if (fb === null)
    return { ok: false, message: "isFeatured must be a boolean (true/false)" };

  const published = parseOptionalBoolean(body.published) ?? false;
  let views = 0;
  if (body.views != null && body.views !== "") {
    const v = typeof body.views === "number" ? body.views : Number(body.views);
    if (!Number.isInteger(v) || v < 0) {
      return { ok: false, message: "views must be a non‑negative integer" };
    }
    views = v;
  }

  return {
    ok: true,
    data: {
      title: title.value,
      shortDesc: shortDesc.value,
      content: content.value,
      category: category.value,
      author: author.value,
      slug: slugRaw.value,
      image: image.value,
      imagePublicId: imagePublicId.value,
      isFeatured: fb,
      published,
      views,
      comments: parseStringArray(body.comments),
    },
  };
}

function buildBlogPatchData(
  body: Record<string, unknown>,
): { data: Prisma.BlogUpdateInput; error?: string } {
  const data: Prisma.BlogUpdateInput = {};

  const setStr = (
    field: keyof Pick<
      Prisma.BlogUncheckedUpdateInput,
      | "title"
      | "shortDesc"
      | "content"
      | "category"
      | "author"
      | "slug"
      | "image"
      | "imagePublicId"
    >,
    raw: unknown,
    label: string,
  ): string | undefined => {
    const v = trimPatchString(raw);
    if (v === undefined) return undefined;
    if (!v.length) return `${label} cannot be empty`;
    (data as Record<string, string>)[field] = v;
    return undefined;
  };

  if ("title" in body) {
    const e = setStr("title", body.title, "title");
    if (e) return { data, error: e };
  }
  if ("shortDesc" in body) {
    const e = setStr("shortDesc", body.shortDesc, "shortDesc");
    if (e) return { data, error: e };
  }
  if ("content" in body) {
    const e = setStr("content", body.content, "content");
    if (e) return { data, error: e };
  }
  if ("category" in body) {
    const e = setStr("category", body.category, "category");
    if (e) return { data, error: e };
  }
  if ("author" in body) {
    const e = setStr("author", body.author, "author");
    if (e) return { data, error: e };
  }
  if ("slug" in body) {
    const v = trimPatchString(body.slug);
    if (v === undefined) {
      /** key present but unusable payload — ignored */
    } else if (!v.length) return { data, error: "slug cannot be empty" };
    else data.slug = normalizeSlug(v);
  }
  if ("image" in body) {
    const e = setStr("image", body.image, "image");
    if (e) return { data, error: e };
  }
  if ("imagePublicId" in body) {
    const e = setStr(
      "imagePublicId",
      body.imagePublicId,
      "imagePublicId",
    );
    if (e) return { data, error: e };
  }

  if ("isFeatured" in body && body.isFeatured !== undefined) {
    const b = parseRequiredBoolean(body.isFeatured);
    if (b === null)
      return { data, error: "isFeatured must be a boolean (true/false)" };
    data.isFeatured = b;
  }

  if ("published" in body) {
    const b = parseRequiredBoolean(body.published);
    if (b === null) {
      return {
        data,
        error: "published must be a boolean (true/false when provided)",
      };
    }
    data.published = b;
  }

  if ("views" in body && body.views !== undefined) {
    if (body.views === "") return { data, error: "views cannot be empty" };
    const n = typeof body.views === "number" ? body.views : Number(body.views);
    if (!Number.isInteger(n) || n < 0) {
      return { data, error: "views must be a non‑negative integer" };
    }
    data.views = n;
  }

  if ("comments" in body) {
    data.comments = { set: parseStringArray(body.comments) };
  }

  if ("meta" in body) {
    if (body.meta === null) data.meta = Prisma.JsonNull;
    else data.meta = body.meta as Prisma.InputJsonValue;
  }

  if ("notes" in body) {
    if (body.notes === null) data.notes = Prisma.JsonNull;
    else data.notes = body.notes as Prisma.InputJsonValue;
  }

  return { data };
}

function parseRequiredTrimmed(
  raw: unknown,
  label: string,
): { ok: true; value: string } | { ok: false; message: string } {
  if (raw === undefined || raw === null) {
    return { ok: false, message: `${label} is required` };
  }
  const s = String(raw).trim();
  if (!s.length) {
    return { ok: false, message: `${label} cannot be empty` };
  }
  return { ok: true, value: s };
}

/**
 * PATCH string fields when the key exists: preserve `false`/`0` by stringifying.
 * Missing key → caller should skip; explicit `null`/empty trimmed string → caller reports error.
 */
function trimPatchString(raw: unknown): string | undefined {
  if (raw === undefined) return undefined;
  if (raw === null) return "";
  return String(raw).trim();
}

function parseRequiredBoolean(raw: unknown): boolean | null {
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw === "boolean") return raw;
  if (typeof raw === "number") {
    if (raw === 1) return true;
    if (raw === 0) return false;
    return null;
  }
  if (typeof raw === "string") {
    const t = raw.trim().toLowerCase();
    if (t === "true" || t === "1" || t === "yes") return true;
    if (t === "false" || t === "0" || t === "no") return false;
  }
  return null;
}

/** Like {@link parseRequiredBoolean} but returns `undefined` when missing (optional field). */
function parseOptionalBoolean(raw: unknown): boolean | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined;
  return parseRequiredBoolean(raw) ?? undefined;
}

function normalizeSlug(s: string): string {
  return s.trim().toLowerCase();
}
