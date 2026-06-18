import { Suspense } from 'react';
import BlogHero from '@/components/blog/BlogHero';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedArticle from '@/components/blog/FeaturedArticle';
import LatestArticles from '@/components/blog/LatestArticles';
import AuthorBio from '@/components/blog/AuthorBio';
import BlogCallToAction from '@/components/blog/BlogCallToAction';
import { extractBlogCategories, filterBlogs } from '@/lib/blog';
import { getAllBlogs } from '@/server-actions/getAllBlogs';

type BlogPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
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

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { q, category } = await searchParams;

  let allBlogs: Awaited<ReturnType<typeof getAllBlogs>>['blogs'] = [];

  try {
    ({ blogs: allBlogs } = await getAllBlogs());
  } catch {
    allBlogs = [];
  }

  const categories = extractBlogCategories(allBlogs);
  const filteredBlogs = filterBlogs(allBlogs, { q, category });

  const hasFilters = Boolean(q?.trim() || category?.trim());
  const featuredBlog = hasFilters
    ? null
    : (allBlogs.find((blog) => blog.isFeatured) ?? null);

  const latestBlogs = featuredBlog
    ? filteredBlogs.filter((blog) => blog.id !== featuredBlog.id)
    : filteredBlogs;

  return (
    <main className="flex-grow">
      <BlogHero />
      <Suspense fallback={<BlogFiltersFallback />}>
        <BlogSearch />
        <BlogCategories categories={categories} />
      </Suspense>
      <FeaturedArticle blog={featuredBlog} />
      <LatestArticles blogs={latestBlogs} hasFilters={hasFilters} />
      <AuthorBio />
      <BlogCallToAction />
    </main>
  );
}
