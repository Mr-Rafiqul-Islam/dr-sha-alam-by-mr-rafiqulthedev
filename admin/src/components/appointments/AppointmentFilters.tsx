import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Button, Icon, Input } from "../common";
import { cn } from "../../lib/cn";
import {
  APPOINTMENT_CATEGORY_OPTIONS,
  APPOINTMENT_EXTRA_FILTER_OPTIONS,
  type AppointmentCategoryFilter,
  type AppointmentExtraFilter,
} from "../../types/appointment";

export type AppointmentFiltersProps = {
  search: string;
  date: string;
  todayOnly: boolean;
  categories: AppointmentCategoryFilter[];
  extraFilters: AppointmentExtraFilter[];
  onSearchChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onCategoryToggle: (category: AppointmentCategoryFilter) => void;
  onExtraFilterToggle: (filter: AppointmentExtraFilter) => void;
  onTodayToggle: () => void;
  onClear: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
};

export function AppointmentFilters({
  search,
  date,
  todayOnly,
  categories,
  extraFilters,
  onSearchChange,
  onDateChange,
  onCategoryToggle,
  onExtraFilterToggle,
  onTodayToggle,
  onClear,
  onRefresh,
  isRefreshing = false,
}: AppointmentFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>();
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters =
    search.trim() !== "" ||
    date !== "" ||
    todayOnly ||
    categories.length > 0 ||
    extraFilters.length > 0;

  const hasActivePanelFilters =
    categories.length > 0 || extraFilters.length > 0;

  const toggleButtonClass = (active: boolean) =>
    cn(
      "shrink-0 justify-center",
      active
        ? "bg-secondary text-on-secondary hover:bg-secondary/90"
        : "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-high",
    );

  useLayoutEffect(() => {
    if (!filterOpen) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 4,
        left: Math.max(8, rect.left),
        zIndex: 50,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!filterOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setFilterOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [filterOpen]);

  return (
    <div className="mb-stack-lg flex flex-col gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 lg:flex-row lg:flex-wrap lg:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search patient name, phone, email..."
        leftIcon={<Icon name="search" size={20} />}
        className="min-w-0 flex-1 lg:min-w-[240px]"
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
        className={toggleButtonClass(todayOnly)}
      >
        Today&apos;s Appointments
      </Button>

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={filterOpen}
        aria-controls={panelId}
        onClick={() => setFilterOpen((current) => !current)}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg px-6 py-3 text-label-md font-medium transition-all",
          toggleButtonClass(hasActivePanelFilters),
        )}
      >
        <Icon name="filter_list" size={18} />
        Filter
      </button>

      {filterOpen && panelStyle
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              style={panelStyle}
              className={cn(
                "w-[min(100vw-1rem,28rem)] rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4",
                "shadow-[0_8px_24px_-8px_rgba(0,93,122,0.18)]",
              )}
            >
              <p className="mb-2 text-label-sm font-medium text-on-surface-variant">
                Category
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {APPOINTMENT_CATEGORY_OPTIONS.map((option) => {
                  const isActive = categories.includes(option.key);

                  return (
                    <Button
                      key={option.key}
                      type="button"
                      onClick={() => onCategoryToggle(option.key)}
                      className={toggleButtonClass(isActive)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>

              <p className="mb-2 text-label-sm font-medium text-on-surface-variant">
                Type &amp; Status
              </p>
              <div className="flex flex-wrap gap-2">
                {APPOINTMENT_EXTRA_FILTER_OPTIONS.map((option) => {
                  const isActive = extraFilters.includes(option.key);

                  return (
                    <Button
                      key={option.key}
                      type="button"
                      onClick={() => onExtraFilterToggle(option.key)}
                      className={toggleButtonClass(isActive)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}

      <div className="flex shrink-0 items-center gap-2 lg:ml-auto">
        <Button
          type="button"
          variant="ghost"
          leftIcon={<Icon name="close" size={18} />}
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="justify-center border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Filters
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Refresh appointments"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            name="refresh"
            size={18}
            className={isRefreshing ? "animate-spin" : undefined}
          />
        </Button>
      </div>
    </div>
  );
}
