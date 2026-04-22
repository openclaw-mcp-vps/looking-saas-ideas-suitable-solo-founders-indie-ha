"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Lock } from "lucide-react";

import { FilterSidebar } from "@/components/FilterSidebar";
import { IdeaCard } from "@/components/IdeaCard";
import { Badge } from "@/components/ui/badge";
import type { Idea, IdeaFilters } from "@/types";

interface IdeasExplorerProps {
  ideas: Idea[];
  hasAccess: boolean;
}

const DEFAULT_FILTERS: IdeaFilters = {
  query: "",
  complexity: "All",
  marketSize: "All",
  minimumFeasibility: 6,
  maxMvpMonths: 6
};

export function IdeasExplorer({ ideas, hasAccess }: IdeasExplorerProps): React.JSX.Element {
  const [filters, setFilters] = useState<IdeaFilters>(DEFAULT_FILTERS);

  const fuse = useMemo(
    () =>
      new Fuse(ideas, {
        keys: ["title", "oneLinePitch", "problem", "keywords", "audience"],
        threshold: 0.32,
        includeScore: true
      }),
    [ideas]
  );

  const filteredIdeas = useMemo(() => {
    const searchBase = filters.query.trim() ? fuse.search(filters.query.trim()).map((result) => result.item) : ideas;

    return searchBase
      .filter((idea) => (filters.complexity === "All" ? true : idea.complexity === filters.complexity))
      .filter((idea) => (filters.marketSize === "All" ? true : idea.marketSize === filters.marketSize))
      .filter((idea) => idea.soloFeasibility >= filters.minimumFeasibility)
      .filter((idea) => idea.timeToMVPMonths <= filters.maxMvpMonths)
      .sort((a, b) => b.soloFeasibility - a.soloFeasibility);
  }, [filters, fuse, ideas]);

  const visibleIdeas = hasAccess ? filteredIdeas : filteredIdeas.slice(0, 4);

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
      <FilterSidebar
        filters={filters}
        onQueryChange={(value) => setFilters((current) => ({ ...current, query: value }))}
        onComplexityChange={(value) => setFilters((current) => ({ ...current, complexity: value }))}
        onMarketSizeChange={(value) => setFilters((current) => ({ ...current, marketSize: value }))}
        onFeasibilityChange={(value) => setFilters((current) => ({ ...current, minimumFeasibility: value }))}
        onMvpMonthsChange={(value) => setFilters((current) => ({ ...current, maxMvpMonths: value }))}
      />

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{filteredIdeas.length} matched ideas</Badge>
          <Badge variant="default">{hasAccess ? "Premium access enabled" : "Preview mode"}</Badge>
          {!hasAccess ? (
            <Badge variant="warning" className="flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Showing first 4 ideas only
            </Badge>
          ) : null}
        </div>

        {visibleIdeas.length === 0 ? (
          <div className="rounded-xl border border-[#30363d] bg-[#161b22]/70 p-6 text-sm text-[#9ca3af]">
            No ideas matched your filters. Reduce minimum feasibility or increase MVP timeline to broaden options.
          </div>
        ) : (
          <div className="grid gap-4">
            {visibleIdeas.map((idea) => (
              <IdeaCard key={idea.slug} idea={idea} locked={!hasAccess} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
