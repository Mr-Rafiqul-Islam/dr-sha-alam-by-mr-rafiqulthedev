import { prisma } from "../../config/db.js";

export async function generateUniqueSlug(
  title: string,
  excludeBlogId?: string,
): Promise<string> {
  let baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) baseSlug = `article-${Date.now()}`;

  const existing = await prisma.blog.findFirst({
    where: {
      slug: baseSlug,
      ...(excludeBlogId ? { NOT: { id: excludeBlogId } } : {}),
    },
    select: { id: true },
  });

  if (!existing) return baseSlug;

  return `${baseSlug}-${Date.now()}`;
}
