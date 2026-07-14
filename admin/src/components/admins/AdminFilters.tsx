import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";
import { STAFF_ROLE_OPTIONS } from "../../utils/admin";
import type { AdminFilterState } from "../../types/admin";

export type AdminFiltersProps = {
  draftFilters: AdminFilterState;
  onDraftChange: (filters: AdminFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
};

export function AdminFilters({
  draftFilters,
  onDraftChange,
  onSearch,
  onReset,
}: AdminFiltersProps) {
  const hasActiveDraft =
    draftFilters.search.trim() !== "" ||
    draftFilters.role !== "" ||
    draftFilters.status !== "";

  return (
    <div className="mb-stack-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Search Admin
          </label>
          <Input
            value={draftFilters.search}
            onChange={(event) =>
              onDraftChange({ ...draftFilters, search: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch();
            }}
            placeholder="Search by name or email..."
            leftIcon={<Icon name="search" size={20} />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Role
          </label>
          <div className="relative">
            <select
              value={draftFilters.role}
              onChange={(event) =>
                onDraftChange({
                  ...draftFilters,
                  role: event.target.value as AdminFilterState["role"],
                })
              }
              className={cn(
                "w-full appearance-none rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
              )}
            >
              <option value="">All Roles</option>
              {STAFF_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="expand_more" size={20} />
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Status
          </label>
          <div className="relative">
            <select
              value={draftFilters.status}
              onChange={(event) =>
                onDraftChange({
                  ...draftFilters,
                  status: event.target.value as AdminFilterState["status"],
                })
              }
              className={cn(
                "w-full appearance-none rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-4 pr-10 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
              )}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="expand_more" size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          leftIcon={<Icon name="search" size={18} />}
          onClick={onSearch}
        >
          Search
        </Button>
        <Button
          type="button"
          variant="ghost"
          leftIcon={<Icon name="filter_alt_off" size={18} />}
          onClick={onReset}
          disabled={!hasActiveDraft}
          className="rounded-lg border border-secondary px-4 py-2 text-primary-container hover:bg-secondary/10"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
