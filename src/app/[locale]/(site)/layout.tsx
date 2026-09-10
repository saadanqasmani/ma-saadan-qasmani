import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CollectionProvider } from "@/components/collect/CollectionProvider";
import { MarginaliaPanel } from "@/components/collect/MarginaliaPanel";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

/** The public site: paper grain, header, footer, and the Marginalia. */
export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <LocaleProvider locale={locale}>
      <div className="grain flex min-h-full flex-1 flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas-light"
        >
          {dict.header.skipToContent}
        </a>
        <CollectionProvider>
          <SiteHeader nav={dict.nav} chrome={dict.header} />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter nav={dict.nav} footer={dict.footer} />
          <MarginaliaPanel />
        </CollectionProvider>
      </div>
    </LocaleProvider>
  );
}
