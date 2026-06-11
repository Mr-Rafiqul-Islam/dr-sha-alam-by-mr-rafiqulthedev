import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-lg gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl md:text-headline-lg font-semibold text-primary-container tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-body-md text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <div className="w-full sm:w-auto shrink-0">{action}</div>
      )}
    </div>
  );
}
