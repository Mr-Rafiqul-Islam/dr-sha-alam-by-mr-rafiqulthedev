/**
 * Admin announcements API.
 *
 * Base: `/api/v1/admin/announcements` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { prisma } from "../../../config/db.js";
import { FULL_ACCESS_ROLES } from "../../../modules/adminAuth/adminPermissions.js";
import {
  AnnouncementValidationError,
  buildVisibleAnnouncementWhere,
  handleAnnouncementError,
  parseCreateAnnouncementBody,
  parseOptionalAnnouncementStatus,
  parseOptionalAnnouncementType,
  parsePositiveInt,
  parseUpdateAnnouncementBody,
  serializeAnnouncement,
  type AnnouncementWithReadStatus,
} from "../../../modules/announcement/announcement.utils.js";
import { routeParamString } from "../../../utils/express-params.js";

function requireAdmin(req: Request, res: Response) {
  const admin = req.admin;
  if (!admin) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return null;
  }
  return admin;
}

function requireFullAccess(req: Request, res: Response) {
  const admin = requireAdmin(req, res);
  if (!admin) {
    return null;
  }
  if (!FULL_ACCESS_ROLES.has(admin.role)) {
    res.status(403).json({
      success: false,
      message: "You do not have permission to manage announcements.",
    });
    return null;
  }
  return admin;
}

async function attachReadStatus(
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    type: AnnouncementWithReadStatus["type"];
    status: AnnouncementWithReadStatus["status"];
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: AnnouncementWithReadStatus["createdBy"];
  }>,
  userId: string,
): Promise<AnnouncementWithReadStatus[]> {
  if (announcements.length === 0) {
    return [];
  }

  const readRows = await prisma.userAnnouncement.findMany({
    where: {
      userId,
      announcementId: { in: announcements.map((item) => item.id) },
    },
    select: {
      announcementId: true,
      isRead: true,
      readAt: true,
    },
  });

  const readByAnnouncementId = new Map(
    readRows.map((row) => [row.announcementId, row]),
  );

  return announcements.map((announcement) => {
    const readRow = readByAnnouncementId.get(announcement.id);
    return {
      ...announcement,
      isRead: readRow?.isRead ?? false,
      readAt: readRow?.readAt ?? null,
    };
  });
}

export async function listAnnouncements(req: Request, res: Response) {
  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const page = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.pageSize, 10, 50);
    const status = parseOptionalAnnouncementStatus(req.query.status);
    const type = parseOptionalAnnouncementType(req.query.type);

    const where = {
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    };

    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const withReadStatus = await attachReadStatus(items, admin.id);

    return res.status(200).json({
      success: true,
      data: withReadStatus.map(serializeAnnouncement),
      meta: { total, page, pageSize },
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to fetch announcements",
    );
  }
}

export async function listActiveAnnouncements(req: Request, res: Response) {
  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const items = await prisma.announcement.findMany({
      where: buildVisibleAnnouncementWhere(),
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const withReadStatus = await attachReadStatus(items, admin.id);

    return res.status(200).json({
      success: true,
      data: withReadStatus.map(serializeAnnouncement),
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to fetch active announcements",
    );
  }
}

export async function listAnnouncementFeed(req: Request, res: Response) {
  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const page = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.pageSize, 4, 10);
    const where = buildVisibleAnnouncementWhere();

    const [total, items] = await Promise.all([
      prisma.announcement.count({ where }),
      prisma.announcement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const withReadStatus = await attachReadStatus(items, admin.id);

    return res.status(200).json({
      success: true,
      data: withReadStatus.map(serializeAnnouncement),
      meta: { total, page, pageSize },
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to fetch announcement feed",
    );
  }
}

export async function getUnreadAnnouncementCount(req: Request, res: Response) {
  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const visible = await prisma.announcement.findMany({
      where: buildVisibleAnnouncementWhere(),
      select: { id: true },
    });

    if (visible.length === 0) {
      return res.status(200).json({ success: true, data: { count: 0 } });
    }

    const visibleIds = visible.map((item) => item.id);
    const readCount = await prisma.userAnnouncement.count({
      where: {
        userId: admin.id,
        announcementId: { in: visibleIds },
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: { count: Math.max(visibleIds.length - readCount, 0) },
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to fetch unread announcement count",
    );
  }
}

export async function getAnnouncementById(req: Request, res: Response) {
  const announcementId = routeParamString(req.params.id);
  if (!announcementId) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid announcement id" });
  }

  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    const [withReadStatus] = await attachReadStatus([announcement], admin.id);

    return res.status(200).json({
      success: true,
      data: serializeAnnouncement(withReadStatus),
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to fetch announcement",
    );
  }
}

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const admin = requireFullAccess(req, res);
    if (!admin) return;

    const input = parseCreateAnnouncementBody(req.body);

    const announcement = await prisma.announcement.create({
      data: {
        ...input,
        createdById: admin.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const [withReadStatus] = await attachReadStatus([announcement], admin.id);

    return res.status(201).json({
      success: true,
      data: serializeAnnouncement(withReadStatus),
      message: "Announcement created successfully",
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to create announcement",
    );
  }
}

export async function updateAnnouncement(req: Request, res: Response) {
  const announcementId = routeParamString(req.params.id);
  if (!announcementId) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid announcement id" });
  }

  try {
    const admin = requireFullAccess(req, res);
    if (!admin) return;

    const input = parseUpdateAnnouncementBody(req.body);
    if (Object.keys(input).length === 0) {
      throw new AnnouncementValidationError("No fields to update");
    }

    const existing = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: input,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const [withReadStatus] = await attachReadStatus([announcement], admin.id);

    return res.status(200).json({
      success: true,
      data: serializeAnnouncement(withReadStatus),
      message: "Announcement updated successfully",
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to update announcement",
    );
  }
}

export async function deleteAnnouncement(req: Request, res: Response) {
  const announcementId = routeParamString(req.params.id);
  if (!announcementId) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid announcement id" });
  }

  try {
    const admin = requireFullAccess(req, res);
    if (!admin) return;

    await prisma.announcement.delete({ where: { id: announcementId } });

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to delete announcement",
    );
  }
}

export async function markAnnouncementRead(req: Request, res: Response) {
  const announcementId = routeParamString(req.params.id);
  if (!announcementId) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid announcement id" });
  }

  try {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
    });
    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    const now = new Date();
    await prisma.userAnnouncement.upsert({
      where: {
        userId_announcementId: {
          userId: admin.id,
          announcementId,
        },
      },
      create: {
        userId: admin.id,
        announcementId,
        isRead: true,
        readAt: now,
      },
      update: {
        isRead: true,
        readAt: now,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Announcement marked as read",
    });
  } catch (error) {
    return handleAnnouncementError(
      res,
      error,
      "Failed to mark announcement as read",
    );
  }
}
