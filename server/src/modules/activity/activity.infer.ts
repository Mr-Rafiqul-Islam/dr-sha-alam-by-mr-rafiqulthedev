import {
  ActivityAction,
  ActivityEntityType,
} from "@prisma/client";
import type { Request } from "express";
import { routeParamString } from "../../utils/express-params.js";
import type { ActivityRecordInput } from "./activity.middleware.js";

type ResponseBody = Record<string, unknown>;

function asRecord(value: unknown): ResponseBody | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as ResponseBody;
}

function getRoutePattern(req: Request): string {
  const baseUrl = req.baseUrl ?? "";
  const routePath = req.route?.path ?? "";
  return `${baseUrl}${routePath}`;
}

function getNestedRecord(
  body: ResponseBody | null,
  key: string,
): ResponseBody | null {
  if (!body) {
    return null;
  }

  return asRecord(body[key]);
}

export function inferActivityFromRequest(
  req: Request,
  body: unknown,
): ActivityRecordInput | null {
  const pattern = getRoutePattern(req);
  const payload = asRecord(body);
  const id = routeParamString(req.params.id);

  switch (`${req.method.toUpperCase()} ${pattern}`) {
    case "POST /api/v1/client/appointments/":
    case "POST /api/v1/client/appointments": {
      const appointment = getNestedRecord(payload, "appointment");
      return {
        action: ActivityAction.APPOINTMENT_CREATED,
        entityType: ActivityEntityType.Appointment,
        entityId: appointment?.id ? String(appointment.id) : null,
        metadata: { patientName: appointment?.name },
      };
    }
    case "PATCH /api/v1/admin/appointments/:id/status": {
      const appointment = getNestedRecord(payload, "appointment");
      return {
        action: ActivityAction.APPOINTMENT_STATUS_CHANGED,
        entityType: ActivityEntityType.Appointment,
        entityId: appointment?.id ? String(appointment.id) : id,
        metadata: {
          to: appointment?.status,
          patientName: appointment?.name,
        },
      };
    }
    case "PATCH /api/v1/admin/contact-messages/:id/status": {
      const message = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.CONTACT_MESSAGE_STATUS_CHANGED,
        entityType: ActivityEntityType.ContactMessage,
        entityId: message?.id ? String(message.id) : id,
        metadata: {
          to: message?.status,
          senderName: message?.name,
        },
      };
    }
    case "POST /api/v1/admin/blogs/":
    case "POST /api/v1/admin/blogs": {
      const blog = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.BLOG_CREATED,
        entityType: ActivityEntityType.Blog,
        entityId: blog?.id ? String(blog.id) : null,
        metadata: { title: blog?.title },
      };
    }
    case "PATCH /api/v1/admin/blogs/:id": {
      const blog = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.BLOG_UPDATED,
        entityType: ActivityEntityType.Blog,
        entityId: blog?.id ? String(blog.id) : id,
        metadata: { title: blog?.title },
      };
    }
    case "PATCH /api/v1/admin/blogs/:id/featured": {
      const blog = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.BLOG_FEATURED_CHANGED,
        entityType: ActivityEntityType.Blog,
        entityId: blog?.id ? String(blog.id) : id,
        metadata: {
          title: blog?.title,
          featured: blog?.isFeatured,
        },
      };
    }
    case "POST /api/v1/admin/blogs/upload-image": {
      const imagePayload = getNestedRecord(payload, "payload");
      return {
        action: ActivityAction.BLOG_IMAGE_UPLOADED,
        entityType: ActivityEntityType.Blog,
        entityId: null,
        metadata: { imagePublicId: imagePayload?.imagePublicId },
      };
    }
    case "DELETE /api/v1/admin/blogs/upload-image": {
      const imagePayload = getNestedRecord(payload, "payload");
      return {
        action: ActivityAction.BLOG_IMAGE_DELETED,
        entityType: ActivityEntityType.Blog,
        entityId: null,
        metadata: {
          imagePublicId: imagePayload?.imagePublicId ?? req.body?.imagePublicId,
        },
      };
    }
    case "POST /api/v1/admin/appointment-schedules/":
    case "POST /api/v1/admin/appointment-schedules": {
      const schedule = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.SCHEDULE_CREATED,
        entityType: ActivityEntityType.AppointmentSchedule,
        entityId: schedule?.id ? String(schedule.id) : null,
        metadata: { date: schedule?.date },
      };
    }
    case "PATCH /api/v1/admin/appointment-schedules/:id": {
      const schedule = getNestedRecord(payload, "data");
      return {
        action: ActivityAction.SCHEDULE_UPDATED,
        entityType: ActivityEntityType.AppointmentSchedule,
        entityId: schedule?.id ? String(schedule.id) : id,
        metadata: { date: schedule?.date },
      };
    }
    case "DELETE /api/v1/admin/appointment-schedules/:id":
      return {
        action: ActivityAction.SCHEDULE_DELETED,
        entityType: ActivityEntityType.AppointmentSchedule,
        entityId: id,
      };
    case "PATCH /api/v1/admin/appointment-schedules/defaults":
      return {
        action: ActivityAction.SLOT_DEFAULTS_UPDATED,
        entityType: ActivityEntityType.AppointmentSlotDefaultConfig,
        entityId: null,
        metadata: {
          siteRef: req.body?.siteRef ?? req.query?.siteRef,
        },
      };
    default:
      return null;
  }
}
