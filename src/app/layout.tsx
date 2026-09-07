import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { person } from "@/content/site";
import { CollectionProvider } from "@/components/collect/CollectionProvider";
import { MarginaliaPanel } from "@/components/collect/MarginaliaPanel";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://saadanqasmani.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${person.name} — ${person.positioning}`,
    template: `%s — ${person.name}`,
  },
  description: person.bio.slice(0, 155),
  openGraph: {
    title: `${person.name} — ${person.positioning}`,
    description: person.bio.slice(0, 155),
    url: siteUrl,
    siteName: person.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${person.name} — ${person.positioning}`,
    description: person.bio.slice(0, 155),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${newsreader.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="grain flex min-h-full flex-col bg-canvas text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas-light"
        >
          Skip to content
        </a>
        <CollectionProvider>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MarginaliaPanel />
        </CollectionProvider>
      </body>
    </html>
  );
}
