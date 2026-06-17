import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailsHero from '@/components/blog/BlogDetailsHero';
import BlogContent from '@/components/blog/BlogContent';
import BlogSidebar from '@/components/blog/BlogSidebar';
import BlogDetailsCallToAction from '@/components/blog/BlogDetailsCallToAction';
import {
  estimateReadTime,
  getRelatedBlogs,
  processBlogContent,
} from '@/lib/blog';
import { formatBlogDate, getPrimaryCategory } from '@/lib/utils';
import { getAllBlogs } from '@/server-actions/getAllBlogs';
import { getBlogDetailsBySlug } from '@/server-actions/getBlogDetailsBySlug';
import type { PublicBlog } from '@/types/blog';

const FALLBACK_AUTHOR_IMAGE =
  '/sir-2.jpg';

const DEFAULT_AUTHOR_BIO =
  'Dr. Alam is a renowned Orthopedic Specialist with over 15 years of experience treating musculoskeletal disorders. He combines modern medical science with holistic lifestyle adjustments to help patients achieve long-term recovery.';

type BlogDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

async function loadBlog(slug: string): Promise<PublicBlog> {
  const { blog } = await getBlogDetailsBySlug(slug);
  return blog;
}

export async function generateMetadata({
  params,
}: BlogDetailsPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const blog = await loadBlog(slug);

    return {
      title: blog.meta?.title ?? blog.title,
      description: blog.meta?.description ?? blog.shortDesc,
      keywords: blog.meta?.keywords,
    };
  } catch {
    return {
      title: 'Article Not Found',
    };
  }
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;

  let blog: PublicBlog;
  try {
    blog = await loadBlog(slug);
  } catch {
    notFound();
  }

  const { html, toc } = processBlogContent(blog.content);

  let allBlogs: PublicBlog[] = [];
  try {
    ({ blogs: allBlogs } = await getAllBlogs());
  } catch {
    allBlogs = [];
  }

  const relatedBlogs = getRelatedBlogs(allBlogs, blog, 3);
  const authorName = blog.author[0] ?? 'Dr. Shah Alam';

  return (
    <main className="flex-grow">
      <BlogDetailsHero
        category={getPrimaryCategory(blog)}
        title={blog.title}
        authorName={authorName}
        authorImage={FALLBACK_AUTHOR_IMAGE}
        date={formatBlogDate(blog.createdAt)}
        readTime={estimateReadTime(blog.content)}
      />
      <section className="bg-background-light dark:bg-background-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <BlogContent
              imageUrl={blog.image}
              content={html}
              author={{
                name: authorName,
                image: FALLBACK_AUTHOR_IMAGE,
                bio: DEFAULT_AUTHOR_BIO,
              }}
              slug={slug}
            />
            <BlogSidebar toc={toc} relatedArticles={relatedBlogs} />
          </div>
        </div>
      </section>
      <BlogDetailsCallToAction />
    </main>
  );
}
