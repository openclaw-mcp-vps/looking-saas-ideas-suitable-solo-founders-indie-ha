import crypto from "node:crypto";

import type { PurchaseRecord } from "@/types";

type WebhookAttributes = Record<string, unknown>;

export interface LemonSqueezyWebhookPayload {
  meta?: {
    event_name?: string;
  };
  data?: {
    id?: string;
    attributes?: WebhookAttributes;
  };
}

const ACTIVE_EVENTS = new Set([
  "order_created",
  "subscription_created",
  "subscription_payment_success",
  "subscription_payment_recovered"
]);

const CANCELLED_EVENTS = new Set([
  "subscription_cancelled",
  "subscription_expired",
  "subscription_refunded",
  "order_refunded"
]);

function getString(attributes: WebhookAttributes, key: string): string | undefined {
  const value = attributes[key];

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return undefined;
}

export function getCheckoutUrl(): string | null {
  const rawProduct = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID?.trim();

  if (!rawProduct) {
    return null;
  }

  if (rawProduct.startsWith("http://") || rawProduct.startsWith("https://")) {
    const separator = rawProduct.includes("?") ? "&" : "?";
    return `${rawProduct}${separator}embed=1`;
  }

  return `https://app.lemonsqueezy.com/checkout/buy/${rawProduct}?embed=1`;
}

export function verifyLemonSqueezySignature(rawBody: string, signatureHeader: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signatureHeader) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(digest, "utf8");
  const right = Buffer.from(signatureHeader, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function extractPurchaseRecord(payload: LemonSqueezyWebhookPayload): PurchaseRecord | null {
  const eventName = payload.meta?.event_name;

  if (!eventName) {
    return null;
  }

  const attributes = payload.data?.attributes ?? {};
  const email =
    getString(attributes, "user_email") ??
    getString(attributes, "customer_email") ??
    getString(attributes, "email");

  if (!email) {
    return null;
  }

  const orderId = payload.data?.id ?? getString(attributes, "order_id") ?? `event-${Date.now()}`;

  let status: PurchaseRecord["status"] = "active";

  if (CANCELLED_EVENTS.has(eventName)) {
    status = "cancelled";
  } else if (eventName.includes("refund")) {
    status = "refunded";
  } else if (!ACTIVE_EVENTS.has(eventName)) {
    return null;
  }

  return {
    email: email.toLowerCase(),
    orderId,
    status,
    eventName,
    updatedAt: new Date().toISOString()
  };
}
