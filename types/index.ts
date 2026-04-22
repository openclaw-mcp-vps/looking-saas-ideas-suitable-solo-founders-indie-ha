export type ComplexityLevel = "Low" | "Medium" | "High";

export type MarketSizeBand =
  | "Niche ($1M-$10M)"
  | "Growing ($10M-$100M)"
  | "Large ($100M+)";

export interface Idea {
  slug: string;
  title: string;
  oneLinePitch: string;
  problem: string;
  audience: string;
  marketSize: MarketSizeBand;
  competitionScore: number;
  complexity: ComplexityLevel;
  soloFeasibility: number;
  timeToMVPMonths: number;
  difficultyScore: number;
  pricingModel: string;
  validationSignals: string[];
  competition: string[];
  goToMarket: string[];
  implementationPlan: string[];
  stack: string[];
  risks: string[];
  keywords: string[];
}

export interface PurchaseRecord {
  email: string;
  createdAt: string;
  source: string;
  externalId?: string;
}

export interface IdeaFilters {
  query: string;
  complexity: "All" | ComplexityLevel;
  marketSize: "All" | MarketSizeBand;
  minimumFeasibility: number;
  maxMvpMonths: number;
}
