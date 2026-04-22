import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft, Database, LockKeyhole } from "lucide-react";

import { IdeasExplorer } from "@/components/IdeasExplorer";
import { PricingSection } from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { getAllIdeas } from "@/lib/database";
import { ACCESS_COOKIE_NAME, verifyAccessCookieValue } from "@/lib/lemonsqueezy";

export const metadata: Metadata = {
  title: "Idea Database",
  description:
    "Filter validated SaaS ideas by technical complexity, market size, solo-founder feasibility, and MVP timeline."
};

export default async function IdeasPage(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const hasAccess = verifyAccessCookieValue(cookieStore.get(ACCESS_COOKIE_NAME)?.value);
  const ideas = getAllIdeas();

  return (
    <main className="min-h-screen bg-[#0d1117] pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 md:py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#79c0ff] hover:text-[#a5d6ff]">
          <ArrowLeft className="h-4 w-4" />
          Back to landing page
        </Link>

        <div className="mb-6 rounded-xl border border-[#30363d] bg-[#161b22]/70 p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              {ideas.length} curated ideas
            </Badge>
            <Badge variant={hasAccess ? "success" : "warning"} className="flex items-center gap-1">
              <LockKeyhole className="h-3 w-3" />
              {hasAccess ? "Premium unlocked" : "Preview only"}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-[#f0f6fc] md:text-3xl">Validated SaaS Idea Database</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#9ca3af] md:text-base">
            Use filters to quickly isolate ideas you can execute solo, with realistic complexity and meaningful market
            upside. Every premium idea includes competitor context and a concrete implementation path.
          </p>
        </div>

        <IdeasExplorer ideas={ideas} hasAccess={hasAccess} />

        {!hasAccess ? <PricingSection hasAccess={hasAccess} compact /> : null}
      </div>
    </main>
  );
}
