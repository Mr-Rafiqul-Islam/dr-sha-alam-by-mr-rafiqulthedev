/**
 * Admin blog featured status API.
 *
 * Base: `PATCH /api/v1/admin/blogs/:id/featured`
 */
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/db.js";
import {
  ActivityAction,
  ActivityEntityType,
} from "../../../modules/activity/activity.service.js";
import { recordActivity } from "../../../modules/activity/activity.middleware.js";
import { routeParamString } from "../../../utils/express-params.js";

function parseBooleanField(
  raw: unknown,
  label: string,
): { ok: true; value: boolean } | { ok: false; message: string } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: false, message: `${label} is required` };
  }
  if (typeof raw === "boolean") {
    return { ok: true, value: raw };
  }
  if (typeof raw === "number") {
    if (raw === 1) return { ok: true, value: true };
    if (raw === 0) return { ok: true, value: false };
    return { ok: false, message: `${label} must be a boolean (true/false)` };
  }
  if (typeof raw === "string") {
    const t = raw.trim().toLowerCase();
    if (t === "true" || t === "1" || t === "yes") return { ok: true, value: true };
    if (t === "false" || t === "0" || t === "no") return { ok: true, value: false };
  }
  return { ok: false, message: `${label} must be a boolean (true/false)` };
}

export async function setBlogFeatured(req: Request, res: Response) {
  try {
    const id = routeParamString(req.params.id);
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Blog id is required",
      });
    }

    const body = req.body as Record<string, unknown>;
    const parsed = parseBooleanField(body.isFeatured, "isFeatured");
    if (!parsed.ok) {
      return res.status(400).json({ success: false, message: parsed.message });
    }

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const updated =
      parsed.value === true
        ? await prisma.$transaction(async (tx) => {
            await tx.blog.updateMany({
              where: { isFeatured: true, id: { not: id } },
              data: { isFeatured: false },
            });
            return tx.blog.update({
              where: { id },
              data: { isFeatured: true },
            });
          })
        : await prisma.blog.update({
            where: { id },
            data: { isFeatured: false },
          });

    recordActivity(res, {
      action: ActivityAction.BLOG_FEATURED_CHANGED,
      entityType: ActivityEntityType.Blog,
      entityId: updated.id,
      metadata: {
        title: updated.title,
        featured: updated.isFeatured,
      },
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
    }
    res.status(500).json({
      success: false,
      message: "Failed to update featured status",
    });
  }
}
