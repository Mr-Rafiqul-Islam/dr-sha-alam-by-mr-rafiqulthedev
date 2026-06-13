import { useState, type ReactNode } from "react";
import { Icon } from "../common";
import { cn } from "../../lib/cn";

type CollapsibleSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-label-md font-semibold text-on-surface">
          {title}
        </span>
        <Icon
          name="expand_more"
          size={22}
          className={cn(
            "text-on-surface-variant transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div className="border-t border-outline-variant/30 px-5 py-5">
          {children}
        </div>
      ) : null}
    </div>
  );
}
