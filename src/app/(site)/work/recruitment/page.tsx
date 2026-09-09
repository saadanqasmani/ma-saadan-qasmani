import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { FloatCard } from "@/components/ui/FloatCard";
import { GalleryTrigger } from "@/components/media/GalleryTrigger";
import { Pipeline, TierLadder } from "@/components/art/RecruitmentDiagrams";
import { recruitment } from "@/content/recruitment";
import { booking } from "@/content/site";

/**
 * International student recruitment.
 *
 * Kept short on purpose: four sections and a booking. The argument for the
 * framework is quoted from Saadan's own paper, so the page makes a case
 * rather than a pitch.
 */

export const metadata: Metadata = {
  title: recruitment.expansion,
  description: `${recruitment.expansion}. ${recruitment.lede}`,
};

export default function RecruitmentPage() {
  return (
    <div className="rec-theme bg-[var(--rec-ground)]">
      <PageHeader
        eyebrow="The Work · Practice"
        title="International Student"
        accent="Recruitment"
        lede={recruitment.lede}
      />

      {/* ─────────── Why it is run this way ─────────── */}
      <section className="border-b border-[var(--rec-pale)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid items-start gap-14 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <Reveal>
                <p className="eyebrow">01 — What it answers</p>
              </Reveal>
              <Reveal delay={0.08}>
                <figure className="mt-8 border-l-[3px] border-[var(--rec-amber)] pl-7">
                  <blockquote className="font-serif text-xl italic leading-snug text-[var(--rec-ink)] sm:text-2xl">
                    “{recruitment.problem.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--rec-ink-soft)]">
                    {recruitment.problem.source}
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--rec-ink-soft)]">
                  {recruitment.problem.body}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.18}>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--rec-ink-soft)]">
                  The pipeline
                </p>
                <div className="mt-4">
                  <Pipeline />
                </div>
              </div>
            </Reveal>
          </div>

          <dl className="mt-14 grid gap-6 sm:grid-cols-3">
            {recruitment.problem.figures.map((f, i) => (
              <Reveal key={f.note} delay={0.1 + i * 0.07}>
                <FloatCard tone="ember" index={i} innerClassName="px-7 pb-7 pt-6">
                  <dt className="font-display text-5xl leading-none text-[var(--rec-amber)]">
                    {f.value}
                    {"label" in f && f.label && (
                      <span className="ml-2 font-sans text-sm uppercase tracking-[0.14em] text-[var(--rec-ink-soft)]">
                        {f.label}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-[var(--rec-ink-soft)]">
                    {f.note}
                  </dd>
                </FloatCard>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.3}>
            <p className="mt-7 max-w-2xl text-sm text-[var(--rec-ink-soft)]">
              {recruitment.problem.caveat}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── The framework ─────────── */}
      <section className="border-b border-[var(--rec-pale)] bg-[var(--rec-ground-deep)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">02 — {recruitment.framework.heading}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--rec-ink-soft)]">
              {recruitment.framework.body}
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
            <Reveal delay={0.12}>
              <TierLadder />
            </Reveal>

            <div className="grid gap-5">
              {recruitment.tiers.map((t, i) => (
                <Reveal key={t.n} delay={0.16 + i * 0.07}>
                  <FloatCard tone={i === 0 ? "ember" : "mixed"} index={i} innerClassName="p-6">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="bg-[var(--rec-amber)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-white">
                        {t.n}
                      </span>
                      <h3 className="font-serif text-xl text-[var(--rec-ink)]">{t.name}</h3>
                    </div>
                    <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                      {[
                        ["Status", t.status],
                        ["Relationship", t.relationship],
                        ["Incentives", t.incentives],
                        ["Meetings", t.meetings],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--rec-amber)]">
                            {k}
                          </dt>
                          <dd className="mt-1 text-sm leading-snug text-[var(--rec-ink-soft)]">
                            {v}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </FloatCard>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--rec-ink-soft)]">
                A partner moves up on
              </span>
              {recruitment.progression.map((c) => (
                <span
                  key={c}
                  className="bg-white px-4 py-2 text-sm text-[var(--rec-ink)] shadow-[0_8px_20px_-14px_rgba(42,28,17,0.6)]"
                >
                  {c}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Markets and photographs ─────────── */}
      {/* ─────────── Market intelligence ─────────── */}
      <section className="border-b border-[var(--rec-pale)] bg-[var(--rec-ground-deep)] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">Market intelligence</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.7rem,3.6vw,2.8rem)] leading-tight text-[var(--rec-ink)]">
              {recruitment.intelligence.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--rec-ink-soft)]">
              {recruitment.intelligence.body}
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {recruitment.intelligence.groups.map((g, i) => (
              <Reveal key={g.n} delay={0.14 + i * 0.07}>
                <FloatCard
                  tone={i === 1 ? "mixed" : i === 2 ? "ember" : "blue"}
                  index={i}
                  innerClassName="flex h-full flex-col p-7 sm:p-8"
                >
                  <span className="font-mono text-sm text-[var(--rec-amber)]">{g.n}</span>
                  <h3 className="mt-3 font-serif text-xl leading-snug text-[var(--rec-ink)]">
                    {g.name}
                  </h3>
                  <p className="mt-2 text-sm italic leading-snug text-[var(--rec-ink-soft)]">
                    {g.line}
                  </p>
                  <ul className="mt-5 space-y-2.5 border-t border-[var(--rec-pale)] pt-5">
                    {g.signals.map((sig) => (
                      <li
                        key={sig}
                        className="text-sm leading-relaxed text-[var(--rec-ink-soft)]"
                      >
                        · {sig}
                      </li>
                    ))}
                  </ul>
                </FloatCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.34}>
            <p className="mt-12 max-w-3xl border-l-[3px] border-[var(--rec-amber)] pl-6 font-serif text-lg italic leading-relaxed text-[var(--rec-ink)]">
              {recruitment.intelligence.risk}
            </p>
          </Reveal>

          <Reveal delay={0.38}>
            <div className="mt-14 border-t border-[var(--rec-pale)] pt-10">
              <GalleryTrigger mediaKey="international-student-recruitment" label="recruitment work">
                <p className="font-serif text-xl text-[var(--rec-ink)]">From the field</p>
              </GalleryTrigger>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Consultation ─────────── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">03 — Working together</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[var(--rec-ink)]">
              {recruitment.cta.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--rec-ink-soft)]">
              {recruitment.cta.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={booking.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex overflow-hidden border-2 border-[var(--rec-amber)] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--rec-amber)]"
              >
                <span className="absolute inset-0 -translate-y-full bg-[var(--rec-amber)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-white">
                  Schedule a consultation
                </span>
              </a>
              <Link
                href="/contact?subject=Recruitment%20consultation"
                className="inline-flex items-center gap-2 border border-[var(--rec-pale)] px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-[var(--rec-ink-soft)] transition-colors hover:border-[var(--rec-amber)] hover:text-[var(--rec-amber)]"
              >
                Send a message instead
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
