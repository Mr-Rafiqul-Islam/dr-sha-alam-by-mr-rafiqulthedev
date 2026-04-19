import ScrollReveal from '@/components/ScrollReveal';

export default function BlogSearch() {
  return (
    <section className="bg-background-light dark:bg-background-dark py-8 -mt-8 relative z-10">
      <ScrollReveal direction="up" className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
          </div>
          <input className="block w-full pl-14 pr-6 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-primary/20 focus:shadow-md bg-white dark:bg-surface-dark text-lg text-text-main dark:text-white placeholder-gray-400 transition-all duration-300" placeholder="Search articles, topics, or symptoms..." type="text"/>
        </div>
      </ScrollReveal>
    </section>
  );
}
