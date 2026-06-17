"use server";

import { getApiBaseUrl } from "@/lib/api";
import type { BlogsListMeta, PublicBlog } from "@/types/blog";

type GetBlogDetailsBySlugResponse = {
  success: boolean;
  data?: PublicBlog[];
  meta?: BlogsListMeta;
  message?: string;
};

export type GetBlogDetailsBySlugResult = {
  blog: PublicBlog;
  meta: BlogsListMeta;
};

export async function getBlogDetailsBySlug(
  slug: string,
): Promise<GetBlogDetailsBySlugResult> {
  const normalizedSlug = slug.trim().toLowerCase();
  if (!normalizedSlug) {
    throw new Error("slug is required");
  }

  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const url = `${apiBaseUrl}/api/v1/client/blogs/${encodeURIComponent(normalizedSlug)}`;

  const response = await fetch(url, { next: { revalidate: 60 } });
  const json = (await response.json()) as GetBlogDetailsBySlugResponse;

  if (!response.ok || !json.success || !json.data?.length || !json.meta) {
    throw new Error(json.message ?? "Failed to load blog");
  }

  return { blog: json.data[0], meta: json.meta };
}
