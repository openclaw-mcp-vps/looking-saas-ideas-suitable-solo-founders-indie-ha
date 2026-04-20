import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import "@/app/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans"
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indie-idea-vault.example"),
  title: {
    default: "Indie Idea Vault | Validated SaaS Ideas for Solo Founders",
    template: "%s | Indie Idea Vault"
  },
  description:
    "Curated SaaS ideas with market research, competition analysis, and execution difficulty scoring so solo founders can pick ideas they can actually ship.",
  keywords: [
    "indie hackers",
    "solo founder ideas",
    "validated saas ideas",
    "startup idea database",
    "market validation"
  ],
  openGraph: {
    type: "website",
    title: "Indie Idea Vault",
    description: "Find SaaS ideas you can build alone in 3-6 months with real validation data.",
    url: "https://indie-idea-vault.example",
    siteName: "Indie Idea Vault",
    images: [
      {
        url: "https://indie-idea-vault.example/og-image.png",
        width: 1200,
        height: 630,
        alt: "Indie Idea Vault dashboard preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Indie Idea Vault",
    description: "Validated SaaS ideas with feasibility scoring for solo founders."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} bg-[#0d1117] text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
