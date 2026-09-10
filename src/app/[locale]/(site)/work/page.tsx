import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { getWorkItems } from "@/lib/data";
import { WorkList } from "@/components/work/WorkList";
import { getContent } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.work.eyebrow,
    description: dict.work.metaDescription,
    alternates: localeAlternates("/work", locale),
  };
}

export default async function WorkPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [workItems, dict, content] = await Promise.all([
    getWorkItems(),
    getDictionary(locale),
    getContent(locale),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={dict.work.eyebrow}
        title={dict.work.titleLead}
        accent={dict.work.titleAccent}
        lede={dict.work.lede}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <WorkList
          items={content.work(workItems)}
          copy={dict.work}
          gallery={dict.gallery}
          sets={Object.fromEntries(
            workItems.map((item) => [item.slug, content.mediaSet(item.slug)])
          )}
        />
      </section>
    </>
  );
}
