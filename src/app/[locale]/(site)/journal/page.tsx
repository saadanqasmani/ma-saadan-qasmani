import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPosts } from "@/lib/data";
import { Figure } from "@/components/media/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { JournalGate } from "@/components/journal/JournalGate";
import { cookies } from "next/headers";
import { JOURNAL_COOKIE, tokenIsValid } from "@/lib/journalGate";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.journal.eyebrow,
    description: dict.journal.metaDescription,
    alternates: localeAlternates("/journal", locale),
  };
}

export default async function JournalPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [blogPosts, dict] = await Promise.all([getBlogPosts(), getDictionary(locale)]);
  const t = dict.journal;
  // Read on the server, so a locked reader is never sent the writing.
  const unlocked = await tokenIsValid((await cookies()).get(JOURNAL_COOKIE)?.value);

  return (
    <>
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.titleLead}
        accent={t.titleAccent}
        accentTone="azure"
        lede={t.lede}
        aside={
          <Reveal delay={0.3}>
            {/* Decorative: the page's title already says what this is. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/journal-cover.png"
              alt=""
              aria-hidden
              width={1289}
              height={802}
              className="h-auto w-full max-w-xl"
            />
          </Reveal>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        {!unlocked && (
          <Reveal>
            <JournalGate copy={t.gate} />
          </Reveal>
        )}

        {unlocked && blogPosts.length === 0 && (
          <Reveal>
            <div className="max-w-2xl border-t border-line pt-10">
              <p className="eyebrow">{t.comingSoon}</p>
              <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
                {t.comingSoonHeading}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{t.comingSoonBody}</p>
              <div className="mt-9 max-w-md">
                <NewsletterForm copy={dict.newsletter} />
              </div>
            </div>
          </Reveal>
        )}

        <div className="border-t border-line">
          {unlocked &&
            blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <LocaleLink
                href={`/journal/${post.slug}`}
                className="group grid gap-6 border-b border-line py-10 transition-colors hover:bg-canvas-light sm:grid-cols-[7rem_14rem_1fr] sm:gap-8"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                  {post.category}
                  <br />
                  <span className="text-ink-faint/70">
                    {post.readingTime} · {post.date}
                  </span>
                </p>
                <Figure
                  src={post.coverImage}
                  alt={post.title}
                  label={t.coverLabel}
                  spec="1600 × 1000 px"
                  ratio="16 / 10"
                  tone="azure"
                />
                <div>
                  <h2 className="font-display text-3xl leading-tight text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-4xl">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="mt-2 font-serif text-lg italic text-ink-faint">
                      {post.subtitle}
                    </p>
                  )}
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>
                </div>
              </LocaleLink>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
