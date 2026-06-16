"use server";

import { getApiBaseUrl } from "@/lib/api";
import type {
  BlogsListMeta,
  GetAllBlogsParams,
  PublicBlog,
} from "@/types/blog";

type GetAllBlogsResponse = {
  success: boolean;
  data?: PublicBlog[];
  meta?: BlogsListMeta;
  message?: string;
};

export type GetAllBlogsResult = {
  blogs: PublicBlog[];
  meta: BlogsListMeta;
};

export async function getAllBlogs(
  params?: GetAllBlogsParams,
): Promise<GetAllBlogsResult> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const searchParams = new URLSearchParams();
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }
  if (params?.offset != null) {
    searchParams.set("offset", String(params.offset));
  }
  if (params?.category?.trim()) {
    searchParams.set("category", params.category.trim());
  }
  if (params?.featured != null) {
    searchParams.set("featured", params.featured ? "true" : "false");
  }

  const query = searchParams.toString();
  const url = `${apiBaseUrl}/api/v1/client/blogs${query ? `?${query}` : ""}`;

  const response = await fetch(url, { next: { revalidate: 60 } });
  const json = (await response.json()) as GetAllBlogsResponse;

  if (!response.ok || !json.success || !json.data || !json.meta) {
    throw new Error(json.message ?? "Failed to load blogs");
  }

  return { blogs: json.data, meta: json.meta };
}
