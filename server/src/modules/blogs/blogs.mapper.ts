import type { Blog, Prisma } from "@prisma/client";

export const BLOG_LIST_SELECT = {
  id: true,
  title: true,
  shortDesc: true,
  category: true,
  author: true,
  views: true,
  comments: true,
  isFeatured: true,
  slug: true,
  meta: true,
  image: true,
  imagePublicId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BlogSelect;

export type PublicBlogListItem = {
  id: string;
  title: string;
  shortDesc: string;
  category: string[];
  author: string[];
  views: number;
  comments: string[];
  isFeatured: boolean;
  slug: string;
  meta: Blog["meta"];
  image: string;
  imagePublicId: string;
  createdAt: Date;
  updatedAt: Date;
};

/** Public list shape; omits `content`, `notes`, and `published`. */
export function toPublicBlogListItem(
  b: Prisma.BlogGetPayload<{ select: typeof BLOG_LIST_SELECT }>,
): PublicBlogListItem {
  return {
    id: b.id,
    title: b.title,
    shortDesc: b.shortDesc,
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

/** Public detail shape; omits `notes` (internal) and `published` (always true on client API). */
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
