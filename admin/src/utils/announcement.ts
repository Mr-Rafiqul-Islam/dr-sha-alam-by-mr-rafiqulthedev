import type {
  Announcement,
  AnnouncementFormValues,
  AnnouncementType,
} from "../types/announcement";

type ApiErrorShape = {
  data?: { message?: string };
  error?: string;
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const err = error as ApiErrorShape;
  if (typeof err.data?.message === "string") {
    return err.data.message;
  }
  if (typeof err.message === "string") {
    return err.message;
  }
  if (typeof err.error === "string") {
    return err.error;
  }

  return fallback;
}

export function getAnnouncementTypeLabel(type: AnnouncementType): string {
  switch (type) {
    case "INFO":
      return "Info";
    case "WARNING":
      return "Warning";
    case "URGENT":
      return "Urgent";
    default:
      return type;
  }
}

export function getAnnouncementTypeStyles(type: AnnouncementType) {
  switch (type) {
    case "WARNING":
      return {
        badge: "bg-tertiary-container text-white",
        border: "border-tertiary/40",
        bg: "bg-tertiary-container/20",
        icon: "warning",
        text: "text-on-surface",
      };
    case "URGENT":
      return {
        badge: "bg-error-container text-on-error-container",
        border: "border-error/40",
        bg: "bg-error-container/20",
        icon: "error",
        text: "text-on-surface",
      };
    default:
      return {
        badge: "bg-primary-container text-on-primary-container",
        border: "border-primary/30",
        bg: "bg-primary-container/15",
        icon: "info",
        text: "text-on-surface",
      };
  }
}

export function formatAnnouncementDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function isAnnouncementFromToday(createdAt: string): boolean {
  const date = new Date(createdAt);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export function getDefaultAnnouncementFormValues(): AnnouncementFormValues {
  return {
    title: "",
    content: "",
    type: "INFO",
    status: "ACTIVE",
  };
}

export function announcementToFormValues(
  announcement: Announcement,
): AnnouncementFormValues {
  return {
    title: announcement.title,
    content: announcement.content,
    type: announcement.type,
    status: announcement.status,
  };
}

export function pickTickerAnnouncements(
  announcements: Announcement[],
): Announcement[] {
  return announcements;
}

export function canManageAnnouncements(role: string | undefined): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "MANAGER";
}
