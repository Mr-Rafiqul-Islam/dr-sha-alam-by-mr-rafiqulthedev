export default function FAQCategories() {
  const categories = [
    { name: 'General Questions', active: true },
    { name: 'PLID & Back Pain', active: false },
    { name: 'Treatment Process', active: false },
    { name: 'Patient Guidelines', active: false },
  ];

  return (
    <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 sticky top-24 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category, index) => (
            <button 
              key={index}
              className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${
                category.active 
                  ? 'bg-primary text-white shadow-md transform hover:-translate-y-0.5' 
                  : 'bg-background-light dark:bg-background-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 border border-transparent hover:border-blue-100 dark:hover:border-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
