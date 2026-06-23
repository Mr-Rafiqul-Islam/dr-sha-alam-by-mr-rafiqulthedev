"use server";

import { getApiBaseUrl } from "@/lib/api";
import { normalizeBlogSlug } from "@/lib/blog";
import type { PublicBlog } from "@/types/blog";
type GetBlogDetailsBySlugResponse = {
  success: boolean;
  data?: PublicBlog;
  message?: string;
};

export type GetBlogDetailsBySlugResult = {
  blog: PublicBlog;
};

export async function getBlogDetailsBySlug(
  slug: string,
): Promise<GetBlogDetailsBySlugResult> {
  const normalizedSlug = normalizeBlogSlug(slug);
  if (!normalizedSlug) {
    throw new Error("slug is required");
  }

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const url = `${apiBaseUrl}/api/v1/client/blogs/${encodeURIComponent(normalizedSlug)}`;

  const response = await fetch(url, { next: { revalidate: 60 } });  const json = (await response.json()) as GetBlogDetailsBySlugResponse;

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Failed to load blog");
  }

  return { blog: json.data };
}
