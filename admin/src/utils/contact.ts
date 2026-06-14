import type { BadgeVariant } from "../components/common/Badge";
import type {
  ContactMessage,
  ContactMessageFilterState,
  ContactMessageStatus,
} from "../types/contact";
import { getInitials } from "./appointment";

export { getInitials };

export const CONTACT_STATUS_OPTIONS: {
  value: ContactMessageStatus;
  label: string;
}[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "READ", label: "Resolved" },
];

export function getStatusLabel(status: ContactMessageStatus): string {
  const labels: Record<ContactMessageStatus, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    READ: "Resolved",
  };

  return labels[status];
}

export function getStatusBadgeVariant(status: ContactMessageStatus): BadgeVariant {
  const variants: Record<ContactMessageStatus, BadgeVariant> = {
    PENDING: "pending",
    IN_PROGRESS: "attend",
    READ: "confirmed",
  };

  return variants[status];
}

export function formatContactDate(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatContactTime(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatContactDateTime(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function filterContactMessages(
  messages: ContactMessage[],
  filters: ContactMessageFilterState,
): ContactMessage[] {
  const nameQuery = filters.name.trim().toLowerCase();
  const subjectQuery = filters.subject.trim().toLowerCase();

  return messages.filter((message) => {
    if (nameQuery && !message.name.toLowerCase().includes(nameQuery)) {
      return false;
    }

    if (subjectQuery && !message.subject.toLowerCase().includes(subjectQuery)) {
      return false;
    }

    if (filters.status && message.status !== filters.status) {
      return false;
    }

    return true;
  });
}

function escapeCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export function exportContactMessagesCsv(messages: ContactMessage[]): void {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Subject",
    "Status",
    "Message",
    "Created At",
  ];

  const rows = messages.map((message) => [
    message.name,
    message.email ?? "",
    message.phone,
    message.subject,
    getStatusLabel(message.status),
    message.message ?? "",
    formatContactDateTime(message.createdAt),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvValue(cell)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `contact-messages-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}
