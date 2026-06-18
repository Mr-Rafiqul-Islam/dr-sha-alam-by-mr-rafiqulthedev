import Image from 'next/image';
import Link from 'next/link';
import type { BlogTocItem } from '@/lib/blog';
import { getPrimaryCategory } from '@/lib/utils';
import type { PublicBlog } from '@/types/blog';

interface BlogSidebarProps {
  toc: BlogTocItem[];
  relatedArticles: PublicBlog[];
}

export default function BlogSidebar({ toc, relatedArticles }: BlogSidebarProps) {
  return (
    <aside className="lg:w-1/3 space-y-8 mt-8 lg:mt-0">
      <div className="sticky top-28 space-y-8">
      {toc.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hidden lg:block">
          <h3 className="font-bold text-lg text-text-main dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">list_alt</span> Table of Contents
          </h3>
          <ul className="space-y-3 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="flex items-start gap-2 transition-colors text-gray-600 dark:text-gray-400 hover:text-primary"
                >
                  <span className="text-gray-300 mt-0.5">•</span> {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedArticles.length > 0 && (
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-lg text-text-main dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            Related Articles
          </h3>
          <div className="space-y-6">
            {relatedArticles.map((article) => (
              <Link key={article.id} href={`/blog/${article.slug}`} className="group flex gap-4 items-start">
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
                  <Image alt={article.title} className="object-cover group-hover:scale-110 transition-transform duration-500" src={article.image} fill sizes="80px" />
                </div>
                <div>
                  <span className="text-xs font-bold text-accent uppercase mb-1 block">{getPrimaryCategory(article)}</span>
                  <h4 className="text-sm font-bold text-text-main dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-primary rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="relative z-10">
          <span className="material-symbols-outlined text-4xl mb-3">medical_services</span>
          <h3 className="text-xl font-bold mb-2">Pain Won&apos;t Go Away?</h3>
          <p className="text-white/80 text-sm mb-6">Schedule a consultation with Dr. Alam today.</p>
          <Link href="/appointment" className="block w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-xl transition-colors shadow-md text-sm">
            Book Now
          </Link>
        </div>
      </div>
      </div>
    </aside>
  );
}
