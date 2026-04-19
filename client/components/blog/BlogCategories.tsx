import ScrollReveal from '@/components/ScrollReveal';

export default function BlogCategories() {
  const categories = [
    { name: 'All Topics', active: true },
    { name: 'PLID', active: false },
    { name: 'Back Pain', active: false },
    { name: 'Migraine', active: false },
    { name: 'Posture', active: false },
    { name: 'Exercise', active: false },
    { name: 'Lifestyle', active: false },
  ];

  return (
    <section className="bg-background-light dark:bg-background-dark pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex flex-wrap justify-center gap-3 md:gap-4">
          {categories.map((category) => (
            <button 
              key={category.name}
              className={
                category.active 
                  ? "bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  : "bg-white dark:bg-surface-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all"
              }
            >
              {category.name}
            </button>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
