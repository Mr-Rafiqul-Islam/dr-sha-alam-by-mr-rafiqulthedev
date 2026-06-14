import { ContactMessageStatus, Prisma } from "@prisma/client";
import type { Response } from "express";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONTACT_MESSAGE_STATUSES = new Set<string>(
  Object.values(ContactMessageStatus),
);

export class ContactValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "ContactValidationError";
  }
}

export function parseOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parseRequiredString(value: unknown, fieldName: string): string {
  const text = parseOptionalString(value);
  if (!text) {
    throw new ContactValidationError(`${fieldName} is required`);
  }
  return text;
}

export function parseEmail(value: unknown): string | null {
  const email = parseOptionalString(value);
  if (email && !EMAIL_REGEX.test(email)) {
    throw new ContactValidationError("Invalid email address");
  }
  return email;
}

export function parseContactMessageStatus(value: unknown): ContactMessageStatus {
  if (typeof value !== "string" || !CONTACT_MESSAGE_STATUSES.has(value)) {
    throw new ContactValidationError("Invalid contact message status");
  }
  return value as ContactMessageStatus;
}

export function parseOptionalContactMessageStatus(
  value: unknown,
): ContactMessageStatus | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return parseContactMessageStatus(value);
}

export function handleContactError(
  res: Response,
  error: unknown,
  fallbackMessage: string,
) {
  if (error instanceof ContactValidationError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Contact message not found" });
    }
  }

  console.error(error);
  return res.status(500).json({ success: false, message: fallbackMessage });
}
