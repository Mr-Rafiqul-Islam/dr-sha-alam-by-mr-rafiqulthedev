import nodemailer from "nodemailer";
import { isNovocomConfigured, sendNovocomSms } from "../../lib/novocomSms.js";
import { maskEmailDestination, maskPhoneDestination } from "./adminAuth.otp.js";

export class AdminOtpDeliveryError extends Error {
  constructor(message = "Failed to send verification code") {
    super(message);
    this.name = "AdminOtpDeliveryError";
  }
}

type SendAdminLoginOtpInput = {
  destinationEmail: string | null | undefined;
  destinationPhone: string | null | undefined;
  otp: string;
  recipientName?: string | null;
};

export type AdminOtpDeliveryResult = {
  maskedDestination: string;
  channels: Array<"sms" | "email">;
};

function resolveDestinationEmail(
  destinationEmail: string | null | undefined,
): string | null {
  const primary = destinationEmail?.trim();
  if (primary) {
    return primary;
  }

  return process.env.OTP_DEV_EMAIL?.trim() || null;
}

function createMailTransport() {
  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!host || !portRaw || !user || !pass) {
    return null;
  }

  const port = Number.parseInt(portRaw, 10);
  if (!Number.isFinite(port) || port <= 0) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendOtpEmail(params: {
  to: string;
  otp: string;
  recipientName?: string | null;
}): Promise<void> {
  const from = process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim();
  const transport = createMailTransport();

  if (!from || !transport) {
    throw new AdminOtpDeliveryError(
      "Email delivery is not configured (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)",
    );
  }

  const greetingName = params.recipientName?.trim() || "Admin";

  await transport.sendMail({
    from,
    to: params.to,
    subject: "Your admin login verification code",
    text: [
      `Hello ${greetingName},`,
      "",
      `Your Dr. Shah Alam admin login verification code is: ${params.otp}`,
      "",
      "This code expires shortly. If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>Hello ${escapeHtml(greetingName)},</p>
      <p>Your Dr. Shah Alam admin login verification code is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;">${escapeHtml(params.otp)}</p>
      <p>This code expires shortly. If you did not request this, you can ignore this email.</p>
    `,
  });
}

/**
 * Prefer Novocom SMS when the staff user has a phone number.
 * Falls back to SMTP email when SMS is unavailable.
 */
export async function sendAdminLoginOtp(
  input: SendAdminLoginOtpInput,
): Promise<AdminOtpDeliveryResult> {
  const phone = input.destinationPhone?.trim() || null;
  const email = resolveDestinationEmail(input.destinationEmail);
  const channels: Array<"sms" | "email"> = [];
  let maskedDestination = "***";

  if (phone && isNovocomConfigured()) {
    try {
      await sendNovocomSms({
        phone,
        message: `Dr. Shah Alam admin login code: ${input.otp}. Valid for a few minutes. Do not share.`,
      });
      channels.push("sms");
      maskedDestination = maskPhoneDestination(phone);
    } catch (error) {
      console.error("Failed to send admin login OTP SMS:", error);
      throw new AdminOtpDeliveryError("Failed to send verification code via SMS");
    }
  }

  if (channels.length === 0) {
    if (!email) {
      throw new AdminOtpDeliveryError(
        "No phone or email destination available for verification code",
      );
    }

    try {
      await sendOtpEmail({
        to: email,
        otp: input.otp,
        recipientName: input.recipientName,
      });
      channels.push("email");
      maskedDestination = maskEmailDestination(email);
    } catch (error) {
      console.error("Failed to send admin login OTP email:", error);
      throw new AdminOtpDeliveryError();
    }
  }

  return { maskedDestination, channels };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
