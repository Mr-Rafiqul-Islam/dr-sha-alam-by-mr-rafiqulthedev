import { cn } from "../lib/cn";

export function getPendingDeleteSurfaceClass(
  pendingDelete?: boolean,
  baseClass = "border-outline-variant/30 bg-surface-container-lowest",
): string {
  return cn(
    baseClass,
    pendingDelete && "border-error/50 bg-error-container/15",
  );
}

export function getPendingDeleteRowClass(pendingDelete?: boolean): string {
  return cn(pendingDelete && "bg-error-container/10 hover:bg-error-container/15");
}
