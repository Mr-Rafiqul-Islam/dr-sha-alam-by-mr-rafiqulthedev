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

function normalizeMeta(meta: BlogsListMeta): BlogsListMeta {
  const limit = meta.limit > 0 ? meta.limit : 1;
  const offset = meta.offset ?? 0;
  const page = meta.page ?? Math.floor(offset / limit) + 1;
  const totalPages =
    meta.totalPages ?? Math.max(1, Math.ceil(meta.total / limit));
  const hasMore = meta.hasMore ?? offset + meta.limit < meta.total;

  return {
    ...meta,
    offset,
    page,
    totalPages,
    hasMore,
  };
}

export async function getAllBlogs(
  params?: GetAllBlogsParams,
): Promise<GetAllBlogsResult> {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) {
    throw new Error("API URL is not configured");
  }

  const limit = params?.limit;
  const page = params?.page;
  const offset = params?.offset;
  const category = params?.category?.trim();
  const featured = params?.featured;

  const searchParams = new URLSearchParams();

  if (limit != null) {
    searchParams.set("limit", String(limit));
  }

  // API rejects combining page with offset — prefer page when both are present.
  if (page != null) {
    searchParams.set("page", String(page));
  } else if (offset != null) {
    searchParams.set("offset", String(offset));
  }

  if (category) {
    searchParams.set("category", category);
  }
  if (featured != null) {
    searchParams.set("featured", featured ? "true" : "false");
  }

  const query = searchParams.toString();
  const url = `${apiBaseUrl}/api/v1/client/blogs${query ? `?${query}` : ""}`;

  const response = await fetch(url, { next: { revalidate: 60 } });
  const json = (await response.json()) as GetAllBlogsResponse;

  if (!response.ok || !json.success || !Array.isArray(json.data) || !json.meta) {
    throw new Error(json.message ?? "Failed to load blogs");
  }

  return { blogs: json.data, meta: normalizeMeta(json.meta) };
}
