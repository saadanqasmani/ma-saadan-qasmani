import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { JsonLd } from "@/components/seo/JsonLd";
import { RequestAccessForm } from "@/components/forms/RequestAccessForm";
import { getPerson, getResearchItem, getResearchItems } from "@/lib/data";
import { researchJsonLd } from "@/lib/seo/jsonLd";
import { collaborators, instruments } from "@/content/site";

/**
 * One paper, on its own page.
 *
 * The archive keeps its abstracts in a panel, which reads well and is
 * invisible to a crawler: a row mounts its contents only once a person
 * clicks it. This page is where the abstract is actually published as
 * text, so each paper is indexable on its own terms rather than as one
 * line in a list.
 */

export async function generateStaticParams() {
  const items = await getResearchItems();
  return items.map((item) => ({ slug: item.slug }));
}

/** First two sentences, or a clean cut, for the search result snippet. */
function snippet(abstract: string, limit = 180) {
  if (abstract.length <= limit) return abstract;
  const cut = abstract.slice(0, limit);
  const stop = cut.lastIndexOf(". ");
  if (stop > 80) return cut.slice(0, stop + 1);
  // No sentence break in range: end on a whole word rather than mid-syllable.
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getResearchItem(slug);
  if (!item) return {};

  const title = item.subtitle ? `${item.title}: ${item.subtitle}` : item.title;
  return {
    title: item.title,
    description: snippet(item.abstract),
    keywords: item.keywords,
    alternates: { canonical: `/research/${item.slug}` },
    openGraph: { title, description: snippet(item.abstract), type: "article" },
  };
}

export default async function ResearchPaperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, person] = await Promise.all([getResearchItem(slug), getPerson()]);
  if (!item) notFound();

  const instrument = item.instrument ? instruments[item.instrument] : null;
  const byline = item.authors?.length
    ? item.authors
    : [person.name, ...(item.coAuthors ?? [])];

  return (
    <>
      <JsonLd data={researchJsonLd([item], person)} />

      <article className="mx-auto max-w-3xl px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
        <Reveal>
          <Link
            href="/research"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            The Archive
          </Link>
        </Reveal>

        <p className="eyebrow mt-10">{[item.type, item.date].filter(Boolean).join(" · ")}</p>

        <SplitText
          text={item.title}
          as="h1"
          className="mt-5 font-display text-4xl leading-[1.02] sm:text-6xl"
        />

        {item.subtitle && (
          <Reveal delay={0.2}>
            <p className="mt-5 font-serif text-xl italic leading-snug text-ink-soft sm:text-2xl">
              {item.subtitle}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.26}>
          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            {byline.map((name, i) => {
              const profile = collaborators[name]?.linkedin ?? collaborators[name]?.profile;
              return (
                <span key={name}>
                  {i > 0 && (i === byline.length - 1 ? " and " : ", ")}
                  {profile ? (
                    <a
                      href={profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-ember decoration-1 underline-offset-4 transition-colors hover:text-ember"
                    >
                      {name}
                    </a>
                  ) : (
                    name
                  )}
                </span>
              );
            })}
            {item.institution ? ` · ${item.institution}` : ""}
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <hr className="mt-10 border-0 border-t border-line" />
        </Reveal>

        <Reveal delay={0.34}>
          <h2 className="mt-10 text-xs uppercase tracking-[0.16em] text-ember">Abstract</h2>
          <p className="mt-5 text-base leading-[1.8] text-ink-soft sm:text-lg">{item.abstract}</p>
        </Reveal>

        {item.keywords.length > 0 && (
          <Reveal delay={0.38}>
            <h2 className="mt-12 text-xs uppercase tracking-[0.16em] text-ink-faint">Keywords</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {item.keywords.map((k) => (
                <li
                  key={k}
                  className="border border-line px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-ink-soft"
                >
                  {k}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {instrument?.definition && (
          <Reveal delay={0.4}>
            <div className="mt-12 border-l-2 border-azure pl-6">
              <h2 className="text-xs uppercase tracking-[0.16em] text-azure">
                {instrument.label}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{instrument.definition}</p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.42}>
          <section className="mt-16 border border-line bg-white p-8 sm:p-10">
            <p className="eyebrow">{item.access === "open" ? "Open access" : "Restricted"}</p>
            <h2 className="mt-3 font-display text-3xl">
              {item.access === "open" && item.doiOrLink ? "Read the paper" : "Request access"}
            </h2>
            {item.access === "open" && item.doiOrLink ? (
              <a
                href={item.doiOrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-6 inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
              >
                <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                  View paper
                </span>
              </a>
            ) : (
              <div className="mt-7">
                <RequestAccessForm researchSlug={item.slug} researchTitle={item.title} />
              </div>
            )}
          </section>
        </Reveal>

        <Reveal delay={0.46}>
          <Link
            href="/research"
            className="mt-14 inline-flex items-center gap-2 border border-line px-6 py-3 text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
          >
            All nine papers
          </Link>
        </Reveal>
      </article>
    </>
  );
}
