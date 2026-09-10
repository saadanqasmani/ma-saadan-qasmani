import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { getBlogPost, getBlogPosts } from "@/lib/data";
import { cookies } from "next/headers";
import { JOURNAL_COOKIE, tokenIsValid } from "@/lib/journalGate";
import { JournalGate } from "@/components/journal/JournalGate";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: localeAlternates(`/journal/${post.slug}`, locale),
  };
}

export default async function JournalPostPage({ params }: Params) {
  const { locale: raw, slug } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [post, dict] = await Promise.all([getBlogPost(slug), getDictionary(locale)]);
  if (!post) notFound();

  const t = dict.journal;

  /*
   * A post is subscribers-only too, not just the list.
   *
   * Gating only the index would be theatre: the posts are statically
   * generated and their urls are in the sitemap, so anyone could read one by
   * going straight to it.
   */
  const unlocked = await tokenIsValid((await cookies()).get(JOURNAL_COOKIE)?.value);
  if (!unlocked) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
        <Reveal>
          <LocaleLink
            href="/journal"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            {t.eyebrow}
          </LocaleLink>
        </Reveal>
        <div className="mt-10">
          <JournalGate copy={t.gate} />
        </div>
      </div>
    );
  }

  // Blank lines separate paragraphs, which is how the editor writes them.
  const paragraphs = post.body.split(/\n{2,}/).filter((p) => p.trim());

  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
      <Reveal>
        <LocaleLink
          href="/journal"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          {t.eyebrow}
        </LocaleLink>
      </Reveal>

      <p className="eyebrow mt-10">
        {[post.category, post.readingTime, post.date].filter(Boolean).join(" · ")}
      </p>

      <SplitText
        text={post.title}
        as="h1"
        className="mt-5 font-display text-5xl leading-[0.95] sm:text-7xl"
      />

      {post.subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-5 font-serif text-2xl italic text-ink-faint">{post.subtitle}</p>
        </Reveal>
      )}

      <Reveal delay={0.3}>
        <div className="mt-12 space-y-6 border-t border-line pt-12 font-serif text-xl leading-[1.7] text-ink">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>
    </article>
  );
}
