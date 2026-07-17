import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
};

type PageItem = number | "ellipsis";

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 0) {
    return [];
  }

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(currentPage);

  if (currentPage - 1 >= 1) {
    pages.add(currentPage - 1);
  }

  if (currentPage + 1 <= totalPages) {
    pages.add(currentPage + 1);
  }

  // Near the edges, keep a 3-page window for clearer context.
  if (currentPage <= 2) {
    pages.add(2);
    pages.add(3);
  } else if (currentPage >= totalPages - 1) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: PageItem[] = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(page);
  });

  return items;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-outline-variant/30 bg-surface/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
      <span className="text-center text-label-sm font-semibold text-on-surface-variant sm:text-left">
        Showing {start} to {end} of {totalItems} entries
      </span>
      <div className="flex min-w-0 flex-wrap items-center justify-center gap-1 sm:gap-2">
        <button
          type="button"
          className="shrink-0 p-1 text-outline transition-colors hover:text-primary-container disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous page"
        >
          <Icon name="chevron_left" />
        </button>
        {visiblePages.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center text-label-sm font-medium text-on-surface-variant"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-label-sm font-medium transition-colors",
                item === currentPage
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high",
              )}
              onClick={() => onPageChange?.(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className="shrink-0 p-1 text-outline transition-colors hover:text-primary-container disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next page"
        >
          <Icon name="chevron_right" />
        </button>
      </div>
    </div>
  );
}
