import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";
import { CONTACT_STATUS_OPTIONS } from "../../utils/contact";
import type { ContactMessageFilterState } from "../../types/contact";

export type ContactMessageFiltersProps = {
  draftFilters: ContactMessageFilterState;
  onDraftChange: (filters: ContactMessageFilterState) => void;
  onSearch: () => void;
  onReset: () => void;
};

export function ContactMessageFilters({
  draftFilters,
  onDraftChange,
  onSearch,
  onReset,
}: ContactMessageFiltersProps) {
  const hasActiveDraft =
    draftFilters.name.trim() !== "" ||
    draftFilters.subject.trim() !== "" ||
    draftFilters.status !== "";

  return (
    <div className="mb-stack-lg rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Name
          </label>
          <Input
            value={draftFilters.name}
            onChange={(event) =>
              onDraftChange({ ...draftFilters, name: event.target.value })
            }
            placeholder="Search by name..."
            leftIcon={<Icon name="person" size={20} />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Subject
          </label>
          <Input
            value={draftFilters.subject}
            onChange={(event) =>
              onDraftChange({ ...draftFilters, subject: event.target.value })
            }
            placeholder="Inquiry subject..."
            leftIcon={<Icon name="subject" size={20} />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-label-sm font-medium text-on-surface-variant">
            Status
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-outline">
              <Icon name="filter_list" size={20} />
            </span>
            <select
              value={draftFilters.status}
              onChange={(event) =>
                onDraftChange({
                  ...draftFilters,
                  status: event.target.value as ContactMessageFilterState["status"],
                })
              }
              className={cn(
                "w-full appearance-none rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-10 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
              )}
            >
              <option value="">All</option>
              {CONTACT_STATUS_OPTIONS.map((option) => (
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
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          type="button"
          leftIcon={<Icon name="search" size={18} />}
          onClick={onSearch}
        >
          Search
        </Button>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveDraft}
          className="text-body-md font-medium text-primary-container transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
