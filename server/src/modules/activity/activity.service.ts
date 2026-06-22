import {
  ActivityAction,
  ActivityEntityType,
  DeleteRequestEntityType,
  UserRole,
  type Prisma,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import type { AdminRequestUser } from "../../types/express.js";
import { buildActivitySummary } from "./activity.serializer.js";
import type {
  ActivityMetadata,
  LogActivityInput,
  SerializedActivityLog,
  TraceableStaffMember,
} from "./activity.types.js";

const STAFF_ACTIVITY_WINDOW_DAYS = 30;
const DEFAULT_ACTIVITY_LIMIT = 20;
const MAX_ACTIVITY_LIMIT = 100;

function isTraceableRole(role: UserRole): role is "SUPPORT" | "EDITOR" {
  return role === UserRole.SUPPORT || role === UserRole.EDITOR;
}

export function shouldLogActivity(actor: AdminRequestUser | undefined): actor is AdminRequestUser {
  return Boolean(actor && isTraceableRole(actor.role));
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  if (!shouldLogActivity(input.actor)) {
    return;
  }

  const summary = buildActivitySummary(
    input.action,
    input.actor.name,
    input.actor.email,
    input.metadata ?? {},
  );

  await prisma.activityLog.create({
    data: {
      actorId: input.actor.id,
      actorRole: input.actor.role,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      summary,
      metadata: (input.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
}

export function logActivitySafe(input: LogActivityInput): void {
  void logActivity(input).catch((error) => {
    console.error("Failed to write activity log:", error);
  });
}

function approverLabel(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    return trimmedName;
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    return trimmedEmail;
  }

  return "Admin";
}

export async function logApprovedDeleteActivity(input: {
  requester: AdminRequestUser;
  approver: { name: string | null; email: string | null };
  entityType: DeleteRequestEntityType;
  entityId: string;
  entitySummary: { title: string; subtitle?: string | null };
}): Promise<void> {
  if (!shouldLogActivity(input.requester)) {
    return;
  }

  const approvedByName = approverLabel(input.approver.name, input.approver.email);
  let action: ActivityAction;
  let activityEntityType: ActivityEntityType;
  let metadata: ActivityMetadata;

  switch (input.entityType) {
    case DeleteRequestEntityType.APPOINTMENT:
      action = ActivityAction.APPOINTMENT_DELETED;
      activityEntityType = ActivityEntityType.Appointment;
      metadata = {
        patientName: input.entitySummary.title,
        approvedByName,
      };
      break;
    case DeleteRequestEntityType.BLOG:
      action = ActivityAction.BLOG_DELETED;
      activityEntityType = ActivityEntityType.Blog;
      metadata = {
        title: input.entitySummary.title,
        approvedByName,
      };
      break;
    case DeleteRequestEntityType.CONTACT_MESSAGE:
      action = ActivityAction.CONTACT_MESSAGE_DELETED;
      activityEntityType = ActivityEntityType.ContactMessage;
      metadata = {
        senderName: input.entitySummary.subtitle ?? input.entitySummary.title,
        approvedByName,
      };
      break;
    default:
      return;
  }

  await logActivity({
    actor: input.requester,
    action,
    entityType: activityEntityType,
    entityId: input.entityId,
    metadata,
  });
}

function serializeActivityRow(
  row: Prisma.ActivityLogGetPayload<{ include: { actor: true } }>,
): SerializedActivityLog {
  return {
    id: row.id,
    actor: {
      id: row.actor.id,
      name: row.actor.name,
      email: row.actor.email,
      role: row.actor.role,
    },
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    summary: row.summary,
    metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listActivities(params: {
  actorId?: string;
  limit?: number;
  cursor?: string;
}): Promise<{ items: SerializedActivityLog[]; nextCursor: string | null }> {
  const limit = Math.min(
    Math.max(params.limit ?? DEFAULT_ACTIVITY_LIMIT, 1),
    MAX_ACTIVITY_LIMIT,
  );

  const where: Prisma.ActivityLogWhereInput = {
    actorRole: { in: [UserRole.SUPPORT, UserRole.EDITOR] },
  };

  if (params.actorId) {
    where.actorId = params.actorId;
  }

  if (params.cursor) {
    where.createdAt = { lt: new Date(params.cursor) };
  }

  const rows = await prisma.activityLog.findMany({
    where,
    include: { actor: true },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
  });

  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore
    ? items[items.length - 1]?.createdAt.toISOString() ?? null
    : null;

  return {
    items: items.map(serializeActivityRow),
    nextCursor,
  };
}

export async function listTraceableStaff(): Promise<TraceableStaffMember[]> {
  const since = new Date();
  since.setDate(since.getDate() - STAFF_ACTIVITY_WINDOW_DAYS);

  const staff = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.SUPPORT, UserRole.EDITOR] },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      _count: {
        select: {
          activityLogs: {
            where: { createdAt: { gte: since } },
          },
        },
      },
    },
    orderBy: [{ role: "asc" }, { name: "asc" }, { email: "asc" }],
  });

  return staff.map((member) => ({
    id: member.id,
    name: member.name,
    email: member.email,
    role: member.role,
    activityCount: member._count.activityLogs,
  }));
}

export { ActivityAction, ActivityEntityType };
