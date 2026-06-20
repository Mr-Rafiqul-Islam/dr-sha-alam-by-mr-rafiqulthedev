import type { ActivityAction } from "@prisma/client";
import type { ActivityMetadata } from "./activity.types.js";

function actorLabel(name: string | null | undefined, email: string | null | undefined): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    return trimmedName;
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    return trimmedEmail;
  }

  return "Staff member";
}

function formatDate(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }

  return String(value ?? "");
}

export function buildActivitySummary(
  action: ActivityAction,
  actorName: string | null | undefined,
  actorEmail: string | null | undefined,
  metadata: ActivityMetadata = {},
): string {
  const who = actorLabel(actorName, actorEmail);

  switch (action) {
    case "APPOINTMENT_CREATED": {
      const patientName = metadata.patientName ? String(metadata.patientName) : "a patient";
      return `${who} created appointment for ${patientName}`;
    }
    case "APPOINTMENT_STATUS_CHANGED": {
      const patientName = metadata.patientName ? String(metadata.patientName) : "a patient";
      const from = metadata.from ? String(metadata.from) : "unknown";
      const to = metadata.to ? String(metadata.to) : "unknown";
      return `${who} updated appointment status for ${patientName} from ${from} to ${to}`;
    }
    case "APPOINTMENT_DELETED": {
      const patientName = metadata.patientName ? String(metadata.patientName) : "a patient";
      return `${who} deleted appointment for ${patientName}`;
    }
    case "CONTACT_MESSAGE_STATUS_CHANGED": {
      const senderName = metadata.senderName ? String(metadata.senderName) : "a contact";
      const to = metadata.to ? String(metadata.to) : "updated";
      return `${who} marked contact message from ${senderName} as ${to}`;
    }
    case "CONTACT_MESSAGE_DELETED": {
      const senderName = metadata.senderName ? String(metadata.senderName) : "a contact";
      return `${who} deleted contact message from ${senderName}`;
    }
    case "BLOG_CREATED": {
      const title = metadata.title ? String(metadata.title) : "an article";
      return `${who} created article "${title}"`;
    }
    case "BLOG_UPDATED": {
      const title = metadata.title ? String(metadata.title) : "an article";
      return `${who} updated article "${title}"`;
    }
    case "BLOG_DELETED": {
      const title = metadata.title ? String(metadata.title) : "an article";
      return `${who} deleted article "${title}"`;
    }
    case "BLOG_FEATURED_CHANGED": {
      const title = metadata.title ? String(metadata.title) : "an article";
      const featured = metadata.featured === true;
      return featured
        ? `${who} featured article "${title}"`
        : `${who} removed featured status from article "${title}"`;
    }
    case "BLOG_IMAGE_UPLOADED":
      return `${who} uploaded a blog image`;
    case "BLOG_IMAGE_DELETED":
      return `${who} deleted a blog image`;
    case "SCHEDULE_CREATED": {
      const date = formatDate(metadata.date);
      return `${who} created schedule for ${date}`;
    }
    case "SCHEDULE_UPDATED": {
      const date = formatDate(metadata.date);
      return `${who} updated schedule for ${date}`;
    }
    case "SCHEDULE_DELETED": {
      const date = formatDate(metadata.date);
      return `${who} deleted schedule for ${date}`;
    }
    case "SLOT_DEFAULTS_UPDATED":
      return `${who} updated appointment slot defaults`;
    default:
      return `${who} performed ${action}`;
  }
}
