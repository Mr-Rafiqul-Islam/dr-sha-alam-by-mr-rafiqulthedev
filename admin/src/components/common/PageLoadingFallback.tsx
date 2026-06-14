import { Icon } from "./Icon";

export function PageLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-on-surface-variant">
      <Icon
        name="progress_activity"
        size={32}
        className="animate-spin text-primary"
      />
      <p className="text-body-md">Loading page...</p>
    </div>
  );
}
