import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { notFound } from "next/navigation";

import { IdeaCard } from "@/components/IdeaCard";
import { PricingSection } from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPremiumAccess } from "@/lib/auth";
import { getIdeaBySlug, getRelatedIdeas } from "@/lib/ideas";

type Params = { slug: string };

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return {
      title: "Idea Not Found",
      description: "The requested SaaS idea could not be found.",
      robots: { index: false, follow: false }
    };
  }

  return {
    title: `${idea.title}`,
    description: idea.oneLiner,
    openGraph: {
      title: idea.title,
      description: idea.oneLiner,
      type: "article"
    }
  };
}

export default async function IdeaDetailPage({
  params
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    notFound();
  }

  const hasAccess = await hasPremiumAccess();
  const relatedIdeas = getRelatedIdeas(idea.slug, 3);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <Link href="/ideas" className="inline-flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200">
        <ArrowLeft className="h-4 w-4" />
        Back to database
      </Link>

      <section className="mt-5 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/70 p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{idea.technicalComplexity} complexity</Badge>
          <Badge variant="info">Feasibility {idea.soloFeasibilityScore}/10</Badge>
          <Badge variant="success">Difficulty {idea.difficultyScore}/10</Badge>
        </div>

        <h1 className="mt-4 text-3xl font-semibold text-slate-100 md:text-4xl">{idea.title}</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-300">{idea.oneLiner}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Build Window</p>
            <p className="pt-1 text-sm font-semibold text-slate-100">{idea.buildWindowMonths} months</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Market Size</p>
            <p className="pt-1 text-sm font-semibold capitalize text-slate-100">{idea.marketSize}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pricing</p>
            <p className="pt-1 text-sm font-semibold text-slate-100">{idea.pricingRange}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">MRR Potential</p>
            <p className="pt-1 text-sm font-semibold text-slate-100">{idea.mrrPotential}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem to Solve</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-200">{idea.problem}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposed Solution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-200">{idea.solution}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Research Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <p>
              <span className="font-semibold text-slate-100">ICP:</span> {idea.marketResearch.icp}
            </p>
            <p>
              <span className="font-semibold text-slate-100">Urgency:</span> {idea.marketResearch.urgency}
            </p>
            <p>
              <span className="font-semibold text-slate-100">Market estimate:</span> {idea.marketResearch.estMarketSize}
            </p>
            <p>
              <span className="font-semibold text-slate-100">Budget source:</span> {idea.marketResearch.existingBudgetLine}
            </p>
            <div>
              <p className="font-semibold text-slate-100">Validation signals:</p>
              <ul className="mt-1 space-y-1 text-slate-300">
                {idea.marketResearch.signalSources.map((signal) => (
                  <li key={signal} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" />
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Competition Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {idea.competition.map((entry) => (
              <div key={entry.name} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm">
                <p className="font-semibold text-slate-100">{entry.name}</p>
                <p className="pt-1 text-slate-300">
                  <span className="text-slate-400">Pricing:</span> {entry.pricing}
                </p>
                <p className="pt-1 text-slate-300">
                  <span className="text-slate-400">Weakness:</span> {entry.weakness}
                </p>
                <p className="pt-1 text-cyan-200">
                  <span className="text-cyan-300">Your opening:</span> {entry.opportunity}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-2xl font-semibold text-slate-100">Implementation Roadmap</h2>
        <div className="mt-4 space-y-3">
          {idea.implementationPlan.map((phase) => (
            <div key={phase.phase} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{phase.phase}</p>
              <p className="pt-1 text-xs uppercase tracking-wide text-cyan-300">{phase.timeline}</p>
              <p className="pt-2 text-sm text-slate-300">{phase.outcome}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyan-300" />
          <h2 className="text-xl font-semibold text-slate-100">Premium Execution Pack</h2>
        </div>

        {hasAccess ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Validation Experiments</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {idea.premium.validationExperiments.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Launch Plan</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {idea.premium.launchPlan.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Hidden Risks</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {idea.premium.hiddenRisks.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Moat Opportunities</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-200">
                {idea.premium.moatOpportunities.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <p className="text-sm text-slate-300">
              Subscribe to unlock customer interview scripts, first-100-customer acquisition plan, and failure mode
              checklists for this idea.
            </p>
            <PricingSection compact />
          </div>
        )}
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">Related opportunities</h2>
          <Link href="/ideas">
            <Button variant="outline">All ideas</Button>
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {relatedIdeas.map((related) => (
            <IdeaCard key={related.slug} idea={related} hasAccess={hasAccess} />
          ))}
        </div>
      </section>
    </main>
  );
}
