export type ContactMessageStatus = "PENDING" | "IN_PROGRESS" | "READ";

import type { PendingDeleteMeta } from "./pendingDelete";

export type ContactMessage = PendingDeleteMeta & {
  id: string;
  status: ContactMessageStatus;
  name: string;
  email: string | null;
  phone: string;
  subject: string;
  message: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactMessageListResponse = {
  success: boolean;
  data: ContactMessage[];
};

export type ContactMessageResponse = {
  success: boolean;
  data: ContactMessage;
  message?: string;
};

export type ContactMessageFilterState = {
  name: string;
  subject: string;
  status: "" | ContactMessageStatus;
};

export type UpdateContactMessageStatusPayload = {
  id: string;
  status: ContactMessageStatus;
};
