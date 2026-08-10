export type ActivityAction =
  | "APPOINTMENT_CREATED"
  | "APPOINTMENT_STATUS_CHANGED"
  | "APPOINTMENT_DELETED"
  | "CONTACT_MESSAGE_STATUS_CHANGED"
  | "CONTACT_MESSAGE_DELETED"
  | "BLOG_CREATED"
  | "BLOG_UPDATED"
  | "BLOG_DELETED"
  | "BLOG_FEATURED_CHANGED"
  | "BLOG_IMAGE_UPLOADED"
  | "BLOG_IMAGE_DELETED"
  | "SCHEDULE_CREATED"
  | "SCHEDULE_UPDATED"
  | "SCHEDULE_DELETED"
  | "SLOT_DEFAULTS_UPDATED"
  | "APPOINTMENT_REVENUE_FEES_UPDATED";

export type ActivityEntityType =
  | "Appointment"
  | "ContactMessage"
  | "Blog"
  | "AppointmentSchedule"
  | "AppointmentSlotDefaultConfig"
  | "AppointmentRevenueFee";

export type TraceableStaffRole = "SUPPORT" | "EDITOR";

export type ActivityActor = {
  id: string;
  name: string | null;
  email: string | null;
  role: TraceableStaffRole;
};

export type ActivityLogEntry = {
  id: string;
  actor: ActivityActor;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type TraceableStaffMember = {
  id: string;
  name: string | null;
  email: string | null;
  role: TraceableStaffRole;
  activityCount: number;
};

export type ActivityFeedResponse = {
  success: boolean;
  data: ActivityLogEntry[];
  nextCursor: string | null;
};

export type TraceableStaffResponse = {
  success: boolean;
  data: TraceableStaffMember[];
};

export type ActivityFeedParams = {
  actorId?: string;
  limit?: number;
  cursor?: string;
};
