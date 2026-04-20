"use client";

import { useMemo, useTransition } from "react";
import { Loader2, RotateCcw, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

const complexityOptions = ["low", "medium", "high"] as const;
const marketOptions = ["micro", "growing", "large"] as const;

function toSet(raw: string | null): Set<string> {
  if (!raw) {
    return new Set();
  }

  return new Set(raw.split(",").map((value) => value.trim()).filter(Boolean));
}

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedComplexity = useMemo(() => toSet(searchParams.get("complexity")), [searchParams]);
  const selectedMarket = useMemo(() => toSet(searchParams.get("market")), [searchParams]);
  const query = searchParams.get("q") ?? "";
  const minFeasibility = Number(searchParams.get("minFeasibility") ?? "1");

  function applyParams(nextParams: URLSearchParams) {
    const queryString = nextParams.toString();

    startTransition(() => {
      if (queryString) {
        router.push(`${pathname}?${queryString}`);
      } else {
        router.push(pathname);
      }
    });
  }

  function toggleCsvValue(key: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());
    const current = toSet(nextParams.get(key));

    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }

    if (current.size === 0) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, Array.from(current).join(","));
    }

    applyParams(nextParams);
  }

  function updateQuery(searchValue: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!searchValue.trim()) {
      nextParams.delete("q");
    } else {
      nextParams.set("q", searchValue.trim());
    }

    applyParams(nextParams);
  }

  function updateFeasibility(value: number) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (value <= 1) {
      nextParams.delete("minFeasibility");
    } else {
      nextParams.set("minFeasibility", String(value));
    }

    applyParams(nextParams);
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  return (
    <aside className="sticky top-6 space-y-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">Filters</h2>
        <Button variant="outline" size="sm" onClick={clearFilters}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="idea-search">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            id="idea-search"
            defaultValue={query}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateQuery((event.target as HTMLInputElement).value);
              }
            }}
            onBlur={(event) => updateQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-9 py-2 text-sm text-slate-100 outline-none ring-cyan-400/60 placeholder:text-slate-500 focus:ring-2"
            placeholder="e.g. churn, SOC 2, API"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Technical Complexity</p>
        {complexityOptions.map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={selectedComplexity.has(value)}
              onChange={() => toggleCsvValue("complexity", value)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-400"
            />
            <span className="capitalize">{value}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Market Size</p>
        {marketOptions.map((value) => (
          <label key={value} className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={selectedMarket.has(value)}
              onChange={() => toggleCsvValue("market", value)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-cyan-400"
            />
            <span className="capitalize">{value}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Solo Feasibility</p>
          <p className="text-sm font-semibold text-cyan-300">{minFeasibility}+</p>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={minFeasibility}
          onChange={(event) => updateFeasibility(Number(event.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>

      {isPending ? (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Updating results...
        </div>
      ) : null}
    </aside>
  );
}
