import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";
import type { BlogFilterState, BlogStatusFilter } from "../../types/blog";

type BlogFiltersProps = {
  filters: BlogFilterState;
  authors: string[];
  onChange: (filters: BlogFilterState) => void;
  onReset: () => void;
};

const selectClass = cn(
  "w-full min-h-10 rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md text-on-surface",
  "focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container transition-all",
);

export function BlogFilters({
  filters,
  authors,
  onChange,
  onReset,
}: BlogFiltersProps) {
  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.author !== "" ||
    filters.status !== "";

  return (
    <div className="mb-stack-lg flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 lg:flex-row lg:items-center">
      <Input
        value={filters.search}
        onChange={(event) =>
          onChange({ ...filters, search: event.target.value })
        }
        placeholder="Search title or short description"
        leftIcon={<Icon name="search" size={20} />}
        className="min-w-0 flex-1"
      />

      <select
        value={filters.author}
        onChange={(event) =>
          onChange({ ...filters, author: event.target.value })
        }
        className={cn(selectClass, "min-w-0 flex-1 lg:max-w-[200px]")}
        aria-label="Filter by author"
      >
        <option value="">Author</option>
        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(event) =>
          onChange({
            ...filters,
            status: event.target.value as BlogStatusFilter,
          })
        }
        className={cn(selectClass, "min-w-0 flex-1 lg:max-w-[160px]")}
        aria-label="Filter by status"
      >
        <option value="">Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      <Button
        type="button"
        variant="ghost"
        leftIcon={<Icon name="refresh" size={18} />}
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="shrink-0 justify-center border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reset
      </Button>
    </div>
  );
}
