const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function parseAdminLoginBody(body: unknown): AdminLoginInput {
  if (body === null || typeof body !== "object") {
    throw new AdminAuthValidationError("Invalid request body");
  }

  const record = body as Record<string, unknown>;
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
