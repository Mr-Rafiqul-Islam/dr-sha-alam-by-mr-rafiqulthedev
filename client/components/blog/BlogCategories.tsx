"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { buildBlogFilterUrl } from "@/lib/blog";

interface BlogCategoriesProps {
  categories: string[];
}

export default function BlogCategories({ categories }: BlogCategoriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeQuery = searchParams.get("q");

  const handleCategoryClick = (category: string | null) => {
    router.replace(buildBlogFilterUrl(activeQuery, category), { scroll: false });
  };

  return (
    <section className="bg-background-light dark:bg-background-dark pb-16 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" className="flex flex-wrap justify-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => handleCategoryClick(null)}
            className={
              !activeCategory
                ? "bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
                : "bg-white dark:bg-surface-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all"
            }
          >
            All Topics
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={
                activeCategory === category
                  ? "bg-primary text-white hover:bg-primary-dark px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  : "bg-white dark:bg-surface-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm transition-all"
              }
            >
              {category}
            </button>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
