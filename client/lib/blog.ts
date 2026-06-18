import type { PublicBlog } from "@/types/blog";

export function buildBlogFilterUrl(
  q?: string | null,
  category?: string | null,
): string {
  const params = new URLSearchParams();

  const trimmedCategory = category?.trim();
  if (trimmedCategory) {
    params.set("category", trimmedCategory);
  }

  const trimmedQuery = q?.trim();
  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }

  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function extractBlogCategories(blogs: PublicBlog[]): string[] {
  const categorySet = new Set<string>();

  for (const blog of blogs) {
    for (const category of blog.category) {
      const trimmed = category.trim();
      if (trimmed) {
        categorySet.add(trimmed);
      }
    }
  }

  return Array.from(categorySet).sort((a, b) => a.localeCompare(b));
}

type FilterBlogsOptions = {
  q?: string;
  category?: string;
};

export function filterBlogs(
  blogs: PublicBlog[],
  { q, category }: FilterBlogsOptions,
): PublicBlog[] {
  let result = blogs;

  const selectedCategory = category?.trim();
  if (selectedCategory) {
    result = result.filter((blog) => blog.category.includes(selectedCategory));
  }

  const query = q?.trim().toLowerCase();
  if (query) {
    result = result.filter((blog) => {
      const searchableText = [
        blog.title,
        blog.shortDesc,
        blog.content,
        ...blog.category,
        ...blog.author,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }

  return result;
}

export type BlogTocItem = {
  id: string;
  title: string;
};

export function slugifyHeading(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function createUniqueId(baseId: string, usedIds: Set<string>): string {
  let id = baseId || "section";
  let suffix = 2;

  while (usedIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(id);
  return id;
}

export function processBlogContent(html: string): {
  html: string;
  toc: BlogTocItem[];
} {
  const toc: BlogTocItem[] = [];
  const usedIds = new Set<string>();

  const processedHtml = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (match, attributes = "", innerHtml: string) => {
      const title = stripHtml(innerHtml);
      if (!title) {
        return match;
      }

      const baseId = slugifyHeading(title);
      const id = createUniqueId(baseId, usedIds);
      toc.push({ id, title });

      if (/\sid\s*=/i.test(attributes)) {
        return `<h2${attributes.replace(
          /\sid\s*=\s*["'][^"']*["']/i,
          ` id="${id}"`,
        )} style="scroll-margin-top: 7rem">${innerHtml}</h2>`;
      }

      return `<h2 id="${id}" style="scroll-margin-top: 7rem"${attributes}>${innerHtml}</h2>`;
    },
  );

  return { html: processedHtml, toc };
}

export function estimateReadTime(html: string): string {
  const text = stripHtml(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}

export function getRelatedBlogs(
  allBlogs: PublicBlog[],
  current: PublicBlog,
  limit = 3,
): PublicBlog[] {
  return allBlogs
    .filter(
      (blog) =>
        blog.id !== current.id &&
        blog.category.some((category) => current.category.includes(category)),
    )
    .slice(0, limit);
}
