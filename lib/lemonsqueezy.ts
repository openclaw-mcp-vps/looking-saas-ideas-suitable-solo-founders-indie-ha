import { createHmac, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "indie_idea_access";

function getSigningSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "";
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function getStripePaymentLink(): string | undefined {
  return process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;
}

export function createAccessCookieValue(email: string): string {
  const secret = getSigningSecret();
  const normalizedEmail = email.trim().toLowerCase();

  if (!secret) {
    return `paid:${normalizedEmail}`;
  }

  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const payload = `${normalizedEmail}|${expiresAt}`;
  const signature = signPayload(payload, secret);

  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function verifyAccessCookieValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  const secret = getSigningSecret();

  if (!secret) {
    return cookieValue.startsWith("paid:");
  }

  let decoded: string;

  try {
    decoded = Buffer.from(cookieValue, "base64url").toString("utf8");
  } catch {
    return false;
  }

  const [email, expiresAtRaw, signature] = decoded.split("|");
  const expiresAt = Number(expiresAtRaw);

  if (!email || !Number.isFinite(expiresAt) || !signature) {
    return false;
  }

  if (expiresAt < Date.now()) {
    return false;
  }

  const expected = signPayload(`${email}|${expiresAtRaw}`, secret);
  return safeCompare(signature, expected);
}

export function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader || !secret) {
    return false;
  }

  const fields = signatureHeader
    .split(",")
    .map((part) => part.trim())
    .map((part) => {
      const [key, value] = part.split("=");
      return { key, value };
    });

  const timestamp = fields.find((field) => field.key === "t")?.value;
  const signatures = fields
    .filter((field) => field.key === "v1" && Boolean(field.value))
    .map((field) => field.value as string);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = signPayload(signedPayload, secret);

  return signatures.some((signature) => safeCompare(signature, expected));
}
