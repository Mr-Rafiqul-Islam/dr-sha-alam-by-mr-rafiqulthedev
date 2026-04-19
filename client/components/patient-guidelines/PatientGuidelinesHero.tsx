import ScrollReveal from '@/components/ScrollReveal';

export default function PatientGuidelinesHero() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-primary/20 text-primary font-semibold text-xs uppercase tracking-wider border border-blue-100 dark:border-primary/30 mb-6">
            <span className="material-symbols-outlined text-sm">info</span>
            Patient Information
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white mb-6">
            Patient Guidelines
          </h1>
          <p className="text-xl text-text-sub dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Essential Instructions for Your Treatment Journey. Follow these steps for a smooth recovery and effective consultation.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
