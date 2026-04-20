import ideasData from "@/data/ideas.json";
import type { MarketSize, SaaSIdea, TechnicalComplexity } from "@/types";

export interface IdeaFilters {
  query?: string;
  technicalComplexity?: TechnicalComplexity[];
  marketSize?: MarketSize[];
  minFeasibility?: number;
}

const ideas = ideasData as SaaSIdea[];

export function getAllIdeas(): SaaSIdea[] {
  return ideas;
}

export function getIdeaBySlug(slug: string): SaaSIdea | undefined {
  return ideas.find((idea) => idea.slug === slug);
}

export function getRelatedIdeas(slug: string, count = 3): SaaSIdea[] {
  return ideas.filter((idea) => idea.slug !== slug).slice(0, count);
}

export function parseFilterList(raw: string | string[] | undefined): string[] {
  if (!raw) {
    return [];
  }

  const normalized = Array.isArray(raw) ? raw.join(",") : raw;

  return normalized
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isTechnicalComplexity(value: string): value is TechnicalComplexity {
  return value === "low" || value === "medium" || value === "high";
}

export function isMarketSize(value: string): value is MarketSize {
  return value === "micro" || value === "growing" || value === "large";
}

export function filterIdeas(filters: IdeaFilters): SaaSIdea[] {
  const query = filters.query?.trim().toLowerCase();

  return ideas.filter((idea) => {
    const matchesQuery =
      !query ||
      idea.title.toLowerCase().includes(query) ||
      idea.oneLiner.toLowerCase().includes(query) ||
      idea.problem.toLowerCase().includes(query) ||
      idea.tags.some((tag) => tag.toLowerCase().includes(query));

    const matchesComplexity =
      !filters.technicalComplexity ||
      filters.technicalComplexity.length === 0 ||
      filters.technicalComplexity.includes(idea.technicalComplexity);

    const matchesMarketSize =
      !filters.marketSize ||
      filters.marketSize.length === 0 ||
      filters.marketSize.includes(idea.marketSize);

    const minFeasibility = filters.minFeasibility ?? 1;
    const matchesFeasibility = idea.soloFeasibilityScore >= minFeasibility;

    return matchesQuery && matchesComplexity && matchesMarketSize && matchesFeasibility;
  });
}
