import type {
  Blog,
  BlogFilterState,
  BlogFormData,
  BlogMeta,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "../types/blog";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

export function computeBlogStats(blogs: Blog[]) {
  const published = blogs.filter((b) => b.published).length;
  const draft = blogs.filter((b) => !b.published).length;
  const featured = blogs.filter((b) => b.isFeatured).length;

  return {
    total: blogs.length,
    published,
    draft,
    featured,
  };
}

export function formatList(values: string[]): string {
  return values.join(", ");
}

export function filterBlogs(blogs: Blog[], filters: BlogFilterState): Blog[] {
  const searchQuery = filters.search.trim().toLowerCase();

  return blogs.filter((blog) => {
    if (searchQuery) {
      const matchesTitle = blog.title.toLowerCase().includes(searchQuery);
      const matchesShortDesc = blog.shortDesc.toLowerCase().includes(searchQuery);

      if (!matchesTitle && !matchesShortDesc) {
        return false;
      }
    }

    if (filters.author && !blog.author.includes(filters.author)) {
      return false;
    }

    if (filters.status === "published" && !blog.published) {
      return false;
    }

    if (filters.status === "draft" && blog.published) {
      return false;
    }

    return true;
  });
}

export function formatBlogDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function getBlogStatusLabel(blog: Blog): string {
  return blog.published ? "PUBLISHED" : "DRAFT";
}

export function getBlogLiveStatus(blog: Blog): {
  label: string;
  dotClass: string;
} {
  if (blog.published) {
    return { label: "Live", dotClass: "bg-primary-container" };
  }

  return { label: "Draft", dotClass: "bg-outline" };
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function collectUniqueValues(
  blogs: Blog[],
  key: "author",
): string[] {
  const values = new Set<string>();
  for (const blog of blogs) {
    for (const item of blog[key]) {
      if (item) values.add(item);
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function mergeOptions(
  defaults: readonly string[],
  fromData: string[],
): string[] {
  const merged = new Set([...defaults, ...fromData]);
  return Array.from(merged).sort((a, b) => a.localeCompare(b));
}

function parseMeta(meta: Blog["meta"]): BlogMeta {
  if (!meta || typeof meta !== "object") {
    return {};
  }

  return {
    title: typeof meta.title === "string" ? meta.title : "",
    keywords: typeof meta.keywords === "string" ? meta.keywords : "",
    description: typeof meta.description === "string" ? meta.description : "",
  };
}

function parseNotes(notes: Blog["notes"]): string {
  if (notes == null) {
    return "";
  }

  if (typeof notes === "string") {
    return notes;
  }

  return JSON.stringify(notes, null, 2);
}

export function blogToFormData(blog: Blog): BlogFormData {
  const meta = parseMeta(blog.meta);

  return {
    title: blog.title,
    shortDesc: blog.shortDesc,
    content: blog.content,
    category: blog.category.join(", "),
    author: blog.author.join(", "),
    published: blog.published,
    image: blog.image,
    imagePublicId: blog.imagePublicId,
    metaTitle: meta.title ?? "",
    metaKeywords: meta.keywords ?? "",
    metaDescription: meta.description ?? "",
    notes: parseNotes(blog.notes),
  };
}

export function toCreateBlogPayload(
  data: BlogFormData,
  published: boolean,
): CreateBlogPayload {
  const meta: BlogMeta = {
    title: data.metaTitle.trim() || undefined,
    keywords: data.metaKeywords.trim() || undefined,
    description: data.metaDescription.trim() || undefined,
  };

  const hasMeta = meta.title || meta.keywords || meta.description;

  return {
    title: data.title.trim(),
    shortDesc: data.shortDesc.trim(),
    content: data.content,
    category: data.category.trim(),
    author: data.author.trim(),
    image: data.image,
    imagePublicId: data.imagePublicId,
    published,
    meta: hasMeta ? meta : {},
    notes: data.notes.trim() || null,
  };
}

export function toUpdateBlogPayload(
  data: BlogFormData,
  published: boolean,
): UpdateBlogPayload {
  return toCreateBlogPayload(data, published);
}
