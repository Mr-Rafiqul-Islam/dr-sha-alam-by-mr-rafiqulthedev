'use client';

import { faqCategories } from '@/components/faq/faqData';

type FAQCategoriesProps = {
  activeCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
};

export default function FAQCategories({
  activeCategoryId,
  onCategoryChange,
}: FAQCategoriesProps) {
  return (
    <section className="py-12 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {faqCategories.map((category) => {
            const isActive = category.id === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onCategoryChange(category.id)}
                className={`px-4 sm:px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md transform hover:-translate-y-0.5'
                    : 'bg-background-light dark:bg-background-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-gray-800 border border-transparent hover:border-blue-100 dark:hover:border-gray-700'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
