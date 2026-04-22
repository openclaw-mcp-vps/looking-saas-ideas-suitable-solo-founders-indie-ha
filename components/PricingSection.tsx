import { ShieldCheck, Sparkles, Zap } from "lucide-react";

import { UnlockForm } from "@/components/UnlockForm";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PricingSectionProps {
  hasAccess: boolean;
  compact?: boolean;
}

export function PricingSection({ hasAccess, compact = false }: PricingSectionProps): React.JSX.Element {
  const paymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

  return (
    <section id="pricing" className={cn("mx-auto w-full max-w-6xl", compact ? "py-6" : "py-12 md:py-16")}>
      <Card className="overflow-hidden border-[#2f81f7]/30 bg-gradient-to-br from-[#161b22] via-[#111827] to-[#0b1220]">
        <div className="grid gap-0 lg:grid-cols-5">
          <div className="p-6 md:p-8 lg:col-span-3">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#79c0ff]">Indie Validated Ideas</p>
            <h3 className="mb-3 text-2xl font-semibold text-[#f0f6fc] md:text-3xl">
              Get execution-ready SaaS ideas for one founder, not a full team
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-[#9ca3af] md:text-base">
              Every idea includes market proof signals, competitor positioning, difficulty score, and a focused
              implementation path designed for a 3-6 month solo build window.
            </p>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-3">
                <Sparkles className="mb-2 h-4 w-4 text-[#79c0ff]" />
                <p className="text-sm font-medium text-[#e6edf3]">Validated Opportunity</p>
                <p className="mt-1 text-xs text-[#9ca3af]">Built from real founder demand patterns and buying signals.</p>
              </div>
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-3">
                <Zap className="mb-2 h-4 w-4 text-[#79c0ff]" />
                <p className="text-sm font-medium text-[#e6edf3]">Fast to Execute</p>
                <p className="mt-1 text-xs text-[#9ca3af]">Filter out ideas that are too heavy for one builder.</p>
              </div>
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117]/70 p-3">
                <ShieldCheck className="mb-2 h-4 w-4 text-[#79c0ff]" />
                <p className="text-sm font-medium text-[#e6edf3]">Direct Checkout</p>
                <p className="mt-1 text-xs text-[#9ca3af]">Stripe hosted checkout with immediate account unlock.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-3xl font-bold text-[#f0f6fc]">$15</p>
                <p className="text-sm text-[#9ca3af]">per month, cancel anytime</p>
              </div>
              <a
                href={paymentLink}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto")}
              >
                Buy Access on Stripe
              </a>
            </div>
          </div>

          <div className="border-t border-[#30363d] bg-[#0d1117]/70 p-6 md:p-8 lg:col-span-2 lg:border-l lg:border-t-0">
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Already paid?</CardTitle>
              <CardDescription>
                Use the same email from checkout to unlock premium filters and full implementation breakdowns.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              {hasAccess ? (
                <div className="rounded-md border border-[#238636]/40 bg-[#238636]/10 px-3 py-2 text-sm text-[#8ddb8c]">
                  Premium access active in this browser.
                </div>
              ) : (
                <UnlockForm />
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    </section>
  );
}
