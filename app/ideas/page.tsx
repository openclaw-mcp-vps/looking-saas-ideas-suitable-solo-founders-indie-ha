import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";

import { FilterSidebar } from "@/components/FilterSidebar";
import { IdeaCard } from "@/components/IdeaCard";
import { PricingSection } from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { hasPremiumAccess } from "@/lib/auth";
import { filterIdeas, isMarketSize, isTechnicalComplexity, parseFilterList } from "@/lib/ideas";

export const metadata: Metadata = {
  title: "Idea Database",
  description:
    "Filter validated SaaS ideas by technical complexity, market size, and solo-founder feasibility."
};

type SearchParamValue = string | string[] | undefined;
type SearchParamRecord = Record<string, SearchParamValue>;

export default async function IdeasPage({
  searchParams
}: {
  searchParams?: Promise<SearchParamRecord>;
}) {
  const params = (searchParams ? await searchParams : {}) as SearchParamRecord;
  const hasAccess = await hasPremiumAccess();

  const complexity = parseFilterList(params.complexity).filter(isTechnicalComplexity);
  const market = parseFilterList(params.market).filter(isMarketSize);
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  const minFeasibilityRaw = Array.isArray(params.minFeasibility)
    ? params.minFeasibility[0]
    : params.minFeasibility;
  const minFeasibility = minFeasibilityRaw ? Number(minFeasibilityRaw) : 1;

  const filtered = filterIdeas({
    query,
    technicalComplexity: complexity,
    marketSize: market,
    minFeasibility: Number.isFinite(minFeasibility) ? minFeasibility : 1
  });

  const visibleIdeas = hasAccess ? filtered : filtered.slice(0, 6);
  const hiddenCount = Math.max(filtered.length - visibleIdeas.length, 0);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Curated Database</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-100 md:text-4xl">SaaS ideas suitable for solo founders</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">
            Filter ideas by build complexity, market size, and feasibility so you can choose opportunities that fit one
            founder and a 3-6 month execution window.
          </p>
        </div>
        <Link href="/">
          <Button variant="outline">Back to landing</Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-sm text-slate-300">
              Showing <span className="font-semibold text-cyan-300">{visibleIdeas.length}</span> idea
              {visibleIdeas.length === 1 ? "" : "s"}
              {query ? (
                <>
                  {" "}
                  for <span className="font-semibold text-slate-100">"{query}"</span>
                </>
              ) : null}
            </p>

            {!hasAccess ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                <Lock className="h-4 w-4" />
                Free preview mode. Subscribe to unlock full database and premium execution details.
              </p>
            ) : null}
          </div>

          {visibleIdeas.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
              <h2 className="text-xl font-semibold text-slate-100">No ideas match these filters</h2>
              <p className="mt-2 text-sm text-slate-300">Try lowering feasibility minimum or removing one filter.</p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {visibleIdeas.map((idea) => (
                <IdeaCard key={idea.slug} idea={idea} hasAccess={hasAccess} />
              ))}
            </div>
          )}

          {!hasAccess && hiddenCount > 0 ? (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
              {hiddenCount} additional idea {hiddenCount === 1 ? "brief is" : "briefs are"} hidden in preview mode.
              Subscribe to unlock the full list and premium launch plans.
            </div>
          ) : null}
        </section>
      </div>

      {!hasAccess ? (
        <div className="mt-12">
          <PricingSection compact />
        </div>
      ) : null}
    </main>
  );
}
