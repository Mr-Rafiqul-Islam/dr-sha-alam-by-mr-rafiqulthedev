import { cn } from "../../lib/cn";

type AvatarSize = "sm" | "md";

type AvatarProps = {
  initials: string;
  size?: AvatarSize;
  className?: string;
  title?: string;
};

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-label-sm",
  md: "w-10 h-10 text-label-md",
};

export function Avatar({
  initials,
  size = "md",
  className,
  title,
}: AvatarProps) {
  return (
    <div
      title={title}
      className={cn(
        "rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold shrink-0 overflow-hidden border border-outline-variant",
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
