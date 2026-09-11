import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Counter } from "@/components/ui/Counter";
import { Contours } from "@/components/art/Contours";
import { getBook, getPerson } from "@/lib/data";
import { PurchasePanel } from "@/components/book/PurchasePanel";
import { Figure } from "@/components/media/Figure";
import { Mark } from "@/components/collect/Mark";
import { JsonLd } from "@/components/seo/JsonLd";
import { bookJsonLd, personJsonLd } from "@/lib/seo/jsonLd";
import { getContent } from "@/lib/i18n/content";
import { fill, getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const [baseBook, basePerson, dict, content] = await Promise.all([
    getBook(),
    getPerson(),
    getDictionary(locale),
    getContent(locale),
  ]);
  const book = content.book(baseBook);
  const person = content.person(basePerson);
  const byline = fill(dict.novel.byline, { title: book.title, name: person.name });

  return {
    title: book.title,
    description: book.synopsis,
    alternates: localeAlternates("/the-highest-branch", locale),
    openGraph: {
      title: byline,
      description: book.synopsis,
      type: "book",
      // The cover, not the site-wide card: a link to the novel should
      // preview as the novel.
      ...(book.coverImage ? { images: [{ url: book.coverImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: byline,
      description: book.synopsis,
      ...(book.coverImage ? { images: [book.coverImage] } : {}),
    },
  };
}

export default async function HighestBranchPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [baseBook, basePerson, dict, content] = await Promise.all([
    getBook(),
    getPerson(),
    getDictionary(locale),
    getContent(locale),
  ]);

  const highestBranch = content.book(baseBook);
  const person = content.person(basePerson);
  const t = dict.novel;

  return (
    <>
      {/* The Person node is repeated here so this page stands alone as an
          entity: search engines index pages, not sites, and Book.author
          resolves against it by @id. */}
      <JsonLd data={[bookJsonLd(highestBranch), personJsonLd(person)]} />

      {/* Title sequence */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden border-b border-line">
        <Contours className="pointer-events-none absolute -right-[18%] top-0 h-full w-[110%] opacity-45 lg:-right-[6%] lg:w-[68%] lg:opacity-100" />

        <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow flex items-center gap-1">
              <span className="inline-block h-px w-8 bg-ember" /> {t.aNovel}
              <Mark id="branch" className="-my-2 ms-1" />
            </p>
          </Reveal>

          <h1 className="t-display mt-6 italic">
            <SplitText text={t.titleLead} delay={0.1} />
            <br />
            <SplitText text={t.titleAccent} delay={0.25} className="text-ember" />
          </h1>

          <Reveal delay={0.5}>
            <p className="mt-6 max-w-sm font-serif text-xl italic leading-snug text-ink-soft sm:text-2xl">
              {highestBranch.tagline}
            </p>
          </Reveal>

          <Reveal delay={0.65}>
            <p className="t-label mt-8 text-ink-soft">
              {person.name}
            </p>
          </Reveal>

          <Reveal delay={0.75}>
            <p className="mt-10 max-w-2xl font-serif text-xl leading-relaxed text-ink sm:text-2xl">
              {highestBranch.synopsis}
            </p>
          </Reveal>
        </div>
      </section>

      {/* The facts */}
      <section className="border-b border-line py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.32fr_1fr]">
            <div className="space-y-8">
              <Reveal>
                <p className="eyebrow">{t.theBook}</p>
              </Reveal>
              <Figure
                src={highestBranch.coverImage}
                alt={fill(t.coverAlt, { title: highestBranch.title })}
                label={t.coverLabel}
                spec="Cover artwork · 1600 × 2400 px"
                ratio="529 / 830"
                tone="ember"
              />
            </div>

            <div>
              <SplitText
                text={highestBranch.subject}
                as="p"
                stagger={0.015}
                className="max-w-3xl font-serif text-2xl leading-[1.5] sm:text-3xl"
              />

              <dl className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-3">
                <Reveal>
                  <div>
                    <dt className="eyebrow">{t.chapters}</dt>
                    <dd className="mt-3 font-display text-5xl sm:text-6xl">
                      <Counter to={highestBranch.chapterCount} />
                    </dd>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div>
                    <dt className="eyebrow">{t.words}</dt>
                    <dd className="mt-3 font-display text-5xl sm:text-6xl">
                      <Counter to={highestBranch.wordCount} format />
                    </dd>
                  </div>
                </Reveal>
                <Reveal delay={0.16}>
                  <div>
                    <dt className="eyebrow">{t.form}</dt>
                    <dd className="mt-3 font-serif text-xl leading-snug">{highestBranch.genre}</dd>
                  </div>
                </Reveal>
              </dl>

              <Reveal delay={0.2}>
                <div className="mt-14 border-t border-line pt-8">
                  <p className="eyebrow">{t.status}</p>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                    {highestBranch.status}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Purchase */}
      <section id="purchase" className="scroll-mt-24 bg-canvas-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">{t.availability}</p>
          </Reveal>
          <SplitText
            text={t.orderACopy}
            as="h2"
            className="mt-5 font-display text-4xl leading-none sm:text-6xl"
          />
          <Reveal delay={0.15}>
            <div className="mt-14">
              <PurchasePanel
                copy={t.purchase}
                forms={dict.forms}
                regions={{
                  amazon: content.purchase.amazonRegions,
                  direct: content.purchase.directRegions,
                  directNote: content.purchase.directNote,
                }}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
