import "server-only";

import { APIError } from "better-auth/api";

const RAW_ALLOWED_DOMAINS = process.env.AUTH_ALLOWED_EMAIL_DOMAINS ?? "";
const RAW_ALLOWED_EMAILS = process.env.AUTH_ALLOWED_EMAILS ?? "";

const ALLOWED_DOMAINS = RAW_ALLOWED_DOMAINS.split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const ALLOWED_EMAILS = RAW_ALLOWED_EMAILS.split(",")
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

const ALLOW_ALL =
  ALLOWED_DOMAINS.includes("*") || ALLOWED_EMAILS.includes("*");

export class EmailNotAllowedError extends APIError {
  readonly attemptedEmail: string | undefined | null;

  constructor(email: string | undefined | null) {
    super("FORBIDDEN", {
      message: "EMAIL_NOT_ALLOWED",
    });
    this.name = "EmailNotAllowedError";
    this.attemptedEmail = email;
  }
}

export function isEmailAllowed(email: string | undefined | null): boolean {
  if (ALLOW_ALL) {
    return true;
  }

  if (!email) {
    return false;
  }

  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  if (ALLOWED_EMAILS.includes(normalized)) {
    return true;
  }

  const domain = normalized.split("@")[1];
  if (!domain) {
    return false;
  }

  return ALLOWED_DOMAINS.includes(domain);
}

export function assertEmailAllowed(email: string | undefined | null): void {
  if (!isEmailAllowed(email)) {
    throw new EmailNotAllowedError(email);
  }
}
