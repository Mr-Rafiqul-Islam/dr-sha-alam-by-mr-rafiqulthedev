/**
 * Admin contact messages API.
 *
 * Base: `/api/v1/admin/contact-messages` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { prisma } from "../../../config/db.js";
import {
  handleContactError,
  parseContactMessageStatus,
  parseOptionalContactMessageStatus,
} from "../../../modules/contact/contact.utils.js";
import { routeParamString } from "../../../utils/express-params.js";

export async function listContactMessages(req: Request, res: Response) {
  try {
    const status = parseOptionalContactMessageStatus(req.query.status);

    const contactMessages = await prisma.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: contactMessages,
    });
  } catch (error) {
    return handleContactError(res, error, "Failed to fetch contact messages");
  }
}

export async function getContactMessageById(req: Request, res: Response) {
  const contactMessageId = routeParamString(req.params.id);
  if (!contactMessageId) {
    return res.status(400).json({ success: false, message: "Invalid contact message id" });
  }

  try {
    const contactMessage = await prisma.contactMessage.findUnique({
      where: { id: contactMessageId },
    });

    if (!contactMessage) {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }

    return res.status(200).json({
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    return handleContactError(res, error, "Failed to fetch contact message");
  }
}

export async function updateContactMessageStatus(req: Request, res: Response) {
  const contactMessageId = routeParamString(req.params.id);
  if (!contactMessageId) {
    return res.status(400).json({ success: false, message: "Invalid contact message id" });
  }

  try {
    const status = parseContactMessageStatus(req.body.status);

    const contactMessage = await prisma.contactMessage.update({
      where: { id: contactMessageId },
      data: { status },
    });

    return res.status(200).json({
      success: true,
      message: "Contact message status updated successfully",
      data: contactMessage,
    });
  } catch (error) {
    return handleContactError(res, error, "Failed to update contact message status");
  }
}

export async function deleteContactMessage(req: Request, res: Response) {
  const contactMessageId = routeParamString(req.params.id);
  if (!contactMessageId) {
    return res.status(400).json({ success: false, message: "Invalid contact message id" });
  }

  try {
    await prisma.contactMessage.delete({ where: { id: contactMessageId } });

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    return handleContactError(res, error, "Failed to delete contact message");
  }
}
