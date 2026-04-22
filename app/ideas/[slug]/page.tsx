import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, BadgeCheck, CircleDollarSign, Hammer } from "lucide-react";

import { PricingSection } from "@/components/PricingSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIdeaBySlug } from "@/lib/database";
import { ACCESS_COOKIE_NAME, verifyAccessCookieValue } from "@/lib/lemonsqueezy";

interface IdeaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: IdeaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    return {
      title: "Idea not found"
    };
  }

  return {
    title: idea.title,
    description: idea.oneLinePitch,
    openGraph: {
      title: idea.title,
      description: idea.oneLinePitch
    }
  };
}

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps): Promise<React.JSX.Element> {
  const { slug } = await params;
  const idea = getIdeaBySlug(slug);

  if (!idea) {
    notFound();
  }

  const cookieStore = await cookies();
  const hasAccess = verifyAccessCookieValue(cookieStore.get(ACCESS_COOKIE_NAME)?.value);

  return (
    <main className="min-h-screen bg-[#0d1117] pb-16">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-10">
        <Link href="/ideas" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#79c0ff] hover:text-[#a5d6ff]">
          <ArrowLeft className="h-4 w-4" />
          Back to ideas
        </Link>

        <div className="mb-6 rounded-xl border border-[#30363d] bg-[#161b22]/70 p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{idea.marketSize}</Badge>
            <Badge variant="default">{idea.complexity} complexity</Badge>
            <Badge variant="secondary">Solo feasibility {idea.soloFeasibility}/10</Badge>
          </div>
          <h1 className="text-2xl font-bold text-[#f0f6fc] md:text-3xl">{idea.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#9ca3af] md:text-base">{idea.oneLinePitch}</p>
        </div>

        {!hasAccess ? (
          <>
            <Card className="mb-6 border-[#e3b341]/30 bg-[#9e6a03]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#f0f6fc]">
                  <AlertTriangle className="h-5 w-5 text-[#e3b341]" />
                  Premium analysis locked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#d6d1c4]">
                  You are seeing a teaser only. Upgrade to access full market research, competitor breakdown, build plan,
                  and risk map for this idea.
                </p>
                <div className="mt-4 rounded-md border border-[#30363d] bg-[#0d1117]/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-[#9ca3af]">Problem Summary</p>
                  <p className="mt-1 text-sm text-[#c9d1d9]">{idea.problem}</p>
                </div>
              </CardContent>
            </Card>
            <PricingSection hasAccess={hasAccess} compact />
          </>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeCheck className="h-5 w-5 text-[#79c0ff]" />
                  Market Validation Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#c9d1d9]">
                  {idea.validationSignals.map((signal) => (
                    <li key={signal} className="list-inside list-disc">
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competition Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-[#9ca3af]">
                  Competition pressure score: <span className="font-semibold text-[#e6edf3]">{idea.competitionScore}/10</span>
                </p>
                <ul className="space-y-2 text-sm text-[#c9d1d9]">
                  {idea.competition.map((competitor) => (
                    <li key={competitor} className="list-inside list-disc">
                      {competitor}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Hammer className="h-5 w-5 text-[#79c0ff]" />
                  Implementation Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#c9d1d9]">
                  {idea.implementationPlan.map((step) => (
                    <li key={step} className="list-inside list-disc">
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-md border border-[#30363d] bg-[#0d1117]/70 p-3">
                  <p className="text-xs uppercase tracking-wide text-[#9ca3af]">Recommended stack</p>
                  <p className="mt-1 text-sm text-[#c9d1d9]">{idea.stack.join(" • ")}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CircleDollarSign className="h-5 w-5 text-[#79c0ff]" />
                  Monetization + Go-to-Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-[#9ca3af]">
                  Suggested pricing model: <span className="font-semibold text-[#e6edf3]">{idea.pricingModel}</span>
                </p>
                <ul className="space-y-2 text-sm text-[#c9d1d9]">
                  {idea.goToMarket.map((item) => (
                    <li key={item} className="list-inside list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[#f85149]/30 bg-[#f85149]/8">
              <CardHeader>
                <CardTitle className="text-lg">Execution Risks to Watch</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-[#f2c9c7]">
                  {idea.risks.map((risk) => (
                    <li key={risk} className="list-inside list-disc">
                      {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
