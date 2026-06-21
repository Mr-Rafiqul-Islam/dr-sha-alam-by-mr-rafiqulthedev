import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import { formatBlogDate, getPrimaryCategory } from '@/lib/utils';
import type { PublicBlog } from '@/types/blog';

interface HomeBlogSectionProps {
  blogs: PublicBlog[];
}

export default function HomeBlogSection({ blogs }: HomeBlogSectionProps) {
  if (blogs.length === 0) {
    return null;
  }

  return (
    <ScrollReveal direction="up">
      <section className="lg:py-24 py-12 bg-background-light dark:bg-background-dark" id="blog">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:mb-16 mb-8">
            <h2 className="text-accent font-bold tracking-wider uppercase text-sm mb-3">Health Insights</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-primary dark:text-white">Latest Articles</h3>
            <p className="text-text-sub mt-4 max-w-2xl mx-auto">Evidence-based articles from Dr. Shah Alam on spine care, joint health, therapeutic yoga, posture correction, nutrition, and natural recovery strategies to help you move better and live pain-free.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog) => (
              <article key={blog.id} className="flex flex-col bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="h-56 overflow-hidden relative">
                  <Image alt={blog.title} className="object-cover transition-transform duration-700 group-hover:scale-110" src={blog.image} fill sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-primary shadow-sm uppercase tracking-wide">
                    {getPrimaryCategory(blog)}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-text-sub mb-3 font-medium uppercase tracking-wide">
                    <span className="material-symbols-outlined text-base">calendar_today</span> {formatBlogDate(blog.createdAt)}
                  </div>
                  <h4 className="text-xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">{blog.title}</h4>
                  <p className="text-text-sub text-sm mb-6 line-clamp-3 leading-relaxed">{blog.shortDesc}</p>
                  <Link className="mt-auto inline-flex items-center text-primary font-bold text-sm hover:text-accent transition-colors gap-1" href={`/blog/${blog.slug}`}>
                    Read Article <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
