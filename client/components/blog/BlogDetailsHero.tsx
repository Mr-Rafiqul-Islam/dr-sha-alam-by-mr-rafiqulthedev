import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

interface BlogDetailsHeroProps {
  category: string;
  title: string;
  authorName: string;
  authorImage: string;
  date: string;
  readTime: string;
}

export default function BlogDetailsHero({ category, title, authorName, authorImage, date, readTime }: BlogDetailsHeroProps) {
  return (
    <section className="bg-white dark:bg-surface-dark pt-16 pb-12 border-b border-gray-100 dark:border-gray-800">
      <ScrollReveal direction="up" className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider mb-6">
          <span className="material-symbols-outlined text-base">category</span> {category}
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-main dark:text-white leading-tight mb-6">
          {title}
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <Image alt={authorName} className="w-8 h-8 rounded-full object-cover border border-gray-200" src={authorImage} width={32} height={32} sizes="32px" />
            <span>By <span className="text-primary font-semibold">{authorName}</span></span>
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            {date}
          </div>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">schedule</span>
            {readTime}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
