/**
 * Public contact messages API.
 *
 * Base: `POST /api/v1/client/contact-messages` (see `routes/index.ts`).
 */
import type { Request, Response } from "express";
import { prisma } from "../../../config/db.js";
import {
  handleContactError,
  parseEmail,
  parseOptionalString,
  parseRequiredString,
} from "../../../modules/contact/contact.utils.js";

export async function createContactMessage(req: Request, res: Response) {
  try {
    const name = parseRequiredString(req.body.name, "name");
    const phone = parseRequiredString(req.body.phone, "phone");
    const subject = parseRequiredString(req.body.subject, "subject");
    const message = parseOptionalString(req.body.message);
    const email = parseEmail(req.body.email);

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        phone,
        subject,
        message,
        email,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      data: {
        id: contactMessage.id,
        name: contactMessage.name,
        phone: contactMessage.phone,
        email: contactMessage.email,
        subject: contactMessage.subject,
        message: contactMessage.message,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    return handleContactError(res, error, "Failed to submit contact message");
  }
}
