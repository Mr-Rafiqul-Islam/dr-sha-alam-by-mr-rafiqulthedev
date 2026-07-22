import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import {
  useGetAnnouncementFeedQuery,
  useGetUnreadAnnouncementCountQuery,
  useMarkAnnouncementReadMutation,
} from "../../store/api/announcementsApi";
import type { Announcement } from "../../types/announcement";
import {
  formatAnnouncementDate,
  getAnnouncementTypeLabel,
  getAnnouncementTypeStyles,
} from "../../utils/announcement";
import { Badge, Button, Icon } from "../common";

const FEED_PAGE_SIZE = 4;

export function AnnouncementNotificationPanel() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useGetUnreadAnnouncementCountQuery(undefined, {
    pollingInterval: 60_000,
  });
  const { data, isLoading, isFetching } = useGetAnnouncementFeedQuery({
    page,
    pageSize: FEED_PAGE_SIZE,
  });
  const [markRead] = useMarkAnnouncementReadMutation();

  const items = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / FEED_PAGE_SIZE));

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleToggleItem = async (announcement: Announcement) => {
    const willExpand = expandedId !== announcement.id;
    setExpandedId(willExpand ? announcement.id : null);

    if (willExpand && !announcement.isRead) {
      try {
        await markRead(announcement.id).unwrap();
      } catch {
        // Non-blocking; badge will refresh on next poll.
      }
    }
  };

  return (
    <div ref={panelRef} className="relative">
      <Button
        variant="icon"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon name="notifications" />
        {unreadCount > 0 ? (
          <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-on-error">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_8px_32px_-8px_rgba(0,93,122,0.15)]">
          <div className="border-b border-outline-variant/30 px-4 py-3">
            <h3 className="text-title-md text-on-surface">Announcements</h3>
            <p className="text-body-sm text-on-surface-variant">
              {unreadCount > 0
                ? `${unreadCount} unread notice${unreadCount === 1 ? "" : "s"}`
                : "You're all caught up"}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Icon
                  name="progress_activity"
                  className="animate-spin text-primary"
                />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-10 text-center text-body-md text-on-surface-variant">
                No active announcements.
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/20">
                {items.map((announcement) => {
                  const styles = getAnnouncementTypeStyles(announcement.type);
                  const isExpanded = expandedId === announcement.id;

                  return (
                    <li key={announcement.id}>
                      <div
                        className={cn(
                          "px-4 py-3 transition-colors hover:bg-surface-container-low",
                          !announcement.isRead && "bg-primary-container/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <Badge className={styles.badge}>
                                {getAnnouncementTypeLabel(announcement.type)}
                              </Badge>
                              {!announcement.isRead ? (
                                <span className="text-label-sm text-primary">
                                  New
                                </span>
                              ) : null}
                            </div>
                            <p className="truncate text-body-md font-medium text-on-surface">
                              {announcement.title}
                            </p>
                            <p className="mt-1 text-body-sm text-on-surface-variant">
                              {formatAnnouncementDate(announcement.createdAt)}
                            </p>
                            {isExpanded ? (
                              <p className="mt-3 wrap-break-word whitespace-pre-wrap text-body-md text-on-surface">
                                {announcement.content}
                              </p>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            className="shrink-0 rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-primary-container/10"
                            aria-label={
                              isExpanded
                                ? "Collapse announcement"
                                : "Expand announcement"
                            }
                            aria-expanded={isExpanded}
                            onClick={() => handleToggleItem(announcement)}
                          >
                            <Icon
                              name={isExpanded ? "expand_less" : "expand_more"}
                              size={18}
                            />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {totalPages > 1 ? (
            <div className="flex items-center justify-between border-t border-outline-variant/30 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-body-sm text-on-surface-variant">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          ) : null}

          {isFetching && !isLoading ? (
            <div className="border-t border-outline-variant/20 px-4 py-2 text-center text-body-sm text-on-surface-variant">
              Updating...
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
