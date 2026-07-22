import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';
import Link from 'next/link';
import { getBlogPath } from '@/lib/blog';
import { getPrimaryCategory } from '@/lib/utils';
import type { PublicBlog } from '@/types/blog';

interface FeaturedArticleProps {
  blog: PublicBlog | null;
}

export default function FeaturedArticle({ blog }: FeaturedArticleProps) {
  if (!blog) {
    return null;
  }

  return (
    <section className="py-12 bg-white dark:bg-surface-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="bg-background-light dark:bg-background-dark rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row hover:shadow-xl transition-all duration-300 group">
          <div className="lg:w-3/5 h-64 lg:min-h-[280px] relative overflow-hidden lg:self-stretch">
            <Image alt={blog.title} className="object-cover transform group-hover:scale-105 transition-transform duration-700" src={blog.image} fill sizes="(max-width: 1024px) 100vw, 60vw" />
            <div className="absolute top-6 left-6 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wide">
              Featured
            </div>
          </div>
          <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-sm text-text-sub mb-4 font-semibold uppercase tracking-wide">
              <span className="material-symbols-outlined text-lg">category</span> {getPrimaryCategory(blog)}
            </div>
            <h2 className="lg:text-3xl text-2xl font-bold text-text-main dark:text-white mb-4 leading-tight group-hover:text-primary transition-colors">
              {blog.title}
            </h2>
            <p className="text-text-sub dark:text-gray-400 mb-8 leading-relaxed line-clamp-3">
              {blog.shortDesc}
            </p>
            <Link href={getBlogPath(blog.slug)} className="self-start bg-accent hover:bg-accent-dark text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              Read Full Article <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
