import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "../../lib/cn";

const controlInputClass = cn(
  "w-full min-h-10 px-4 py-2.5 rounded-lg border border-outline-variant",
  "bg-surface-container-lowest text-body-md text-on-surface",
  "placeholder:text-on-surface-variant",
  "focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus:ring-error/30",
);

type SuggestableTextInputProps = {
  fieldId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any;
  fieldState: { error?: { message?: unknown } };
  disabled: boolean;
  describedBy?: string;
  placeholder?: string;
  suggestions: readonly string[];
};

export function SuggestableTextInput({
  fieldId,
  field,
  fieldState,
  disabled,
  describedBy,
  placeholder,
  suggestions,
}: SuggestableTextInputProps) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = `${fieldId}-suggestions`;
  const query = String(field.value ?? "");

  const filteredSuggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return suggestions;
    }

    return suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(normalizedQuery),
    );
  }, [query, suggestions]);

  const showList = open && !disabled && filteredSuggestions.length > 0;

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query, open]);

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
        field.onBlur();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [field, open]);

  useEffect(() => {
    if (!showList) {
      return;
    }

    const highlightedOption = containerRef.current?.querySelector(
      '[aria-selected="true"]',
    );

    highlightedOption?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, showList]);

  const selectSuggestion = (suggestion: string) => {
    field.onChange(suggestion);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        id={fieldId}
        type="text"
        role="combobox"
        autoComplete="off"
        placeholder={placeholder}
        className={controlInputClass}
        disabled={disabled}
        aria-invalid={!!fieldState.error}
        aria-describedby={describedBy}
        aria-expanded={showList}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={
          showList ? `${listboxId}-option-${highlightedIndex}` : undefined
        }
        name={field.name}
        ref={field.ref}
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          field.onBlur();
          setOpen(false);
        }}
        onChange={(event) => {
          field.onChange(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            return;
          }

          if (!filteredSuggestions.length) {
            return;
          }

          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setHighlightedIndex((current) =>
              showList ? (current + 1) % filteredSuggestions.length : 0,
            );
            return;
          }

          if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setHighlightedIndex((current) =>
              showList
                ? (current - 1 + filteredSuggestions.length) %
                  filteredSuggestions.length
                : filteredSuggestions.length - 1,
            );
            return;
          }

          if (event.key === "Enter" && showList) {
            event.preventDefault();
            selectSuggestion(filteredSuggestions[highlightedIndex]);
          }
        }}
      />

      {showList ? (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest py-1 shadow-lg"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={cn(
                "cursor-pointer px-4 py-2 text-body-md text-on-surface",
                index === highlightedIndex && "bg-primary-fixed/40",
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                selectSuggestion(suggestion);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
