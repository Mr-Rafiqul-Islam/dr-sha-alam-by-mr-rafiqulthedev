import type { Blog } from "@prisma/client";

/** Public list/detail shape; omits `notes` (internal) and `published` (always true on client API). */
export function toPublicBlog(b: Blog) {
  return {
    id: b.id,
    title: b.title,
    shortDesc: b.shortDesc,
    content: b.content,
    category: b.category,
    author: b.author,
    views: b.views,
    comments: b.comments,
    isFeatured: b.isFeatured,
    slug: b.slug,
    meta: b.meta,
    image: b.image,
    imagePublicId: b.imagePublicId,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  };
}
