import { Suspense } from "react";
import { redirect } from "next/navigation";
import BlogHero from "@/components/blog/BlogHero";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogCategories from "@/components/blog/BlogCategories";
import FeaturedArticle from "@/components/blog/FeaturedArticle";
import LatestArticles from "@/components/blog/LatestArticles";
import BlogPagination from "@/components/blog/BlogPagination";
import AuthorBio from "@/components/blog/AuthorBio";
import BlogCallToAction from "@/components/blog/BlogCallToAction";
import {
  buildBlogFilterUrl,
  extractBlogCategories,
  filterBlogs,
} from "@/lib/blog";
import { getAllBlogs } from "@/server-actions/getAllBlogs";
import type { BlogsListMeta, PublicBlog } from "@/types/blog";

const BLOG_PAGE_SIZE = 9;

type BlogPageProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

function BlogFiltersFallback() {
  return (
    <div className="bg-background-light dark:bg-background-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 -mt-8">
        <div className="h-16 rounded-full bg-white dark:bg-surface-dark shadow-sm" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-8">
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          <div className="h-10 w-28 rounded-full bg-white dark:bg-surface-dark" />
          <div className="h-10 w-24 rounded-full bg-white dark:bg-surface-dark" />
          <div className="h-10 w-32 rounded-full bg-white dark:bg-surface-dark" />
        </div>
      </div>
    </div>
  );
}

function parsePage(raw?: string): number {
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

const EMPTY_META: BlogsListMeta = {
  total: 0,
  limit: BLOG_PAGE_SIZE,
  offset: 0,
  page: 1,
  totalPages: 1,
  hasMore: false,
};

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  if (result.status === "fulfilled") {
    return result.value;
  }
  console.error("Blog page fetch failed:", result.reason);
  return null;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, category, page: pageParam } = await searchParams;
  const hasSearch = Boolean(q?.trim());
  const hasCategory = Boolean(category?.trim());
  const trimmedCategory = category?.trim() || undefined;
  let page = parsePage(pageParam);

  let categories: string[] = [];
  let featuredBlog: PublicBlog | null = null;
  let latestBlogs: PublicBlog[] = [];
  let meta: BlogsListMeta = EMPTY_META;
  let showPagination = false;

  if (hasSearch) {
    const [categoriesSettled, listSettled] = await Promise.allSettled([
      getAllBlogs({ limit: 100 }),
      getAllBlogs({
        limit: 100,
        category: trimmedCategory,
      }),
    ]);

    const categoriesResult = settledValue(categoriesSettled);
    const listResult = settledValue(listSettled);

    if (categoriesResult) {
      categories = extractBlogCategories(categoriesResult.blogs);
    } else if (listResult) {
      categories = extractBlogCategories(listResult.blogs);
    }

    if (listResult) {
      latestBlogs = filterBlogs(listResult.blogs, { q, category });
      meta = {
        ...listResult.meta,
        total: latestBlogs.length,
        page: 1,
        totalPages: 1,
        hasMore: false,
      };
    }
  } else {
    const showFeatured = page === 1 && !hasCategory;

    const [categoriesSettled, listSettled, featuredSettled] =
      await Promise.allSettled([
        getAllBlogs({ limit: 100 }),
        getAllBlogs({
          limit: BLOG_PAGE_SIZE,
          page,
          category: trimmedCategory,
        }),
        showFeatured
          ? getAllBlogs({ featured: true, limit: 1 })
          : Promise.resolve(null),
      ]);

    const categoriesResult = settledValue(categoriesSettled);
    const listResult = settledValue(listSettled);
    const featuredResult = settledValue(featuredSettled);

    if (categoriesResult) {
      categories = extractBlogCategories(categoriesResult.blogs);
    } else if (listResult) {
      categories = extractBlogCategories(listResult.blogs);
    }

    if (listResult) {
      meta = listResult.meta;
      const totalPages = Math.max(1, meta.totalPages ?? 1);

      if (page > totalPages && totalPages >= 1) {
        redirect(buildBlogFilterUrl(q, category, totalPages));
      }

      featuredBlog = showFeatured
        ? (featuredResult?.blogs[0] ?? null)
        : null;
      const featuredId = featuredBlog?.id;

      latestBlogs = featuredId
        ? listResult.blogs.filter((blog) => blog.id !== featuredId)
        : listResult.blogs;

      showPagination = totalPages > 1;
      page = meta.page ?? page;
    }
  }

  const hasFilters = hasSearch || hasCategory;

  return (
    <main className="flex-grow">
      <BlogHero />
      <Suspense fallback={<BlogFiltersFallback />}>
        <BlogSearch />
        <BlogCategories categories={categories} />
      </Suspense>
      <FeaturedArticle blog={featuredBlog} />
      <LatestArticles blogs={latestBlogs} hasFilters={hasFilters} />
      {showPagination && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-4 lg:-mt-8">
          <BlogPagination
            currentPage={meta.page ?? page}
            totalPages={meta.totalPages ?? 1}
            q={q}
            category={category}
          />
        </div>
      )}
      <AuthorBio />
      <BlogCallToAction />
    </main>
  );
}
