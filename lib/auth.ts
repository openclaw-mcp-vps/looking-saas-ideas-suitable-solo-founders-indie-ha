import { cookies } from "next/headers";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [],
  session: {
    strategy: "jwt"
  }
};

export const PREMIUM_ACCESS_COOKIE = "indie_founder_access";
const PREMIUM_MARKER = "active";
const PREMIUM_COOKIE_MAX_AGE = 60 * 60 * 24 * 31;

export async function hasPremiumAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PREMIUM_ACCESS_COOKIE)?.value;

  return Boolean(value?.startsWith(`${PREMIUM_MARKER}:`));
}

export function serializePremiumCookieValue(email: string): string {
  return `${PREMIUM_MARKER}:${Buffer.from(email.trim().toLowerCase()).toString("base64url")}`;
}

export function premiumCookieOptions() {
  return {
    name: PREMIUM_ACCESS_COOKIE,
    maxAge: PREMIUM_COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
}
