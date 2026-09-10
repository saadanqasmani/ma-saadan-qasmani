import type { Metadata } from "next";
import "../globals.css";
import { fontClassNames } from "@/lib/i18n/fonts";

export const metadata: Metadata = {
  title: "Admin",
  // The dashboard must never be indexed, whatever robots.txt says.
  robots: { index: false, follow: false, nocache: true },
};

/**
 * The dashboard's own root.
 *
 * The public site has one root per language; this is the second root, and it
 * has no language to choose. The desk is English, it is behind a login, and
 * it is never indexed, so nothing here needs translating.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${fontClassNames("en")} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <div className="flex min-h-full flex-1 flex-col bg-canvas-light">{children}</div>
      </body>
    </html>
  );
}
