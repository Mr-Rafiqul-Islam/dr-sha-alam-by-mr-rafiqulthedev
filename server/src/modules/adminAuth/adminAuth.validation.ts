const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const OTP_REGEX = /^\d{6}$/;

export class AdminAuthValidationError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
    this.name = "AdminAuthValidationError";
  }
}

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminVerifyOtpInput = {
  challengeId: string;
  otp: string;
};

export type AdminResendOtpInput = {
  challengeId: string;
};

function asRecord(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== "object") {
    throw new AdminAuthValidationError("Invalid request body");
  }
  return body as Record<string, unknown>;
}

function parseChallengeId(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AdminAuthValidationError("Challenge ID is required");
  }

  const challengeId = value.trim();
  if (!UUID_REGEX.test(challengeId)) {
    throw new AdminAuthValidationError("Invalid challenge ID");
  }

  return challengeId;
}

export function parseAdminLoginBody(body: unknown): AdminLoginInput {
  const record = asRecord(body);
  const emailRaw = record.email;
  const passwordRaw = record.password;

  if (typeof emailRaw !== "string" || !emailRaw.trim()) {
    throw new AdminAuthValidationError("Email is required");
  }

  const email = emailRaw.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email)) {
    throw new AdminAuthValidationError("Invalid email address");
  }

  if (typeof passwordRaw !== "string" || !passwordRaw) {
    throw new AdminAuthValidationError("Password is required");
  }

  return { email, password: passwordRaw };
}

export function parseAdminVerifyOtpBody(body: unknown): AdminVerifyOtpInput {
  const record = asRecord(body);
  const challengeId = parseChallengeId(record.challengeId);
  const otpRaw = record.otp;

  if (typeof otpRaw !== "string" || !otpRaw.trim()) {
    throw new AdminAuthValidationError("Verification code is required");
  }

  const otp = otpRaw.trim();
  if (!OTP_REGEX.test(otp)) {
    throw new AdminAuthValidationError(
      "Verification code must be exactly six digits",
    );
  }

  return { challengeId, otp };
}

export function parseAdminResendOtpBody(body: unknown): AdminResendOtpInput {
  const record = asRecord(body);
  return { challengeId: parseChallengeId(record.challengeId) };
}
