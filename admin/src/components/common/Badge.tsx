import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type BadgeVariant = "pending" | "confirmed" | "neutral";

type BadgeProps = {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
};

const variantClasses: Record<BadgeVariant, string> = {
  pending:
    "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary-fixed-dim/30",
  confirmed:
    "bg-secondary-fixed text-on-secondary-fixed-variant border-secondary-fixed-dim/30",
  neutral: "bg-surface-container-low text-primary-container border-outline-variant/30",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-label-sm font-semibold border",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
