import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

import {
  formatScheduleDate,
  parseScheduleDate,
} from "../../lib/appointmentSchedules";
import { cn } from "../../lib/cn";
import { Icon } from "../common/Icon";

const controlInputClass = cn(
  "w-full min-h-10 px-4 py-2.5 rounded-lg border border-outline-variant",
  "bg-surface-container-lowest text-body-md text-on-surface",
  "placeholder:text-on-surface-variant",
  "focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/30",
);

type AppointmentDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  minDate: string;
  closedDates: Set<string>;
  disabled?: boolean;
  isLoading?: boolean;
  schedulesError?: string | null;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

function formatDisplayDate(value: string): string {
  return parseScheduleDate(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AppointmentDatePicker({
  value,
  onChange,
  onBlur,
  minDate,
  closedDates,
  disabled = false,
  isLoading = false,
  schedulesError = null,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: AppointmentDatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const minDateObject = useMemo(() => parseScheduleDate(minDate), [minDate]);
  const selectedDate = value ? parseScheduleDate(value) : undefined;

  const closedDateObjects = useMemo(
    () => Array.from(closedDates).map(parseScheduleDate),
    [closedDates],
  );

  const disabledMatchers = useMemo(
    () => [{ before: minDateObject }, ...closedDateObjects],
    [closedDateObjects, minDateObject],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        onBlur();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open, onBlur]);

  const handleToggle = () => {
    if (disabled || isLoading) {
      return;
    }

    setOpen((current) => !current);
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    onChange(formatScheduleDate(date));
    setOpen(false);
    onBlur();
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          controlInputClass,
          "flex items-center justify-between text-left",
          (disabled || isLoading) && "cursor-not-allowed opacity-50",
        )}
        disabled={disabled || isLoading}
        onClick={handleToggle}
      >
        <span
          className={cn(
            value ? "text-on-surface" : "text-on-surface-variant",
          )}
        >
          {isLoading
            ? "Loading available dates..."
            : value
              ? formatDisplayDate(value)
              : "Select preferred date"}
        </span>
        <Icon name="calendar_month" size={20} className="text-on-surface-variant" />
      </button>

      {schedulesError ? (
        <p className="mt-2 text-label-sm text-error">{schedulesError}</p>
      ) : null}

      {open ? (
        <div
          className="absolute z-50 mt-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-3 shadow-lg"
          id={listboxId}
          role="dialog"
        >
          <DayPicker
            className="admin-date-picker"
            defaultMonth={selectedDate ?? minDateObject}
            disabled={disabledMatchers}
            mode="single"
            modifiers={{ chamberClosed: closedDateObjects }}
            modifiersClassNames={{ chamberClosed: "rdp-chamber-closed" }}
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  );
}
