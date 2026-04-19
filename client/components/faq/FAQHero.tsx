import ScrollReveal from '@/components/ScrollReveal';

export default function FAQHero() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 bg-gradient-to-br from-background-light to-white dark:from-background-dark dark:to-surface-dark overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal direction="up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-main dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg sm:text-xl text-text-sub max-w-2xl mx-auto mb-10 leading-relaxed">
            Find answers to common questions about our orthopedic and rehabilitation treatments, recovery process, and clinic policies.
          </p>
          <div className="relative max-w-2xl mx-auto">
            <input 
              className="w-full h-14 pl-14 pr-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark shadow-soft focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-main dark:text-white placeholder-gray-400" 
              placeholder="Search for a question..." 
              type="text"
            />
            <span className="material-symbols-outlined absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">search</span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
