"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  formatScheduleDate,
  parseScheduleDate,
} from "@/lib/appointmentSchedules";
import { cn } from "@/lib/utils";

type PreferredDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  minDate: string;
  closedDates: Set<string>;
  isLoading?: boolean;
  schedulesError?: string | null;
  required?: boolean;
  onOpen?: () => void;
};

function formatDisplayDate(value: string): string {
  return parseScheduleDate(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PreferredDatePicker({
  value,
  onChange,
  minDate,
  closedDates,
  isLoading = false,
  schedulesError = null,
  required = false,
  onOpen,
}: PreferredDatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const minDateObject = useMemo(() => parseScheduleDate(minDate), [minDate]);
  const selectedDate = value ? parseScheduleDate(value) : undefined;

  const disabledMatchers = useMemo(() => {
    const closedDateObjects = Array.from(closedDates).map(parseScheduleDate);
    return [{ before: minDateObject }, ...closedDateObjects];
  }, [closedDates, minDateObject]);

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
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const handleToggle = () => {
    if (isLoading) {
      return;
    }

    if (!open) {
      onOpen?.();
    }

    setOpen((current) => !current);
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) {
      return;
    }

    onChange(formatScheduleDate(date));
    setOpen(false);
  };

  return (
    <div className="relative space-y-2" ref={containerRef}>
      <input name="preferredDate" required={required} type="hidden" value={value} />

      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-background-dark border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all text-left",
          isLoading && "opacity-70 cursor-not-allowed",
        )}
        disabled={isLoading}
        type="button"
        onClick={handleToggle}
      >
        <span
          className={cn(
            "text-sm",
            value
              ? "text-text-main dark:text-white"
              : "text-gray-400 dark:text-gray-500",
          )}
        >
          {isLoading
            ? "Loading available dates..."
            : value
              ? formatDisplayDate(value)
              : "Select preferred date"}
        </span>
        <span className="material-symbols-outlined text-gray-400 pointer-events-none">
          calendar_month
        </span>
      </button>

      {schedulesError ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          {schedulesError}
        </p>
      ) : null}

      {open ? (
        <div
          className="absolute z-50 mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-soft dark:border-gray-700 dark:bg-surface-dark"
          id={listboxId}
          role="dialog"
        >
          <DayPicker
            className="booking-date-picker"
            defaultMonth={selectedDate ?? minDateObject}
            disabled={disabledMatchers}
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>
      ) : null}
    </div>
  );
}
