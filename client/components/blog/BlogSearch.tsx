"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/ScrollReveal";
import { buildBlogFilterUrl } from "@/lib/blog";

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get("q") ?? "";
  const categoryFromUrl = searchParams.get("category");
  const [query, setQuery] = useState(queryFromUrl);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const nextUrl = buildBlogFilterUrl(query, categoryFromUrl);
      const currentUrl = buildBlogFilterUrl(queryFromUrl, categoryFromUrl);

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, queryFromUrl, categoryFromUrl, router]);

  return (
    <section className="bg-background-light dark:bg-background-dark py-8 -mt-8 relative z-10">
      <ScrollReveal direction="up" className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">
              search
            </span>
          </div>
          <input
            className="block w-full pl-14 pr-6 py-5 rounded-full border-none shadow-sm focus:ring-2 focus:ring-primary/20 focus:shadow-md bg-white dark:bg-surface-dark text-lg text-text-main dark:text-white placeholder-gray-400 transition-all duration-300"
            placeholder="Search articles, topics, or symptoms..."
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
