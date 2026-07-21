import { useState } from "react";
import { cn } from "../../lib/cn";
import {
  useGetActiveAnnouncementsQuery,
  useMarkAnnouncementReadMutation,
} from "../../store/api/announcementsApi";
import type { Announcement } from "../../types/announcement";
import {
  formatAnnouncementDate,
  getAnnouncementTypeLabel,
  getAnnouncementTypeStyles,
  isAnnouncementFromToday,
} from "../../utils/announcement";
import { Badge, Button, Icon } from "../common";

function AnnouncementBanner({
  announcement,
  onDismiss,
}: {
  announcement: Announcement;
  onDismiss: (announcement: Announcement) => void;
}) {
  const [expanded, setExpanded] = useState(!announcement.isRead);
  const styles = getAnnouncementTypeStyles(announcement.type);

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        styles.border,
        styles.bg,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={styles.badge}>
              <span className="inline-flex items-center gap-1">
                <Icon name={styles.icon} size={14} />
                {getAnnouncementTypeLabel(announcement.type)}
              </span>
            </Badge>
            {!announcement.isRead ? (
              <span className="text-label-sm text-primary">New</span>
            ) : null}
            <span className="text-body-sm text-on-surface-variant">
              {formatAnnouncementDate(announcement.createdAt)}
            </span>
          </div>
          <h3 className="text-title-md text-on-surface">{announcement.title}</h3>
          {expanded ? (
            <p className="mt-2 wrap-break-word whitespace-pre-wrap text-body-md text-on-surface">
              {announcement.content}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-primary-container/10"
            aria-label={expanded ? "Collapse announcement" : "Expand announcement"}
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
          >
            <Icon name={expanded ? "expand_less" : "expand_more"} size={18} />
          </button>
          <Button
            variant="icon"
            size="sm"
            aria-label="Dismiss announcement"
            onClick={() => onDismiss(announcement)}
          >
            <Icon name="close" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AnnouncementBannerList({
  todayOnly = false,
}: {
  todayOnly?: boolean;
}) {
  const { data: announcements = [] } = useGetActiveAnnouncementsQuery();
  const [markRead] = useMarkAnnouncementReadMutation();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleAnnouncements = announcements.filter(
    (item) =>
      !dismissedIds.includes(item.id) &&
      (!todayOnly || isAnnouncementFromToday(item.createdAt)),
  );

  if (visibleAnnouncements.length === 0) {
    return null;
  }

  const handleDismiss = async (announcement: Announcement) => {
    setDismissedIds((prev) => [...prev, announcement.id]);
    if (!announcement.isRead) {
      try {
        await markRead(announcement.id).unwrap();
      } catch {
        // Ignore read-tracking failures for dismiss.
      }
    }
  };

  return (
    <div className="space-y-3">
      {visibleAnnouncements.map((announcement) => (
        <AnnouncementBanner
          key={announcement.id}
          announcement={announcement}
          onDismiss={handleDismiss}
        />
      ))}
    </div>
  );
}
