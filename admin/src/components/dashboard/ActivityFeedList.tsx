import { Icon } from "../common";
import type { ActivityLogEntry } from "../../types/activity";

type ActivityFeedListProps = {
  items: ActivityLogEntry[];
  isLoading?: boolean;
  isError?: boolean;
};

function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}d ago`;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function roleLabel(role: ActivityLogEntry["actor"]["role"]): string {
  return role === "SUPPORT" ? "Support" : "Editor";
}

export function ActivityFeedList({
  items,
  isLoading = false,
  isError = false,
}: ActivityFeedListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-lg bg-surface-container-high"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-container-low px-6 py-10 text-center text-on-surface-variant">
        <Icon name="error" size={28} className="text-error" />
        <p className="text-body-md">Failed to load staff activity.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-surface-container-low px-6 py-10 text-center text-on-surface-variant">
        <Icon name="history" size={28} />
        <p className="text-body-md">No staff activity recorded yet.</p>
        <p className="text-body-sm">
          Actions by support and editor staff will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-outline-variant/20 rounded-lg border border-outline-variant/30 bg-surface-container-low">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 px-4 py-4">
          <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-container/10 text-primary-container">
            <Icon name="history" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-body-md text-on-surface">{item.summary}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-label-sm text-on-surface-variant">
              <span
                className={
                  item.actor.role === "SUPPORT"
                    ? "rounded-full bg-tertiary-fixed/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-on-tertiary-fixed-variant"
                    : "rounded-full bg-secondary-fixed/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-container"
                }
              >
                {roleLabel(item.actor.role)}
              </span>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
