import Link from "next/link";
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
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";

const AREA_TONE: Record<string, string> = {
  "Political economy of internationalization": "text-azure",
  "Partnership management": "text-verdant",
  "International student experience": "text-ember",
  "Internationalization theory": "text-azure",
  "Securitization of international students": "text-ember",
  "Intercultural competence development": "text-verdant",
  "Displaced scholars, STEM access": "text-verdant",
};

export default async function Home() {
  const [person, highestBranch, researchItems] = await Promise.all([
    getPerson(),
    getBook(),
    getResearchItems(),
  ]);

  return (
    <>
      <JsonLd data={[personJsonLd(person), websiteJsonLd(person)]} />

      {/* ─────────── Act I — Arrival ─────────── */}
      <section className="relative min-h-[94vh] overflow-hidden">
        {/* Branch: a full-bleed backdrop on small screens, a right-hand column above lg */}
        <BranchDiagram className="absolute bottom-0 right-0 top-0 h-full w-full opacity-[0.22] lg:left-auto lg:w-[52%] lg:opacity-100" />

        {/* pointer-events-none so the branch stays hoverable underneath */}
        <div className="pointer-events-none relative mx-auto flex min-h-[94vh] max-w-7xl items-center px-6 sm:px-10">
          <div className="pointer-events-auto relative z-10 w-full py-28 lg:max-w-[52%]">
            <p className="eyebrow flex items-center gap-1">
              <span className="inline-block h-px w-8 bg-ember" /> Istanbul
              <Mark id="istanbul" className="-my-2 ml-1" />
            </p>

            <h1 className="mt-6 font-display text-[clamp(3.25rem,8.5vw,8rem)] font-normal leading-[0.86] tracking-[-0.03em]">
              <SplitText text="Saadan" delay={0.1} />
              <br />
              <SplitText text="Qasmani" delay={0.22} className="italic text-ember" />
            </h1>

            <SplitText
              text={person.positioning}
              as="p"
              delay={0.55}
              className="mt-8 font-sans text-sm uppercase tracking-[0.2em] text-ink-soft"
            />

            {/* Hover is a pointer affordance — hidden where there is no cursor */}
            <Reveal delay={1}>
              <p className="mt-10 hidden items-center gap-3 text-sm text-ink-faint lg:flex">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
                Hover the marked junctions to trace the work
              </p>
            </Reveal>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 z-10 sm:left-10">
          <Reveal delay={1.3}>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-ink-faint" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                Scroll
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
              <p className="eyebrow lg:sticky lg:top-32">The Author</p>
            </Reveal>
            <div>
              <SplitText
                text={person.bio}
                as="p"
                stagger={0.012}
                className="max-w-4xl font-serif text-2xl leading-[1.5] text-ink sm:text-[2rem] sm:leading-[1.45]"
              />
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <MagneticLink href="/about">Read the biography</MagneticLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Act III — Seasons / Semesters ─────────── */}
      <SeasonsSemesters />

      {/* ─────────── Act IV — The reach ─────────── */}
      <section className="border-t border-line bg-canvas-light py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <Reveal>
                <p className="eyebrow">The Practice</p>
              </Reveal>
              <SplitText
                text="Training delivered where the questions are hardest."
                as="h2"
                className="mt-5 max-w-xl font-display text-4xl leading-[1.05] sm:text-6xl"
              />
              <Reveal delay={0.15}>
                <p className="mt-7 max-w-lg text-base leading-relaxed text-ink-soft">
                  {person.practitionerNote}
                </p>
              </Reveal>

              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
                {[
                  { n: 12, suffix: "", label: "Countries" },
                  { n: 70, suffix: "+", label: "Nationalities" },
                  { n: 9, suffix: "", label: "Research papers in progress" },
                ].map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.08}>
                    <div>
                      <dt className="font-display text-5xl text-ink sm:text-6xl">
                        <Counter to={stat.n} suffix={stat.suffix} />
                      </dt>
                      <dd className="mt-2 flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-ink-faint">
                        {stat.label}
                        {stat.label === "Nationalities" && (
                          <Mark id="nationalities" className="-my-2" />
                        )}
                      </dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>

            <Reveal delay={0.2}>
              <GlobeArcs />
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
                <p className="eyebrow">The Archive</p>
              </Reveal>
              <SplitText
                text="Research in progress"
                as="h2"
                className="mt-5 font-display text-4xl leading-none sm:text-6xl"
              />
            </div>
            <Reveal delay={0.1}>
              <Link
                href="/research"
                className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-ink-soft transition-colors hover:text-ink"
              >
                All research
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>

          <ul className="mt-14 border-t border-line">
            {researchItems.slice(0, 5).map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.05}>
                <li>
                  <Link
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
                      className={`text-xs uppercase tracking-[0.12em] ${AREA_TONE[item.area] ?? "text-ink-faint"}`}
                    >
                      {item.area}
                    </span>
                  </Link>
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
                <span className="inline-block h-px w-8 translate-y-[-4px] bg-ember" /> The Novel
              </p>
            </Reveal>
            <SplitText
              text={highestBranch.title}
              as="h2"
              className="mt-6 font-display text-5xl italic leading-[0.95] text-ink sm:text-8xl"
            />
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl font-serif text-xl leading-relaxed text-ink-soft sm:text-2xl">
                {highestBranch.synopsis}
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <MagneticLink href="/the-highest-branch">Enter the novel</MagneticLink>
                <span className="text-xs uppercase tracking-[0.14em] text-ink-faint">
                  {highestBranch.chapterCount} chapters ·{" "}
                  <Counter to={highestBranch.wordCount} format /> words
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
