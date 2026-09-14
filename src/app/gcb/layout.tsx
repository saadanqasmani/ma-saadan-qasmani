import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./gcb.css";

/*
 * GCB's own root layout.
 *
 * Everything under /gcb is a separate product that happens to be parked on
 * this domain until it has one of its own. It shares no layout, no header,
 * no footer, no palette and no typeface with the site around it, and it
 * names nobody. Moving it out later is a matter of copying four folders —
 * app/gcb, components/gcb, content/gcb, lib/gcb — into a new project.
 */

const display = Sora({
  variable: "--gcb-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--gcb-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GCB",
  // Not indexed, not followed, not archived, and no preview text or image
  // offered to anything that asks. The middleware already answers 404 to an
  // uncoded request; this is what a crawler is told if one ever gets past.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function GcbLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="gcb">{children}</body>
    </html>
  );
}
