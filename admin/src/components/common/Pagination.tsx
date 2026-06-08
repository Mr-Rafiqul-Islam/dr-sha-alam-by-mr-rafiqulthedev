import { cn } from "../../lib/cn";
import { Icon } from "./Icon";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="px-4 md:px-6 py-4 border-t border-outline-variant/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-surface/30">
      <span className="text-label-sm font-semibold text-on-surface-variant text-center sm:text-left">
        Showing {start} to {end} of {totalItems} entries
      </span>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          className="p-1 text-outline hover:text-primary-container transition-colors disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous page"
        >
          <Icon name="chevron_left" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={cn(
              "w-8 h-8 rounded-md text-label-sm font-medium flex items-center justify-center transition-colors",
              page === currentPage
                ? "bg-primary-container text-on-primary-container"
                : "hover:bg-surface-container-high text-on-surface-variant",
            )}
            onClick={() => onPageChange?.(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="p-1 text-outline hover:text-primary-container transition-colors disabled:opacity-50"
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
