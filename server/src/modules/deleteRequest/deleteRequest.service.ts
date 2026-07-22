import {
  DeleteRequestEntityType,
  DeleteRequestStatus,
} from "@prisma/client";
import { prisma } from "../../config/db.js";
import { logApprovedDeleteActivity } from "../activity/activity.service.js";
import {
  canDeleteImmediately,
  DeleteRequestError,
  type DeleteRequestListItem,
  type PendingDeleteMeta,
  shouldHidePendingDeletesFromLists,
} from "./deleteRequest.types.js";

async function getEntitySummary(
  entityType: DeleteRequestEntityType,
  entityId: string,
): Promise<{ title: string; subtitle?: string | null } | null> {
  switch (entityType) {
    case DeleteRequestEntityType.BLOG: {
      const blog = await prisma.blog.findUnique({
        where: { id: entityId },
        select: { title: true, author: true },
      });
      if (!blog) return null;
      return {
        title: blog.title,
        subtitle: blog.author.length > 0 ? blog.author.join(", ") : null,
      };
    }
    case DeleteRequestEntityType.APPOINTMENT: {
      const appointment = await prisma.appointment.findUnique({
        where: { id: entityId },
        select: { name: true, phone: true, appointmentDate: true },
      });
      if (!appointment) return null;
      return {
        title: appointment.name,
        subtitle: `${appointment.phone} · ${appointment.appointmentDate.toISOString().slice(0, 10)}`,
      };
    }
    case DeleteRequestEntityType.CONTACT_MESSAGE: {
      const message = await prisma.contactMessage.findUnique({
        where: { id: entityId },
        select: { name: true, subject: true },
      });
      if (!message) return null;
      return { title: message.subject, subtitle: message.name };
    }
    default:
      return null;
  }
}

async function assertEntityExists(
  entityType: DeleteRequestEntityType,
  entityId: string,
): Promise<void> {
  const summary = await getEntitySummary(entityType, entityId);
  if (!summary) {
    throw new DeleteRequestError("Entity not found", 404);
  }
}

export async function getPendingDeleteEntityMap(
  entityType: DeleteRequestEntityType,
): Promise<Map<string, string>> {
  const requests = await prisma.deleteRequest.findMany({
    where: {
      entityType,
      status: DeleteRequestStatus.PENDING,
    },
    select: { id: true, entityId: true },
  });

  return new Map(requests.map((request) => [request.entityId, request.id]));
}

export async function getPendingDeleteEntityIds(
  entityType: DeleteRequestEntityType,
): Promise<string[]> {
  return Array.from((await getPendingDeleteEntityMap(entityType)).keys());
}

export async function buildExcludePendingDeletesWhere(
  entityType: DeleteRequestEntityType,
): Promise<{ id: { notIn: string[] } } | Record<string, never>> {
  const entityIds = await getPendingDeleteEntityIds(entityType);
  if (entityIds.length === 0) {
    return {};
  }

  return { id: { notIn: entityIds } };
}

export async function getPendingDeleteRequestId(
  entityType: DeleteRequestEntityType,
  entityId: string,
): Promise<string | null> {
  const pending = await prisma.deleteRequest.findFirst({
    where: {
      entityType,
      entityId,
      status: DeleteRequestStatus.PENDING,
    },
    select: { id: true },
  });

  return pending?.id ?? null;
}

export async function isEntityPendingDelete(
  entityType: DeleteRequestEntityType,
  entityId: string,
): Promise<boolean> {
  return (await getPendingDeleteRequestId(entityType, entityId)) != null;
}

export function annotatePendingDeleteMeta<T extends { id: string }>(
  items: T[],
  pendingMap: Map<string, string>,
): Array<T & PendingDeleteMeta> {
  return items.map((item) => {
    const deleteRequestId = pendingMap.get(item.id);
    if (!deleteRequestId) {
      return item;
    }

    return {
      ...item,
      pendingDelete: true,
      deleteRequestId,
    };
  });
}

export function buildPendingDeleteListWhere<T extends { id?: unknown }>(
  hidePendingDeletes: boolean,
  pendingMap: Map<string, string>,
): { id: { notIn: string[] } } | Record<string, never> {
  if (!hidePendingDeletes || pendingMap.size === 0) {
    return {};
  }

  return { id: { notIn: Array.from(pendingMap.keys()) } };
}

export function withPendingDeleteMeta<T extends { id: string }>(
  item: T,
  pendingMap: Map<string, string>,
): T & PendingDeleteMeta {
  const deleteRequestId = pendingMap.get(item.id);
  if (!deleteRequestId) {
    return item;
  }

  return {
    ...item,
    pendingDelete: true,
    deleteRequestId,
  };
}

export { shouldHidePendingDeletesFromLists };

export async function resolvePendingDeleteRequestsForEntity(
  entityType: DeleteRequestEntityType,
  entityId: string,
  reviewedById: string,
): Promise<void> {
  await prisma.deleteRequest.updateMany({
    where: {
      entityType,
      entityId,
      status: DeleteRequestStatus.PENDING,
    },
    data: {
      status: DeleteRequestStatus.APPROVED,
      reviewedById,
      reviewedAt: new Date(),
    },
  });
}

export async function createDeleteRequest(
  entityType: DeleteRequestEntityType,
  entityId: string,
  requestedById: string,
) {
  await assertEntityExists(entityType, entityId);

  const existingPending = await prisma.deleteRequest.findFirst({
    where: {
      entityType,
      entityId,
      status: DeleteRequestStatus.PENDING,
    },
  });

  if (existingPending) {
    return { request: existingPending, alreadyPending: true };
  }

  const request = await prisma.deleteRequest.create({
    data: {
      entityType,
      entityId,
      requestedById,
      status: DeleteRequestStatus.PENDING,
    },
  });

  return { request, alreadyPending: false };
}

export async function listPendingDeleteRequests(
  entityType?: DeleteRequestEntityType,
): Promise<DeleteRequestListItem[]> {
  const requests = await prisma.deleteRequest.findMany({
    where: {
      status: DeleteRequestStatus.PENDING,
      ...(entityType ? { entityType } : {}),
    },
    include: {
      requestedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { requestedAt: "desc" },
  });

  const items: DeleteRequestListItem[] = [];

  for (const request of requests) {
    const entitySummary = await getEntitySummary(
      request.entityType,
      request.entityId,
    );

    if (!entitySummary) {
      continue;
    }

    items.push({
      id: request.id,
      entityType: request.entityType,
      entityId: request.entityId,
      status: request.status,
      requestedAt: request.requestedAt.toISOString(),
      requestedBy: request.requestedBy,
      entitySummary,
    });
  }

  return items;
}

export async function approveDeleteRequest(id: string, reviewedById: string) {
  const request = await prisma.deleteRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new DeleteRequestError("Delete request not found", 404);
  }

  if (request.status !== DeleteRequestStatus.PENDING) {
    throw new DeleteRequestError("Delete request is no longer pending", 409);
  }

  const [entitySummary, requester, approver] = await Promise.all([
    getEntitySummary(request.entityType, request.entityId),
    prisma.user.findUnique({ where: { id: request.requestedById } }),
    prisma.user.findUnique({
      where: { id: reviewedById },
      select: { name: true, email: true },
    }),
  ]);

  if (!entitySummary) {
    throw new DeleteRequestError("Entity not found", 404);
  }

  await prisma.$transaction(async (tx) => {
    switch (request.entityType) {
      case DeleteRequestEntityType.BLOG:
        await tx.blog.delete({ where: { id: request.entityId } });
        break;
      case DeleteRequestEntityType.APPOINTMENT:
        await tx.appointment.delete({ where: { id: request.entityId } });
        break;
      case DeleteRequestEntityType.CONTACT_MESSAGE:
        await tx.contactMessage.delete({ where: { id: request.entityId } });
        break;
    }

    await tx.deleteRequest.update({
      where: { id },
      data: {
        status: DeleteRequestStatus.APPROVED,
        reviewedById,
        reviewedAt: new Date(),
      },
    });
  });

  if (requester) {
    const { password: _password, ...requesterWithoutPassword } = requester;
    void logApprovedDeleteActivity({
      requester: requesterWithoutPassword,
      approver: approver ?? { name: null, email: null },
      entityType: request.entityType,
      entityId: request.entityId,
      entitySummary,
    }).catch((error) => {
      console.error("Failed to write approved delete activity log:", error);
    });
  }

  return request;
}

export async function rejectDeleteRequest(id: string, reviewedById: string) {
  const request = await prisma.deleteRequest.findUnique({
    where: { id },
  });

  if (!request) {
    throw new DeleteRequestError("Delete request not found", 404);
  }

  if (request.status !== DeleteRequestStatus.PENDING) {
    throw new DeleteRequestError("Delete request is no longer pending", 409);
  }

  return prisma.deleteRequest.update({
    where: { id },
    data: {
      status: DeleteRequestStatus.REJECTED,
      reviewedById,
      reviewedAt: new Date(),
    },
  });
}

export { canDeleteImmediately, DeleteRequestEntityType };
