import { Icon } from "../common";
import type { ActivityLogEntry } from "../../types/activity";

type ActivityFeedListProps = {
  items: ActivityLogEntry[];
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  page?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
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
  isFetching = false,
  isError = false,
  page = 1,
  pageSize = 20,
  hasNextPage = false,
  hasPreviousPage = false,
  onNextPage,
  onPreviousPage,
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

  if (items.length === 0 && page === 1) {
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

  const rangeStart = (page - 1) * pageSize + (items.length > 0 ? 1 : 0);
  const rangeEnd = (page - 1) * pageSize + items.length;
  const showPagination = hasPreviousPage || hasNextPage || page > 1;

  return (
    <div className="overflow-hidden rounded-lg border border-outline-variant/30 bg-surface-container-low">
      <ul
        className={`divide-y divide-outline-variant/20 transition-opacity ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {items.length === 0 ? (
          <li className="px-4 py-10 text-center text-body-md text-on-surface-variant">
            No more activity on this page.
          </li>
        ) : (
          items.map((item) => (
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
          ))
        )}
      </ul>

      {showPagination ? (
        <div className="flex flex-col gap-3 border-t border-outline-variant/30 bg-surface/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <span className="text-center text-label-sm font-semibold text-on-surface-variant sm:text-left">
            {items.length > 0
              ? `Showing ${rangeStart}–${rangeEnd}${hasNextPage ? "+" : ""}`
              : "No entries on this page"}
            <span className="mx-2 text-outline-variant">·</span>
            Page {page}
          </span>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-md p-1 text-outline transition-colors hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasPreviousPage || isFetching}
              onClick={onPreviousPage}
              aria-label="Previous page"
            >
              <Icon name="chevron_left" />
            </button>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-md bg-primary-container px-2 text-label-sm font-medium text-on-primary-container">
              {page}
            </span>

            <button
              type="button"
              className="rounded-md p-1 text-outline transition-colors hover:text-primary-container disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasNextPage || isFetching}
              onClick={onNextPage}
              aria-label="Next page"
            >
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
