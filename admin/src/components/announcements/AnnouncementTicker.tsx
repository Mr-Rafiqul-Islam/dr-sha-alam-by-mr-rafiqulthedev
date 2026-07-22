import { useEffect, useMemo, useState } from "react";
import { cn } from "../../lib/cn";
import type { Announcement } from "../../types/announcement";
import {
  getAnnouncementTypeLabel,
  getAnnouncementTypeStyles,
  pickTickerAnnouncements,
} from "../../utils/announcement";
import { Icon } from "../common";

type AnnouncementTickerProps = {
  announcements: Announcement[];
  className?: string;
};

export function AnnouncementTicker({
  announcements,
  className,
}: AnnouncementTickerProps) {
  const tickerItems = useMemo(
    () => pickTickerAnnouncements(announcements),
    [announcements],
  );
  const firstItemId = tickerItems[0]?.id ?? "";
  const tickerResetKey =
    tickerItems.length > 0 ? `${tickerItems.length}:${firstItemId}` : "empty";
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevResetKey, setPrevResetKey] = useState(tickerResetKey);

  if (prevResetKey !== tickerResetKey) {
    setPrevResetKey(tickerResetKey);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (tickerItems.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tickerItems.length);
    }, 12000);

    return () => window.clearInterval(timer);
  }, [tickerItems]);

  if (tickerItems.length === 0) {
    return null;
  }

  const current = tickerItems[activeIndex % tickerItems.length];
  const styles = getAnnouncementTypeStyles(current.type);
  const tickerText = `${current.title}: ${current.content}`;

  return (
    <div
      className={cn(
        "relative min-w-0 max-w-md overflow-hidden rounded-full px-4 py-2",
        styles.border,
        styles.bg,
        className,
      )}
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r from-surface-container-low to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-surface-container-low to-transparent" />

      <div className="announcement-ticker-track flex items-center gap-3 whitespace-nowrap">
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-label-sm",
            styles.badge,
          )}
        >
          <Icon name={styles.icon} size={14} />
          {getAnnouncementTypeLabel(current.type)}
        </span>
        <span className={cn("announcement-ticker-text text-body-md", styles.text)}>
          {tickerText}
        </span>
        <span className={cn("announcement-ticker-text text-body-md", styles.text)}>
          {tickerText}
        </span>
      </div>
    </div>
  );
}
