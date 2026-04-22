import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, ChartNoAxesCombined, ShieldCheck, Timer, UserCheck } from "lucide-react";

import { PricingSection } from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAllIdeas } from "@/lib/database";
import { ACCESS_COOKIE_NAME, verifyAccessCookieValue } from "@/lib/lemonsqueezy";
import { cn } from "@/lib/utils";

export default async function HomePage(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const hasAccess = verifyAccessCookieValue(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
  const totalIdeas = getAllIdeas().length;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#30363d] bg-[#0d1117]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <p className="text-sm font-semibold tracking-wide text-[#f0f6fc]">Validated Solo SaaS Ideas</p>
          <nav className="flex items-center gap-5 text-sm text-[#9ca3af]">
            <a href="#problem" className="hover:text-[#e6edf3]">
              Problem
            </a>
            <a href="#solution" className="hover:text-[#e6edf3]">
              Solution
            </a>
            <a href="#pricing" className="hover:text-[#e6edf3]">
              Pricing
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 md:pb-28 md:pt-20">
          <Badge variant="secondary" className="mb-4 w-fit border-[#2f81f7]/30 bg-[#2f81f7]/15 text-[#79c0ff]">
            Built for indie hackers and technical solo founders
          </Badge>
          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f0f6fc] md:text-6xl md:leading-[1.1]">
            Stop guessing startup ideas. Build the one you can actually win.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#9ca3af] md:text-lg">
            Explore a curated dataset of validated SaaS opportunities with market signal evidence, competitor landscape,
            implementation difficulty scoring, and solo-founder feasibility. Choose a problem you can ship in 3-6
            months and start with confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/ideas" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full sm:w-auto")}>
              Explore Idea Database
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a href="#pricing" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
              View Pricing
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-4">
              <p className="text-2xl font-bold text-[#f0f6fc]">{totalIdeas}+</p>
              <p className="text-sm text-[#9ca3af]">validated SaaS ideas in the current database</p>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-4">
              <p className="text-2xl font-bold text-[#f0f6fc]">3-6 mo</p>
              <p className="text-sm text-[#9ca3af]">target MVP window optimized for one founder</p>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-4">
              <p className="text-2xl font-bold text-[#f0f6fc]">$15/mo</p>
              <p className="text-sm text-[#9ca3af]">affordable research edge vs months of wrong execution</p>
            </div>
          </div>
        </section>

        <section id="problem" className="border-y border-[#30363d] bg-[#111827]/45">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-16">
            <div>
              <Timer className="mb-3 h-6 w-6 text-[#79c0ff]" />
              <h2 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Months wasted on unvalidated builds</h2>
              <p className="text-sm text-[#9ca3af]">
                Most indie projects fail because founders pick low-demand ideas or overly complex markets.
              </p>
            </div>
            <div>
              <ChartNoAxesCombined className="mb-3 h-6 w-6 text-[#79c0ff]" />
              <h2 className="mb-2 text-lg font-semibold text-[#f0f6fc]">No practical market intelligence</h2>
              <p className="text-sm text-[#9ca3af]">
                Competitor and demand data is fragmented, expensive, and rarely tuned for one-person teams.
              </p>
            </div>
            <div>
              <UserCheck className="mb-3 h-6 w-6 text-[#79c0ff]" />
              <h2 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Execution mismatch for solo founders</h2>
              <p className="text-sm text-[#9ca3af]">
                Good ideas still fail if the implementation burden requires a full product, sales, and support team.
              </p>
            </div>
          </div>
        </section>

        <section id="solution" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
          <h2 className="text-3xl font-bold text-[#f0f6fc]">What you get inside</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#9ca3af] md:text-base">
            This is not a random startup idea list. Each opportunity is scored for feasibility, execution risk, and
            monetization path so you can choose faster and execute with fewer surprises.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Advanced filters that match your constraints</h3>
              <p className="text-sm text-[#9ca3af]">
                Narrow by technical complexity, market size, solo-feasibility score, and time-to-MVP so you only see
                ideas you can realistically ship.
              </p>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Competition and positioning context</h3>
              <p className="text-sm text-[#9ca3af]">
                Understand who already serves the space, where incumbents are weak, and where a solo founder can carve
                a clear wedge.
              </p>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Practical implementation plans</h3>
              <p className="text-sm text-[#9ca3af]">
                Get concrete build phases, recommended stack direction, and launch strategies designed for a one-person
                product team.
              </p>
            </div>
            <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
              <h3 className="mb-2 text-lg font-semibold text-[#f0f6fc]">Low-friction premium access</h3>
              <p className="text-sm text-[#9ca3af]">
                Purchase through Stripe hosted checkout, then unlock this browser with your purchase email. No complex
                account setup required.
              </p>
            </div>
          </div>
        </section>

        <PricingSection hasAccess={hasAccess} />

        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 md:pb-20">
          <h2 className="mb-6 text-3xl font-bold text-[#f0f6fc]">FAQ</h2>
          <div className="space-y-3">
            <details className="rounded-lg border border-[#30363d] bg-[#161b22]/70 p-4">
              <summary className="cursor-pointer font-medium text-[#e6edf3]">How is this different from startup idea generators?</summary>
              <p className="mt-2 text-sm text-[#9ca3af]">
                Generators produce generic concepts. This database focuses on validated demand indicators, competition
                pressure, and solo-execution constraints so you can make a defensible choice.
              </p>
            </details>
            <details className="rounded-lg border border-[#30363d] bg-[#161b22]/70 p-4">
              <summary className="cursor-pointer font-medium text-[#e6edf3]">Do I need a team to ship these ideas?</summary>
              <p className="mt-2 text-sm text-[#9ca3af]">
                The catalog is optimized for technical founders building alone. You can filter by feasibility and MVP
                timeline to avoid team-dependent concepts.
              </p>
            </details>
            <details className="rounded-lg border border-[#30363d] bg-[#161b22]/70 p-4">
              <summary className="cursor-pointer font-medium text-[#e6edf3]">How does premium access work after payment?</summary>
              <p className="mt-2 text-sm text-[#9ca3af]">
                Stripe checkout triggers a webhook that stores your purchase email. Enter that same email in the unlock
                form and this browser receives a secure access cookie.
              </p>
            </details>
            <details className="rounded-lg border border-[#30363d] bg-[#161b22]/70 p-4">
              <summary className="cursor-pointer font-medium text-[#e6edf3]">Can I cancel anytime?</summary>
              <p className="mt-2 text-sm text-[#9ca3af]">
                Yes. Billing is managed through Stripe and you can cancel from your Stripe customer portal at any time.
              </p>
            </details>
          </div>

          <div className="mt-8 flex items-center gap-2 rounded-lg border border-[#30363d] bg-[#161b22]/70 p-4 text-sm text-[#9ca3af]">
            <ShieldCheck className="h-4 w-4 text-[#79c0ff]" />
            {hasAccess
              ? "Premium access is currently active on this device."
              : "Preview mode is active. Upgrade to unlock full idea analysis and premium filtering depth."}
          </div>
        </section>
      </main>
    </div>
  );
}
