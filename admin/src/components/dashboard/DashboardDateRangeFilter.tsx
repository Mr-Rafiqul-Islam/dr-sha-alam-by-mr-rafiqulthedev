import { Button, Icon } from "../common";
import { cn } from "../../lib/cn";

export type DashboardDateRangeFilterProps = {
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onThisMonth: () => void;
  onClear: () => void;
  isThisMonthActive?: boolean;
};

export function DashboardDateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onThisMonth,
  onClear,
  isThisMonthActive = false,
}: DashboardDateRangeFilterProps) {
  const hasActiveFilters = fromDate !== "" || toDate !== "";

  const handleFromDateChange = (value: string) => {
    onFromDateChange(value);
    if (value && toDate && value > toDate) {
      onToDateChange(value);
    }
  };

  const handleToDateChange = (value: string) => {
    onToDateChange(value);
    if (value && fromDate && value < fromDate) {
      onFromDateChange(value);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 lg:flex-row lg:items-end">
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="min-w-0">
          <span className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">
            From
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="calendar_today" size={20} />
            </span>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => handleFromDateChange(event.target.value)}
              max={toDate || undefined}
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>
        </label>

        <label className="min-w-0">
          <span className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">
            To
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="calendar_today" size={20} />
            </span>
            <input
              type="date"
              value={toDate}
              onChange={(event) => handleToDateChange(event.target.value)}
              min={fromDate || undefined}
              className="w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container"
            />
          </div>
        </label>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button
          type="button"
          leftIcon={<Icon name="event" size={18} />}
          onClick={onThisMonth}
          className={cn(
            "justify-center",
            isThisMonthActive
              ? "bg-secondary text-on-secondary hover:bg-secondary/90"
              : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high",
          )}
        >
          This month
        </Button>

        <Button
          type="button"
          variant="ghost"
          leftIcon={<Icon name="close" size={18} />}
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="justify-center border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
