import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import Link from "next/link";
import { formatBlogDate, getPrimaryCategory } from "@/lib/utils";
import { getBlogPath } from "@/lib/blog";
import type { PublicBlog } from "@/types/blog";

interface LatestArticlesProps {
  blogs: PublicBlog[];
  hasFilters?: boolean;
}

export default function LatestArticles({
  blogs,
  hasFilters = false,
}: LatestArticlesProps) {
  const emptyMessage = hasFilters
    ? "No articles match your search."
    : "No articles available yet.";

  return (
    <section className="lg:py-16 py-12 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <h3 className="text-2xl font-bold text-text-main dark:text-white lg:mb-10 mb-8 border-l-4 border-accent pl-4">
            Latest Articles
          </h3>
        </ScrollReveal>
        {blogs.length === 0 ? (
          <p className="text-text-sub text-center py-8">{emptyMessage}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <ScrollReveal key={blog.id} direction="up" delay={index * 0.1}>
                <article className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group h-full">
                  <Link className="flex flex-col" href={getBlogPath(blog.slug)}>
                    <div className="h-56 overflow-hidden relative">
                      <Image
                        alt={blog.title}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        src={blog.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary uppercase tracking-wide">
                        {getPrimaryCategory(blog)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium">
                        <span className="material-symbols-outlined text-sm">
                          calendar_today
                        </span>{" "}
                        {formatBlogDate(blog.createdAt)}
                      </div>
                      <h4 className="text-xl font-bold text-primary mb-3 leading-tight group-hover:underline decoration-2 underline-offset-2">
                        {blog.title}
                      </h4>
                      <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">
                        {blog.shortDesc}
                      </p>
                      <Link
                        href={getBlogPath(blog.slug)}
                        className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1"
                      >
                        Read More{" "}
                        <span className="material-symbols-outlined text-sm">
                          arrow_forward
                        </span>
                      </Link>
                    </div>
                  </Link>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
        <ScrollReveal direction="up" className="lg:mt-12 mt-8 text-center">
          <button className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
            Load More Articles
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
