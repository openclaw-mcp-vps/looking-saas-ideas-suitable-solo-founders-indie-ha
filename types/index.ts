export type MarketSize = "micro" | "growing" | "large";
export type TechnicalComplexity = "low" | "medium" | "high";

export interface CompetitionInsight {
  name: string;
  pricing: string;
  weakness: string;
  opportunity: string;
}

export interface MarketResearch {
  icp: string;
  urgency: string;
  estMarketSize: string;
  willingnessToPay: string;
  existingBudgetLine: string;
  signalSources: string[];
}

export interface ImplementationMilestone {
  phase: string;
  timeline: string;
  outcome: string;
}

export interface PremiumInsight {
  validationExperiments: string[];
  launchPlan: string[];
  hiddenRisks: string[];
  moatOpportunities: string[];
}

export interface SaaSIdea {
  slug: string;
  title: string;
  oneLiner: string;
  category: string;
  targetFounder: string;
  problem: string;
  solution: string;
  technicalComplexity: TechnicalComplexity;
  marketSize: MarketSize;
  difficultyScore: number;
  soloFeasibilityScore: number;
  buildWindowMonths: string;
  pricingRange: string;
  mrrPotential: string;
  tags: string[];
  marketResearch: MarketResearch;
  competition: CompetitionInsight[];
  implementationPlan: ImplementationMilestone[];
  premium: PremiumInsight;
}

export interface PurchaseRecord {
  email: string;
  orderId: string;
  status: "active" | "refunded" | "cancelled";
  eventName: string;
  updatedAt: string;
}
