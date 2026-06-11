import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number | string;
  iconBgClassName?: string;
  className?: string;
};

export function StatCard({
  icon,
  label,
  value,
  iconBgClassName = "bg-primary-container/10 text-primary-container",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-[0_4px_24px_-8px_rgba(0,119,155,0.05)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-full",
          iconBgClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-label-sm text-on-surface-variant">{label}</p>
        <p className="text-headline-sm font-semibold text-on-surface">{value}</p>
      </div>
    </div>
  );
}
