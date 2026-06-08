import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "ghost" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  leftIcon?: ReactNode;
  fullWidthOnMobile?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-3 rounded-lg text-label-md font-medium hover:bg-secondary/90 transition-all shadow-sm hover:shadow-md",
  ghost:
    "inline-flex items-center gap-2 text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 rounded-md transition-colors",
  icon: "p-2 text-on-surface-variant hover:bg-primary-container/10 rounded-full transition-colors relative",
};

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "p-1.5",
  md: "",
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  fullWidthOnMobile = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        variantClasses[variant],
        variant === "ghost" && sizeClasses[size],
        variant === "icon" && sizeClasses[size],
        fullWidthOnMobile && variant === "primary" && "w-full sm:w-auto justify-center",
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
    </button>
  );
}
