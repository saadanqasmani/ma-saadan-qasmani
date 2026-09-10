import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResearchArchive } from "@/components/research/ResearchArchive";
import { getPerson, getResearchItems } from "@/lib/data";
import { JsonLd } from "@/components/seo/JsonLd";
import { researchJsonLd } from "@/lib/seo/jsonLd";
import { Mark } from "@/components/collect/Mark";
import { ResearchConstellation } from "@/components/art/ResearchConstellation";
import { Reveal } from "@/components/ui/Reveal";
import { collaborators } from "@/content/site";
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
    title: dict.research.titleLead,
    description: dict.research.metaDescription,
    alternates: localeAlternates("/research", locale),
  };
}

export default async function ResearchPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [researchItems, person, dict, content] = await Promise.all([
    getResearchItems(),
    getPerson(),
    getDictionary(locale),
    getContent(locale),
  ]);

  const t = dict.research;
  const papers = content.research(researchItems);
  const note = content.researchNote;
  // LinkedIn when Saadan sends it; his ResearchGate profile until then.
  const collaborator = collaborators[note.name];
  const noteProfile = collaborator?.linkedin ?? collaborator?.profile ?? null;

  return (
    <>
      <JsonLd data={researchJsonLd(researchItems, person)} />
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.titleLead}
        accent={t.titleAccent}
        accentTone="azure"
        lede={t.lede}
      />
      <section className="border-b border-line bg-canvas-light py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[0.36fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">{t.shapeEyebrow}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                {t.shapeHeading}
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
                {t.shapeBody}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ResearchConstellation items={papers} copy={dict.art} />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <p className="mb-4 max-w-2xl border-s-2 border-ember ps-5 font-serif text-lg italic leading-relaxed text-ink-soft">
          {note.before}
          {noteProfile ? (
            <a
              href={noteProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ember decoration-1 underline-offset-4 transition-colors hover:text-ember"
            >
              {note.name}
            </a>
          ) : (
            note.name
          )}
          {note.after}
        </p>
        <p className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint">
          {t.trilogyNote}
          <Mark id="trilogy" className="-my-2" />
        </p>
        <ResearchArchive
          items={papers}
          copy={t}
          forms={dict.forms}
          notice={dict.translation}
          instrument={content.instrument}
        />
      </div>
    </>
  );
}
