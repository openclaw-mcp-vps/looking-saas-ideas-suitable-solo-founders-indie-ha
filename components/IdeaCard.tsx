import Link from "next/link";
import { ArrowRight, Lock, Pickaxe, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Idea } from "@/types";

interface IdeaCardProps {
  idea: Idea;
  locked: boolean;
}

function getComplexityVariant(complexity: Idea["complexity"]): "success" | "warning" | "secondary" {
  if (complexity === "Low") {
    return "success";
  }

  if (complexity === "High") {
    return "warning";
  }

  return "secondary";
}

export function IdeaCard({ idea, locked }: IdeaCardProps): React.JSX.Element {
  return (
    <Card className="group border-[#30363d] bg-[#161b22]/70 transition-all duration-200 hover:border-[#2f81f7]/50">
      <CardHeader>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant={getComplexityVariant(idea.complexity)}>{idea.complexity} Complexity</Badge>
          <Badge variant="secondary">{idea.marketSize}</Badge>
          <Badge variant="default">Difficulty {idea.difficultyScore}/100</Badge>
        </div>
        <CardTitle className="text-xl">{idea.title}</CardTitle>
        <p className="text-sm text-[#9ca3af]">{idea.oneLinePitch}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-[#c9d1d9]">{idea.problem}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-[#30363d] bg-[#0d1117]/70 p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-[#9ca3af]">Solo Feasibility</p>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
              <Target className="h-4 w-4 text-[#79c0ff]" />
              {idea.soloFeasibility}/10
            </p>
          </div>
          <div className="rounded-md border border-[#30363d] bg-[#0d1117]/70 p-3">
            <p className="mb-1 text-xs uppercase tracking-wide text-[#9ca3af]">MVP Timeline</p>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#e6edf3]">
              <Pickaxe className="h-4 w-4 text-[#79c0ff]" />
              {idea.timeToMVPMonths} months
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-[#9ca3af]">Validation Signals</p>
          <ul className="space-y-1 text-sm text-[#c9d1d9]">
            {(locked ? idea.validationSignals.slice(0, 1) : idea.validationSignals).map((signal) => (
              <li key={signal} className="list-inside list-disc">
                {signal}
              </li>
            ))}
          </ul>
          {locked ? (
            <p className="mt-2 flex items-center gap-1 text-xs text-[#e3b341]">
              <Lock className="h-3.5 w-3.5" />
              Upgrade to view full competitor map and implementation plan.
            </p>
          ) : null}
        </div>

        <div className="pt-2">
          {locked ? (
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#79c0ff] hover:text-[#a5d6ff]"
            >
              Unlock Premium Database
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/ideas/${idea.slug}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#79c0ff] hover:text-[#a5d6ff]"
            >
              View Full Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
