import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { SaaSIdea } from "@/types";

interface IdeaCardProps {
  idea: SaaSIdea;
  hasAccess: boolean;
}

const complexityVariant = {
  low: "success",
  medium: "warning",
  high: "info"
} as const;

const marketLabel = {
  micro: "Niche Market",
  growing: "Growing Market",
  large: "Large Market"
} as const;

export function IdeaCard({ idea, hasAccess }: IdeaCardProps) {
  return (
    <Card className="h-full border-slate-800/90 bg-gradient-to-b from-slate-900/85 to-slate-950/70">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={complexityVariant[idea.technicalComplexity]}>{idea.technicalComplexity} complexity</Badge>
          <Badge>{marketLabel[idea.marketSize]}</Badge>
          <Badge variant="info">Feasibility {idea.soloFeasibilityScore}/10</Badge>
        </div>
        <CardTitle className="pt-2 text-2xl leading-tight">{idea.title}</CardTitle>
        <p className="text-sm text-slate-300">{idea.oneLiner}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Validated Problem</p>
          <p className="pt-1 text-sm text-slate-200">{idea.problem}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <p className="text-slate-400">Difficulty</p>
            <p className="font-semibold text-slate-100">{idea.difficultyScore}/10</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <p className="text-slate-400">Build Window</p>
            <p className="font-semibold text-slate-100">{idea.buildWindowMonths} months</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <p className="text-slate-400">Price Point</p>
            <p className="font-semibold text-slate-100">{idea.pricingRange}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-2">
            <p className="text-slate-400">Potential</p>
            <p className="font-semibold text-slate-100">{idea.mrrPotential}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Market Signal</p>
          <p className="pt-1 text-sm text-slate-200">{idea.marketResearch.signalSources[0]}</p>
        </div>

        <div className="rounded-xl border border-slate-800/90 bg-slate-900/80 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Premium Validation Insight</p>
          {hasAccess ? (
            <p className="pt-1 text-sm text-slate-200">{idea.premium.validationExperiments[0]}</p>
          ) : (
            <p className="flex items-center gap-2 pt-1 text-sm text-slate-400">
              <Lock className="h-4 w-4" />
              Unlock customer interview scripts and launch playbooks.
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <div className="flex flex-wrap gap-2">
          {idea.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-slate-700 bg-slate-800/60 px-2 py-1 text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <Link href={`/ideas/${idea.slug}`}>
          <Button variant="secondary" size="sm">
            View brief
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
