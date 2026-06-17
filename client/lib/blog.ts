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
