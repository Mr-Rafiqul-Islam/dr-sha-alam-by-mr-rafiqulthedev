import type { Response } from "express";
import { prisma } from "../../config/db.js";

export const SlugGenerationErrorCode = {
  EMPTY_TITLE: "EMPTY_TITLE",
  EXHAUSTED: "EXHAUSTED",
} as const;

export type SlugGenerationErrorCode =
  (typeof SlugGenerationErrorCode)[keyof typeof SlugGenerationErrorCode];

export class SlugGenerationError extends Error {
  readonly statusCode: number;
  readonly code: SlugGenerationErrorCode;

  constructor(
    message: string,
    statusCode = 400,
    code: SlugGenerationErrorCode,
  ) {
    super(message);
    this.name = "SlugGenerationError";
    this.statusCode = statusCode;
    this.code = code;
  }

  static emptyTitle(): SlugGenerationError {
    return new SlugGenerationError(
      "Title must contain at least one letter or number",
      400,
      SlugGenerationErrorCode.EMPTY_TITLE,
    );
  }

  static exhausted(): SlugGenerationError {
    return new SlugGenerationError(
      "Unable to generate a unique slug for this title",
      409,
      SlugGenerationErrorCode.EXHAUSTED,
    );
  }
}

export function handleSlugGenerationError(
  res: Response,
  error: unknown,
): error is SlugGenerationError {
  if (!(error instanceof SlugGenerationError)) {
    return false;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    code: error.code,
  });
  return true;
}

async function slugExists(
  slug: string,
  excludeBlogId?: string,
): Promise<boolean> {
  const existing = await prisma.blog.findFirst({
    where: {
      slug,
      ...(excludeBlogId ? { NOT: { id: excludeBlogId } } : {}),
    },
    select: { id: true },
  });
  return existing != null;
}

function buildBaseSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(
  title: string,
  excludeBlogId?: string,
): Promise<string> {
  const baseSlug = buildBaseSlug(title);

  if (!baseSlug) {
    throw SlugGenerationError.emptyTitle();
  }

  if (!(await slugExists(baseSlug, excludeBlogId))) {
    return baseSlug;
  }

  let counter = 2;
  while (counter < 1000) {
    const candidate = `${baseSlug}-${counter}`;
    if (!(await slugExists(candidate, excludeBlogId))) {
      return candidate;
    }
    counter++;
  }

  throw SlugGenerationError.exhausted();
}
