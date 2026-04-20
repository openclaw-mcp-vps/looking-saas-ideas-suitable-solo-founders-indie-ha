import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { premiumCookieOptions, serializePremiumCookieValue } from "@/lib/auth";
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

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = payload?.email;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const normalized = normalizeEmail(email);
  const purchases = await readPurchases();

  const matchingPurchase = purchases.find(
    (purchase) => purchase.email.toLowerCase() === normalized && purchase.status === "active"
  );

  if (!matchingPurchase) {
    return NextResponse.json(
      {
        error:
          "No active purchase found for that email yet. If you just paid, wait a minute for webhook processing and try again."
      },
      { status: 403 }
    );
  }

  const cookie = premiumCookieOptions();
  const response = NextResponse.json({ status: "ok" });

  response.cookies.set(cookie.name, serializePremiumCookieValue(normalized), {
    maxAge: cookie.maxAge,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path
  });

  return response;
}

export async function DELETE() {
  const cookie = premiumCookieOptions();
  const response = NextResponse.json({ status: "cleared" });

  response.cookies.set(cookie.name, "", {
    maxAge: 0,
    path: cookie.path,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure
  });

  return response;
}
