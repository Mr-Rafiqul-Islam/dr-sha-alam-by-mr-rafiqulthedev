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
