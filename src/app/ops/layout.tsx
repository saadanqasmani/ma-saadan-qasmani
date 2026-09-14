import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./ops.css";

/*
 * The workroom's own root layout.
 *
 * Two people share this, nobody else sees it, and it looks nothing like the
 * site it sits on. Its own fonts, its own palette, its own ground.
 */

const display = Sora({
  variable: "--ops-font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--ops-font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Consider It Done",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="ops">{children}</body>
    </html>
  );
}
