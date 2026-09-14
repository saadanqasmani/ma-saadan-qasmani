import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { PointsProvider } from "@/components/taraki/Points";
import "./taraki.css";

/*
 * Taraki's own root layout.
 *
 * Everything under /taraki is a separate company that happens to be parked on
 * this domain until it has one of its own. It shares no layout, no header,
 * no footer, no palette and no typeface with the site around it, and it
 * names nobody. Moving it out later is a matter of copying four folders —
 * app/taraki, components/taraki, content/taraki, lib/taraki — into a new project.
 */

const display = Sora({
  variable: "--tk-font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--tk-font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Taraki Company",
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

export default function TarakiLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="tk" data-theme="light">
        {/*
          Set before the first paint, not after.
          The toggle runs in an effect, which is a frame too late: a reader
          who chose dark would watch the page flash white on every load.
          This is the one thing that genuinely has to be inline.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('tk-theme');document.body.dataset.theme=t==='dark'?'dark':'light'}catch(e){}",
          }}
        />
        <PointsProvider>{children}</PointsProvider>
      </body>
    </html>
  );
}
