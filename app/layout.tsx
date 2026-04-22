import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://validated-solo-saas-ideas.com"),
  title: {
    default: "Validated Solo SaaS Ideas",
    template: "%s | Validated Solo SaaS Ideas"
  },
  description:
    "Curated SaaS ideas for indie hackers with market research, competition analysis, and implementation difficulty scores.",
  keywords: [
    "SaaS ideas",
    "indie hackers",
    "solo founder",
    "market validation",
    "micro saas",
    "startup ideas"
  ],
  openGraph: {
    title: "Validated Solo SaaS Ideas",
    description:
      "Pick a SaaS problem you can realistically ship solo in 3-6 months using validated demand signals.",
    type: "website",
    url: "https://validated-solo-saas-ideas.com",
    siteName: "Validated Solo SaaS Ideas"
  },
  twitter: {
    card: "summary_large_image",
    title: "Validated Solo SaaS Ideas",
    description: "A curated SaaS idea database for technical founders who need validated, buildable opportunities."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>): React.JSX.Element {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} font-[var(--font-body)] antialiased`}>{children}</body>
    </html>
  );
}
