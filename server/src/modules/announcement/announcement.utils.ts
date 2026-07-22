import {
  AnnouncementStatus,
  AnnouncementType,
  Prisma,
} from "@prisma/client";
import type { Response } from "express";

const ANNOUNCEMENT_TYPES = new Set<string>(Object.values(AnnouncementType));
const ANNOUNCEMENT_STATUSES = new Set<string>(
  Object.values(AnnouncementStatus),
);

export class AnnouncementValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "AnnouncementValidationError";
  }
}

export function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parseRequiredString(value: unknown, fieldName: string): string {
  const text = parseOptionalString(value);
  if (!text) {
    throw new AnnouncementValidationError(`${fieldName} is required`);
  }
  return text;
}

export function parseAnnouncementType(value: unknown): AnnouncementType {
  if (typeof value !== "string" || !ANNOUNCEMENT_TYPES.has(value)) {
    throw new AnnouncementValidationError("Invalid announcement type");
  }
  return value as AnnouncementType;
}

export function parseOptionalAnnouncementType(
  value: unknown,
): AnnouncementType | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return parseAnnouncementType(value);
}

export function parseAnnouncementStatus(value: unknown): AnnouncementStatus {
  if (typeof value !== "string" || !ANNOUNCEMENT_STATUSES.has(value)) {
    throw new AnnouncementValidationError("Invalid announcement status");
  }
  return value as AnnouncementStatus;
}

export function parseOptionalAnnouncementStatus(
  value: unknown,
): AnnouncementStatus | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return parseAnnouncementStatus(value);
}

export function parsePositiveInt(
  value: unknown,
  fallback: number,
  max: number,
): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(Math.floor(parsed), max);
}

export function isAnnouncementVisible(announcement: {
  status: AnnouncementStatus;
}): boolean {
  return announcement.status === AnnouncementStatus.ACTIVE;
}

export function buildVisibleAnnouncementWhere(): Prisma.AnnouncementWhereInput {
  return {
    status: AnnouncementStatus.ACTIVE,
  };
}

export type AnnouncementWithReadStatus = {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
  readAt: Date | null;
  createdBy?: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export function serializeAnnouncement(
  announcement: AnnouncementWithReadStatus,
) {
  return {
    id: announcement.id,
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    status: announcement.status,
    createdById: announcement.createdById,
    createdAt: announcement.createdAt.toISOString(),
    updatedAt: announcement.updatedAt.toISOString(),
    isRead: announcement.isRead,
    readAt: announcement.readAt?.toISOString() ?? null,
    createdBy: announcement.createdBy
      ? {
          id: announcement.createdBy.id,
          name: announcement.createdBy.name,
          email: announcement.createdBy.email,
        }
      : null,
  };
}

export function handleAnnouncementError(
  res: Response,
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof AnnouncementValidationError) {
    return res
      .status(error.statusCode)
      .json({ success: false, message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }
  }

  console.error(error);
  return res.status(500).json({ success: false, message: fallbackMessage });
}

export type CreateAnnouncementInput = {
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
};

export function parseCreateAnnouncementBody(body: unknown): CreateAnnouncementInput {
  if (!body || typeof body !== "object") {
    throw new AnnouncementValidationError("Invalid request body");
  }

  const payload = body as Record<string, unknown>;
  const title = parseRequiredString(payload.title, "Title");
  const content = parseRequiredString(payload.content, "Content");
  const type =
    payload.type !== undefined
      ? parseAnnouncementType(payload.type)
      : AnnouncementType.INFO;
  const status =
    payload.status !== undefined
      ? parseAnnouncementStatus(payload.status)
      : AnnouncementStatus.ACTIVE;

  return { title, content, type, status };
}

export function parseUpdateAnnouncementBody(
  body: unknown,
): Partial<CreateAnnouncementInput> {
  if (!body || typeof body !== "object") {
    throw new AnnouncementValidationError("Invalid request body");
  }

  const payload = body as Record<string, unknown>;
  const result: Partial<CreateAnnouncementInput> = {};

  if (payload.title !== undefined) {
    result.title = parseRequiredString(payload.title, "Title");
  }
  if (payload.content !== undefined) {
    result.content = parseRequiredString(payload.content, "Content");
  }
  if (payload.type !== undefined) {
    result.type = parseAnnouncementType(payload.type);
  }
  if (payload.status !== undefined) {
    result.status = parseAnnouncementStatus(payload.status);
  }

  return result;
}
