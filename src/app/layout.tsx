import type { Metadata } from "next";
import { Newsreader, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { person } from "@/content/site";
import { siteUrl } from "@/lib/siteUrl";

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
      <body className="flex min-h-full flex-col bg-canvas text-ink">{children}</body>
    </html>
  );
}
