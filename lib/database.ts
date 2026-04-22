import { promises as fs } from "node:fs";
import path from "node:path";

import ideas from "@/data/ideas.json";
import type { Idea, PurchaseRecord } from "@/types";

const PURCHASES_FILE = path.join(process.cwd(), "data", "purchases.json");
const typedIdeas = ideas as Idea[];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function getAllIdeas(): Idea[] {
  return [...typedIdeas];
}

export function getIdeaBySlug(slug: string): Idea | undefined {
  return typedIdeas.find((idea) => idea.slug === slug);
}

export function getFilterOptions(): {
  complexity: Idea["complexity"][];
  marketSize: Idea["marketSize"][];
} {
  return {
    complexity: ["Low", "Medium", "High"],
    marketSize: ["Niche ($1M-$10M)", "Growing ($10M-$100M)", "Large ($100M+)"]
  };
}

async function readPurchaseRecords(): Promise<PurchaseRecord[]> {
  try {
    const raw = await fs.readFile(PURCHASES_FILE, "utf8");
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry): entry is PurchaseRecord => {
      return typeof entry === "object" && entry !== null && "email" in entry;
    });
  } catch {
    return [];
  }
}

async function writePurchaseRecords(records: PurchaseRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(PURCHASES_FILE), { recursive: true });
  await fs.writeFile(PURCHASES_FILE, JSON.stringify(records, null, 2), "utf8");
}

export async function hasPaidAccess(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const records = await readPurchaseRecords();

  return records.some((record) => normalizeEmail(record.email) === normalized);
}

export async function recordPurchase(params: {
  email: string;
  source: string;
  externalId?: string;
}): Promise<{ inserted: boolean; count: number }> {
  const normalized = normalizeEmail(params.email);
  if (!normalized) {
    return { inserted: false, count: 0 };
  }

  const records = await readPurchaseRecords();
  const exists = records.some((record) => normalizeEmail(record.email) === normalized);

  if (exists) {
    return { inserted: false, count: records.length };
  }

  records.push({
    email: normalized,
    source: params.source,
    externalId: params.externalId,
    createdAt: new Date().toISOString()
  });

  await writePurchaseRecords(records);

  return { inserted: true, count: records.length };
}
