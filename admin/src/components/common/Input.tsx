import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: ReactNode;
};

export function Input({ leftIcon, className, ...props }: InputProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        className={cn(
          "w-full py-2 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all",
          leftIcon ? "pl-10" : "pl-4",
        )}
        {...props}
      />
    </div>
  );
}
