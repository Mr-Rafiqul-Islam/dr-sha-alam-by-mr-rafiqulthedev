'use client';

import ScrollReveal from '@/components/ScrollReveal';

type FAQHeroProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
};

export default function FAQHero({ searchQuery, onSearchChange }: FAQHeroProps) {
  return (
    <section className="relative pt-12 md:pt-16 pb-12 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal direction="up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30 mb-6">
            <span className="material-symbols-outlined text-sm">info</span>
            PATIENT HELP CENTER
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-main dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-sm lg:text-base text-text-sub max-w-2xl mx-auto mb-10 leading-relaxed">
            Find answers to the most common questions about PLID, sciatica, back
            pain, treatment options, rehabilitation, therapeutic yoga, epidural
            steroid injections, and spine surgery. Make informed decisions about
            your recovery with expert guidance from Dr. Shah Alam.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <input
              className="w-full h-14 pl-14 pr-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark shadow-soft focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white placeholder-gray-400"
              placeholder="Search for a question..."
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="Search frequently asked questions"
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl pointer-events-none">
              search
            </span>
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
