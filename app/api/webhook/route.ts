import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { extractPurchaseRecord, type LemonSqueezyWebhookPayload, verifyLemonSqueezySignature } from "@/lib/lemonsqueezy";
import type { PurchaseRecord } from "@/types";

export const runtime = "nodejs";

const purchasesPath = path.join(process.cwd(), "data", "purchases.json");

async function readPurchases(): Promise<PurchaseRecord[]> {
  try {
    const file = await fs.readFile(purchasesPath, "utf8");
    const parsed = JSON.parse(file) as unknown;

    return Array.isArray(parsed) ? (parsed as PurchaseRecord[]) : [];
  } catch {
    return [];
  }
}

async function writePurchases(records: PurchaseRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(purchasesPath), { recursive: true });
  await fs.writeFile(purchasesPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");
}

function mergePurchase(records: PurchaseRecord[], incoming: PurchaseRecord): PurchaseRecord[] {
  const index = records.findIndex((record) => record.email === incoming.email);

  if (index === -1) {
    return [...records, incoming];
  }

  const updated = [...records];
  updated[index] = {
    ...updated[index],
    ...incoming
  };

  return updated;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  let payload: LemonSqueezyWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as LemonSqueezyWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const purchase = extractPurchaseRecord(payload);

  if (!purchase) {
    return NextResponse.json({ status: "ignored" });
  }

  const current = await readPurchases();
  const merged = mergePurchase(current, purchase);
  await writePurchases(merged);

  return NextResponse.json({ status: "processed" });
}
