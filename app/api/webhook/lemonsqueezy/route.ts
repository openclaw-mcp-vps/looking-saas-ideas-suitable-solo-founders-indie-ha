import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { recordPurchase } from "@/lib/database";
import { verifyStripeWebhookSignature } from "@/lib/lemonsqueezy";

interface StripeCheckoutSession {
  id?: string;
  customer_email?: string;
  customer_details?: {
    email?: string;
  };
}

interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: StripeCheckoutSession;
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ message: "Missing STRIPE_WEBHOOK_SECRET." }, { status: 500 });
  }

  const rawBody = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  const validSignature = verifyStripeWebhookSignature(rawBody, signature, webhookSecret);

  if (!validSignature) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  let event: StripeWebhookEvent;

  try {
    event = JSON.parse(rawBody) as StripeWebhookEvent;
  } catch {
    return NextResponse.json({ message: "Invalid webhook payload." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_details?.email ?? session.customer_email;

    if (email) {
      await recordPurchase({
        email,
        source: "stripe",
        externalId: session.id
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
