import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { Counter } from "@/components/ui/Counter";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { BranchDiagram } from "@/components/art/BranchDiagram";
import { SeasonsSemesters } from "@/components/art/SeasonsSemesters";
import { GlobeArcs } from "@/components/art/GlobeArcs";
import { Contours } from "@/components/art/Contours";
import { getPerson, getBook, getResearchItems } from "@/lib/data";
import { Mark } from "@/components/collect/Mark";
import { Figure } from "@/components/media/Figure";
import { SocialRow } from "@/components/layout/SocialRow";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getContent } from "@/lib/i18n/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

const AREA_TONE: Record<string, string> = {
  "Political economy of internationalization": "text-azure",
  "Partnership management": "text-verdant",
  "International student experience": "text-ember",
  "Internationalization theory": "text-azure",
  "Securitization of international students": "text-ember",
  "Intercultural competence development": "text-verdant",
  "Displaced scholars, STEM access": "text-verdant",
};

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const [person, highestBranch, researchItems, dict, content] = await Promise.all([
    getPerson(),
    getBook(),
    getResearchItems(),
    getDictionary(locale),
    getContent(locale),
  ]);

  const t = dict.home;
  const said = content.person(person);
  const book = content.book(highestBranch);
  // The area tone is keyed by the English name, so it is looked up on the
  // record as written rather than on its translation.
  const papers = content.research(researchItems).map((item, i) => ({
    ...item,
    tone: AREA_TONE[researchItems[i].area] ?? "text-ink-faint",
  }));

  return (
    <>
      <JsonLd data={[personJsonLd(said), websiteJsonLd(said, locale)]} />

      {/* ─────────── Act I — Arrival ─────────── */}
      <section className="relative min-h-[94vh] overflow-hidden">
        {/* Branch: a full-bleed backdrop on small screens, a right-hand column above lg */}
        <BranchDiagram
          label={dict.art.branch}
          className="absolute bottom-0 end-0 top-0 h-full w-full opacity-[0.22] lg:start-auto lg:w-[52%] lg:opacity-100"
        />

        {/* pointer-events-none so the branch stays hoverable underneath */}
        <div className="pointer-events-none relative mx-auto flex min-h-[94vh] max-w-7xl items-center px-6 sm:px-10">
          <div className="pointer-events-auto relative z-10 w-full py-28 lg:max-w-[52%]">
            <p className="eyebrow flex items-center gap-1">
              <span className="inline-block h-px w-8 bg-ember" /> {t.location}
              <Mark id="istanbul" className="-my-2 ml-1" />
            </p>

            <h1 className="t-display mt-6">
              <SplitText text="Saadan" delay={0.1} />
              <br />
              <SplitText text="Qasmani" delay={0.22} className="italic text-ember" />
            </h1>

            <SplitText
              text={said.positioning}
              as="p"
              delay={0.55}
              className="t-label mt-8 text-ink-soft"
            />

            {/* Hover is a pointer affordance — hidden where there is no cursor */}
            <Reveal delay={1}>
              <p className="mt-10 hidden items-center gap-3 text-sm text-ink-faint lg:flex">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                {t.hoverHint}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-8 start-6 z-10 sm:start-10">
          <Reveal delay={1.3}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-ink-faint" />
              <span className="t-label text-ink-faint">
                {t.scroll}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Act II — The statement ─────────── */}
      <section className="border-t border-line py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.32fr_1fr]">
            <Reveal>
              <p className="eyebrow lg:sticky lg:top-32">{t.author}</p>
            </Reveal>
            <div className="grid gap-10 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-12">
              <div className="space-y-5">
                <Figure
                  src={person.portrait}
                  bare
                  ratio="3/4"
                  label={t.portraitLabel}
                  spec="Portrait orientation · /public/portrait.png"
                  className="w-full max-w-[15rem]"
                />
                <SocialRow />
              </div>

              <div>
                <SplitText
                  text={said.bio}
                  as="p"
                  stagger={0.012}
                  className="max-w-2xl text-lg leading-relaxed text-ink-soft"
                />
                <Reveal delay={0.2}>
                  <div className="mt-10">
                    <MagneticLink href="/about">{t.readBiography}</MagneticLink>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Act III — Seasons / Semesters ─────────── */}
      <SeasonsSemesters copy={dict.seasons} />

      {/* ─────────── Act IV — The reach ─────────── */}
      <section className="border-t border-line bg-canvas-light py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <Reveal>
                <p className="eyebrow">{t.practice}</p>
              </Reveal>
              <SplitText
                text={t.practiceHeading}
                as="h2"
                className="mt-5 max-w-xl font-display text-4xl leading-[1.05] sm:text-6xl"
              />
              <Reveal delay={0.15}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft">
                  {said.practitionerNote}
                </p>
              </Reveal>

              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                {[
                  { n: 12, suffix: "", label: t.countries, tone: "text-azure", mark: false },
                  { n: 70, suffix: "+", label: t.nationalities, tone: "text-ember", mark: true },
                  { n: 9, suffix: "", label: t.papersInProgress, tone: "text-verdant", mark: false },
                ].map((stat, i) => (
                  <Reveal key={stat.tone} delay={i * 0.08}>
                    <div>
                      <dt className={`font-display text-5xl sm:text-6xl ${stat.tone}`}>
                        <Counter to={stat.n} suffix={stat.suffix} />
                      </dt>
                      <dd className="t-label mt-2 flex items-center gap-1 text-ink-faint">
                        {stat.label}
                        {stat.mark && <Mark id="nationalities" className="-my-2" />}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>

            <Reveal delay={0.2}>
              <GlobeArcs label={dict.art.globe} home={dict.art.istanbul} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─────────── Act V — The archive ─────────── */}
      <section className="border-t border-line py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="eyebrow">{t.archive}</p>
              </Reveal>
              <SplitText
                text={t.researchInProgress}
                as="h2"
                className="mt-5 font-display text-4xl leading-none sm:text-6xl"
              />
            </div>
            <Reveal delay={0.1}>
              <LocaleLink
                href="/research"
                className="t-label group inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                {t.allResearch}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </LocaleLink>
            </Reveal>
          </div>

          <ul className="mt-14 border-t border-line">
            {papers.slice(0, 5).map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.05}>
                <li>
                  <LocaleLink
                    href={`/research#${item.slug}`}
                    className="group grid items-baseline gap-2 border-b border-line py-7 transition-colors hover:bg-canvas-deep/40 sm:grid-cols-[auto_1fr_auto] sm:gap-8"
                  >
                    <span className="font-sans text-xs tabular-nums text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-2 sm:text-2xl">
                      {item.title}
                    </span>
                    <span
                      className={`t-label ${item.tone}`}
                    >
                      {item.area}
                    </span>
                  </LocaleLink>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── Act VI — The novel ─────────── */}
      <section className="relative overflow-hidden border-t border-line bg-canvas-deep py-28 sm:py-36">
        <Contours className="pointer-events-none absolute -right-[15%] top-0 h-full w-[110%] opacity-40 lg:right-0 lg:w-[62%] lg:opacity-90" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow">
                <span className="inline-block h-px w-8 translate-y-[-4px] bg-ember" /> {t.novelEyebrow}
              </p>
            </Reveal>
            <SplitText
              text={highestBranch.title}
              as="h2"
              className="mt-6 font-display text-5xl italic leading-[0.95] text-ink sm:text-8xl"
            />
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-ink-soft sm:text-2xl">
                {book.synopsis}
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <MagneticLink href="/the-highest-branch">{t.enterTheNovel}</MagneticLink>
                <span className="t-label text-ink-faint">
                  {highestBranch.chapterCount} {t.chapters} ·{" "}
                  <Counter to={highestBranch.wordCount} format /> {t.words}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
