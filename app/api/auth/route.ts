import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { hasPaidAccess } from "@/lib/database";
import { ACCESS_COOKIE_NAME, createAccessCookieValue, verifyAccessCookieValue } from "@/lib/lemonsqueezy";

interface AuthPayload {
  email?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: AuthPayload;

  try {
    payload = (await request.json()) as AuthPayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ message: "A purchase email is required." }, { status: 400 });
  }

  const verified = await hasPaidAccess(email);

  if (!verified) {
    return NextResponse.json(
      {
        message:
          "Purchase email not found yet. If you just paid, wait a minute for webhook sync and try again."
      },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const cookieValue = createAccessCookieValue(email);

  cookieStore.set({
    name: ACCESS_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60
  });

  return NextResponse.json({ message: "Premium access unlocked." }, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const hasAccess = verifyAccessCookieValue(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  return NextResponse.json({ hasAccess }, { status: 200 });
}
