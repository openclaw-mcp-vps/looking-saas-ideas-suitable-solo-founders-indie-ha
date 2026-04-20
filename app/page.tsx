import Link from "next/link";
import { ArrowRight, ChartNoAxesCombined, Filter, Rocket, ShieldCheck, Target } from "lucide-react";

import { IdeaCard } from "@/components/IdeaCard";
import { PricingSection } from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { hasPremiumAccess } from "@/lib/auth";
import { getAllIdeas } from "@/lib/ideas";

const faqs = [
  {
    question: "How is this different from generic startup idea lists?",
    answer:
      "Each idea includes market urgency signals, competition gaps, and a realistic implementation path for a single technical founder. You are not buying inspiration, you are buying filtered execution options."
  },
  {
    question: "How do you score solo-founder feasibility?",
    answer:
      "We score ideas by integration burden, sales complexity, required support load, and compliance overhead. A high score means one person can ship and operate an MVP in 3-6 months."
  },
  {
    question: "Will this help if I already have one idea in mind?",
    answer:
      "Yes. You can benchmark your current idea against alternatives and use the validation checklists to test demand before committing months of build time."
  },
  {
    question: "What happens after I subscribe?",
    answer:
      "You get immediate access to all idea briefs, premium validation playbooks, and ongoing weekly additions. Access is restored in this browser through a secure cookie after purchase verification."
  }
];

export default async function HomePage() {
  const ideas = getAllIdeas().slice(0, 3);
  const hasAccess = await hasPremiumAccess();

  return (
    <main className="pb-16">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Indie Idea Vault</p>
          <p className="text-sm text-slate-400">Validated SaaS ideas for solo founders</p>
        </div>
        <Link href="/ideas">
          <Button variant="secondary">Browse Database</Button>
        </Link>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-8 md:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            <Target className="h-4 w-4" />
            Stop Building the Wrong Product
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-slate-100 md:text-6xl">
            Looking for SaaS ideas suitable for solo founders?
          </h1>

          <p className="max-w-2xl text-lg text-slate-300">
            Pick from validated SaaS opportunities with competition analysis, implementation difficulty scores, and
            solo-founder feasibility filters. Build what has demand and fits your execution bandwidth.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/ideas">
              <Button size="lg">
                Explore idea library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="outline" size="lg">
                See $15/mo plan
              </Button>
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Failure driver", value: "Wrong problem choice" },
              { label: "Build target", value: "3-6 month MVP scope" },
              { label: "Ideal user", value: "Technical solo founders" }
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="pt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-xl font-semibold text-slate-100">How founders lose 6+ months</h2>
          <div className="mt-4 space-y-4">
            {[
              {
                icon: ChartNoAxesCombined,
                title: "No market proof",
                copy: "Ideas are picked from trends, not buyer urgency or budget reality."
              },
              {
                icon: ShieldCheck,
                title: "Underestimated complexity",
                copy: "A solo founder starts an enterprise-level problem with hidden support burden."
              },
              {
                icon: Rocket,
                title: "Weak launch strategy",
                copy: "No path to first 10 paying customers before engineering effort starts."
              }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-cyan-300">
                  <item.icon className="h-4 w-4" />
                  <p className="font-semibold">{item.title}</p>
                </div>
                <p className="pt-1 text-sm text-slate-300">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Preview</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-100">Validated opportunities you can execute solo</h2>
          </div>
          <Link href="/ideas" className="hidden md:block">
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              Open full filters
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.slug} idea={idea} hasAccess={hasAccess} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/65 p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Method</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-100">A decision framework, not a random idea dump</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Demand Validation",
                copy: "Each idea includes real market signals and interview hypotheses to test willingness to pay before coding."
              },
              {
                title: "Competition Positioning",
                copy: "We map incumbent weaknesses so you can win with narrow scope and speed instead of feature parity."
              },
              {
                title: "Execution Fit",
                copy: "Difficulty and feasibility scoring prevent you from picking projects that require a full team to survive."
              }
            ].map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
                <p className="pt-2 text-sm text-slate-300">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-16">
        <PricingSection />
      </div>

      <section className="mx-auto mt-16 w-full max-w-5xl px-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-100">Common founder questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-100">{faq.question}</summary>
              <p className="pt-3 text-sm text-slate-300">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 w-full max-w-6xl border-t border-slate-800 px-4 py-8 text-xs text-slate-500">
        Built for technical founders leaving corporate roles and side-hustling developers who need validated ideas,
        not inspiration noise.
      </footer>
    </main>
  );
}
