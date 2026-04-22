"use client";

import { SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { IdeaFilters, MarketSizeBand } from "@/types";

interface FilterSidebarProps {
  filters: IdeaFilters;
  onQueryChange: (value: string) => void;
  onComplexityChange: (value: IdeaFilters["complexity"]) => void;
  onMarketSizeChange: (value: "All" | MarketSizeBand) => void;
  onFeasibilityChange: (value: number) => void;
  onMvpMonthsChange: (value: number) => void;
  className?: string;
}

const COMPLEXITY_OPTIONS: IdeaFilters["complexity"][] = ["All", "Low", "Medium", "High"];
const MARKET_OPTIONS: ("All" | MarketSizeBand)[] = ["All", "Niche ($1M-$10M)", "Growing ($10M-$100M)", "Large ($100M+)"];

export function FilterSidebar({
  filters,
  onQueryChange,
  onComplexityChange,
  onMarketSizeChange,
  onFeasibilityChange,
  onMvpMonthsChange,
  className
}: FilterSidebarProps): React.JSX.Element {
  return (
    <aside className={cn("rounded-xl border border-[#30363d] bg-[#161b22]/80 p-4", className)}>
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-[#79c0ff]" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#c9d1d9]">Filter Ideas</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="idea-search" className="mb-1 block text-xs font-medium text-[#9ca3af]">
            Search by niche, pain, or keyword
          </label>
          <Input
            id="idea-search"
            value={filters.query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Example: onboarding, churn, compliance"
          />
        </div>

        <div>
          <label htmlFor="complexity" className="mb-1 block text-xs font-medium text-[#9ca3af]">
            Technical complexity
          </label>
          <select
            id="complexity"
            value={filters.complexity}
            onChange={(event) => onComplexityChange(event.target.value as IdeaFilters["complexity"])}
            className="h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#2f81f7]/70"
          >
            {COMPLEXITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="market-size" className="mb-1 block text-xs font-medium text-[#9ca3af]">
            Market size
          </label>
          <select
            id="market-size"
            value={filters.marketSize}
            onChange={(event) => onMarketSizeChange(event.target.value as "All" | MarketSizeBand)}
            className="h-10 w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#2f81f7]/70"
          >
            {MARKET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="feasibility" className="mb-1 block text-xs font-medium text-[#9ca3af]">
            Minimum solo-feasibility score: {filters.minimumFeasibility}/10
          </label>
          <input
            id="feasibility"
            type="range"
            min={1}
            max={10}
            value={filters.minimumFeasibility}
            onChange={(event) => onFeasibilityChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#21262d] accent-[#2f81f7]"
          />
        </div>

        <div>
          <label htmlFor="mvp-window" className="mb-1 block text-xs font-medium text-[#9ca3af]">
            Max MVP timeline: {filters.maxMvpMonths} months
          </label>
          <input
            id="mvp-window"
            type="range"
            min={2}
            max={9}
            value={filters.maxMvpMonths}
            onChange={(event) => onMvpMonthsChange(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#21262d] accent-[#2f81f7]"
          />
        </div>
      </div>
    </aside>
  );
}
