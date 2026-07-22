import Link from "next/link";
import { buildBlogFilterUrl } from "@/lib/blog";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  q?: string;
  category?: string;
};

function getVisiblePages(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);

  for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }

  return result;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  q,
  category,
}: BlogPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const prevHref =
    currentPage > 1
      ? buildBlogFilterUrl(q, category, currentPage - 1)
      : null;
  const nextHref =
    currentPage < totalPages
      ? buildBlogFilterUrl(q, category, currentPage + 1)
      : null;

  const linkClass =
    "inline-flex items-center justify-center min-w-10 h-10 px-3 rounded-full text-sm font-semibold transition-colors";
  const idleClass =
    "bg-white dark:bg-surface-dark text-text-sub hover:text-primary hover:bg-blue-50 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 shadow-sm";
  const activeClass =
    "bg-primary text-white shadow-md";
  const disabledClass =
    "bg-white/60 dark:bg-surface-dark/60 text-text-sub/40 cursor-not-allowed shadow-sm";

  return (
    <nav
      className="lg:mt-12 mt-8 flex flex-wrap items-center justify-center gap-2"
      aria-label="Blog pagination"
    >
      {prevHref ? (
        <Link
          href={prevHref}
          className={`${linkClass} ${idleClass}`}
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </Link>
      ) : (
        <span className={`${linkClass} ${disabledClass}`} aria-disabled="true">
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </span>
      )}

      {visiblePages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-text-sub"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildBlogFilterUrl(q, category, page)}
            className={`${linkClass} ${page === currentPage ? activeClass : idleClass}`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        ),
      )}

      {nextHref ? (
        <Link
          href={nextHref}
          className={`${linkClass} ${idleClass}`}
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      ) : (
        <span className={`${linkClass} ${disabledClass}`} aria-disabled="true">
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </span>
      )}
    </nav>
  );
}
