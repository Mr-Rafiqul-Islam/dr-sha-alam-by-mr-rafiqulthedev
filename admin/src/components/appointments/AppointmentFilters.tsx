import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";

export type AppointmentFiltersProps = {
  search: string;
  date: string;
  todayOnly: boolean;
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTodayToggle: () => void;
  onClear: () => void;
};

export function AppointmentFilters({
  search,
  date,
  todayOnly,
  onSearchChange,
  onDateChange,
  onTodayToggle,
  onClear,
}: AppointmentFiltersProps) {
  const hasActiveFilters = search.trim() !== "" || date !== "" || todayOnly;

  return (
    <div className="mb-stack-lg flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 lg:flex-row lg:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search patient name, phone, email..."
        leftIcon={<Icon name="search" size={20} />}
        className="min-w-0 flex-1"
      />

      <div className="relative min-w-0 flex-1 lg:max-w-[220px]">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          <Icon name="calendar_today" size={20} />
        </span>
        <input
          type="date"
          value={todayOnly ? "" : date}
          onChange={(event) => onDateChange(event.target.value)}
          disabled={todayOnly}
          className={cn(
            "w-full rounded-full border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 text-body-md text-on-surface transition-all focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
            todayOnly && "cursor-not-allowed opacity-60",
          )}
        />
      </div>

      <Button
        type="button"
        leftIcon={<Icon name="event" size={18} />}
        onClick={onTodayToggle}
        className={cn(
          "shrink-0 justify-center",
          todayOnly
            ? "bg-secondary text-on-secondary hover:bg-secondary/90"
            : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high",
        )}
      >
        Today&apos;s Appointments
      </Button>

      <Button
        type="button"
        variant="ghost"
        leftIcon={<Icon name="close" size={18} />}
        onClick={onClear}
        disabled={!hasActiveFilters}
        className="shrink-0 justify-center border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
      >
        Clear Filters
      </Button>
    </div>
  );
}
