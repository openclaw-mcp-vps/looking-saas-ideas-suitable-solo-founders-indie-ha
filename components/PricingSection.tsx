"use client";

import { FormEvent, useMemo, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Loader2, Lock } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
  }
}

interface PricingSectionProps {
  compact?: boolean;
}

function getClientCheckoutUrl(): string | null {
  const productValue = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID?.trim();

  if (!productValue) {
    return null;
  }

  if (productValue.startsWith("http://") || productValue.startsWith("https://")) {
    return `${productValue}${productValue.includes("?") ? "&" : "?"}embed=1`;
  }

  return `https://app.lemonsqueezy.com/checkout/buy/${productValue}?embed=1`;
}

export function PricingSection({ compact = false }: PricingSectionProps) {
  const router = useRouter();
  const checkoutUrl = useMemo(() => getClientCheckoutUrl(), []);
  const [email, setEmail] = useState("");
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRestoreAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRestoring(true);
    setMessage(null);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Could not verify access for this email yet.");
      }

      setMessage("Access restored for this browser. You can now open all premium idea data.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Access restore failed. Check your purchase email.");
    } finally {
      setIsRestoring(false);
    }
  }

  return (
    <section id="pricing" className="mx-auto w-full max-w-5xl px-4">
      <Script
        src="https://assets.lemonsqueezy.com/lemon.js"
        strategy="afterInteractive"
        onLoad={() => window.createLemonSqueezy?.()}
      />

      <Card className="border-cyan-500/30 bg-gradient-to-b from-slate-900/95 to-slate-950/80 shadow-[0_0_40px_rgba(34,211,238,0.08)]">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            <Lock className="h-3.5 w-3.5" />
            Premium Access
          </div>
          <CardTitle className="text-3xl md:text-4xl">Validated Solo SaaS Database</CardTitle>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 md:text-base">
            Get full market research, differentiation strategy, and step-by-step execution plans for ideas you can ship alone.
          </p>
        </CardHeader>

        <CardContent className={cn("grid gap-8", compact ? "md:grid-cols-1" : "md:grid-cols-2")}>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Plan</p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-5xl font-semibold text-cyan-300">$15</p>
              <p className="pb-1 text-sm text-slate-400">per month</p>
            </div>
            <p className="mt-3 text-sm text-slate-300">Cancel anytime. New validated ideas added weekly.</p>

            <ul className="mt-5 space-y-2 text-sm text-slate-200">
              {[
                "Full access to all idea briefs and premium research",
                "Competition teardown and differentiation opportunities",
                "3-6 month implementation plans",
                "Validation experiments before you write code",
                "Founder-fit scoring to avoid impossible ideas"
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {checkoutUrl ? (
              <a
                href={checkoutUrl}
                className={cn(buttonVariants({ size: "lg" }), "lemonsqueezy-button mt-6 w-full")}
                target="_blank"
                rel="noreferrer"
              >
                <CreditCard className="h-4 w-4" />
                Start with Lemon Squeezy
              </a>
            ) : (
              <p className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
                Add `NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID` to enable the checkout overlay.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h3 className="text-xl font-semibold text-slate-100">Already purchased?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Enter the same email used during checkout. If webhook delivery has recorded your order, we restore access in this browser.
            </p>

            <form className="mt-4 space-y-3" onSubmit={handleRestoreAccess}>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="restore-email">
                Purchase Email
              </label>
              <input
                id="restore-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400/60 placeholder:text-slate-500 focus:ring-2"
                placeholder="you@company.com"
              />
              <Button type="submit" variant="secondary" className="w-full" disabled={isRestoring}>
                {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Restore premium access
              </Button>
            </form>

            {message ? (
              <p className="mt-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-sm text-slate-200">{message}</p>
            ) : null}

            <p className="mt-4 text-xs text-slate-500">
              Technical note: access is stored as a secure HttpOnly cookie after verification.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
