import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CollectionProvider } from "@/components/collect/CollectionProvider";
import { MarginaliaPanel } from "@/components/collect/MarginaliaPanel";

/** The public site: paper grain, header, footer, and the Marginalia. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grain flex min-h-full flex-1 flex-col">
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
    </div>
  );
}
