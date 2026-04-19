import ScrollReveal from '@/components/ScrollReveal';

export default function BeforeVisitHero() {
  return (
    <section className="relative pt-16 pb-12 lg:pt-24 lg:pb-20 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 transform origin-top-right"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30 mb-6">
            <span className="material-symbols-outlined text-sm">info</span>
            Patient Guide
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.15] mb-6">
            Before Visit <span className="text-accent">Instructions</span>
          </h1>
          <p className="text-lg text-text-sub leading-relaxed font-medium">
            To ensure your appointment runs smoothly and you receive the best possible care, please review the following guidelines before your visit. Being prepared helps Dr. Alam focus entirely on your recovery plan.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
