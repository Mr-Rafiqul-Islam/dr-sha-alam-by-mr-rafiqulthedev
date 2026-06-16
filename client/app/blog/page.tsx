import BlogHero from '@/components/blog/BlogHero';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedArticle from '@/components/blog/FeaturedArticle';
import LatestArticles from '@/components/blog/LatestArticles';
import AuthorBio from '@/components/blog/AuthorBio';
import BlogCallToAction from '@/components/blog/BlogCallToAction';
import { getAllBlogs } from '@/server-actions/getAllBlogs';
import type { PublicBlog } from '@/types/blog';

export default async function BlogPage() {
  let blogs: PublicBlog[] = [];

  try {
    ({ blogs } = await getAllBlogs());
  } catch {
    blogs = [];
  }

  const featuredBlog = blogs.find((b) => b.isFeatured) ?? null;
  const latestBlogs = featuredBlog
    ? blogs.filter((b) => b.id !== featuredBlog.id)
    : blogs;

  return (
    <main className="flex-grow">
      <BlogHero />
      <BlogSearch />
      <BlogCategories />
      <FeaturedArticle blog={featuredBlog} />
      <LatestArticles blogs={latestBlogs} />
      <AuthorBio />
      <BlogCallToAction />
    </main>
  );
}
