import { cn } from "../../lib/cn";

type IconProps = {
  name: string;
  size?: number;
  filled?: boolean;
  className?: string;
};

export function Icon({ name, size = 24, filled = false, className }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined inline-flex shrink-0 leading-none",
        filled && "filled",
        className,
      )}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
