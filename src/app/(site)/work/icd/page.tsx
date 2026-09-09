import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryTrigger } from "@/components/media/GalleryTrigger";
import { icd } from "@/content/icd";

/**
 * The ICD training page.
 *
 * Reached by opening the entry on The Work rather than from the navigation.
 * The programme description is Saadan's; every claim about why it is shaped
 * this way is quoted from his own paper, with the paper's own caveat kept.
 */

export const metadata: Metadata = {
  title: `${icd.expansion}`,
  description: `${icd.name} — ${icd.expansion}. ${icd.lede}`,
};

const TONES: Record<string, { rule: string; text: string; chip: string }> = {
  green: {
    rule: "border-[var(--icd-green)]",
    text: "text-[var(--icd-green)]",
    chip: "bg-[var(--icd-green-pale)] text-[var(--icd-green-deep)]",
  },
  blue: {
    rule: "border-azure",
    text: "text-azure",
    chip: "bg-azure/12 text-azure",
  },
  amber: {
    rule: "border-ember",
    text: "text-ember",
    chip: "bg-ember/12 text-ember",
  },
};

function Quote({ children, source }: { children: string; source?: string }) {
  return (
    <figure className="max-w-3xl border-l-[3px] border-[var(--icd-green)] pl-7">
      <blockquote className="font-serif text-2xl italic leading-snug text-[var(--icd-ink)] sm:text-[1.75rem]">
        “{children}”
      </blockquote>
      {source && (
        <figcaption className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--icd-ink-soft)]">
          {source}
        </figcaption>
      )}
    </figure>
  );
}

export default function IcdPage() {
  return (
    <div className="icd-theme bg-[var(--icd-ground)]">
      <PageHeader
        eyebrow="The Work · Programme"
        title={icd.name}
        sub={icd.expansion}
        lede={icd.lede}
      />

      {/* ─────────── Why it exists ─────────── */}
      <section className="border-b border-[var(--icd-green-pale)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">01 — {icd.premise.heading}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <Quote source={icd.premise.source}>{icd.premise.quote}</Quote>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-[var(--icd-ink-soft)]">
              {icd.premise.body}
            </p>
          </Reveal>

          <dl className="mt-14 grid gap-8 sm:grid-cols-3">
            {icd.premise.figures.map((f, i) => (
              <Reveal key={f.note} delay={0.18 + i * 0.07}>
                <div className="h-full border-t-2 border-[var(--icd-green)] bg-white px-6 pb-7 pt-5">
                  <dt className="font-display text-5xl leading-none text-[var(--icd-green)]">
                    {f.value}
                    {f.label && (
                      <span className="ml-2 font-sans text-sm uppercase tracking-[0.14em] text-[var(--icd-ink-soft)]">
                        {f.label}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-[var(--icd-ink-soft)]">
                    {f.note}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.34}>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-[var(--icd-ink-soft)]">
              {icd.premise.caveat}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Who it is for ─────────── */}
      <section className="border-b border-[var(--icd-green-pale)] bg-[var(--icd-ground-deep)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">02 — Who it is for</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <Quote>{icd.organisational.quote}</Quote>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-[var(--icd-ink-soft)]">
              {icd.organisational.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {icd.audiences.map((a, i) => {
              const t = TONES[a.tone];
              return (
                <Reveal key={a.key} delay={0.18 + i * 0.08}>
                  <div className={`h-full border-t-[3px] bg-white p-8 ${t.rule}`}>
                    <h3 className={`font-display text-3xl ${t.text}`}>{a.key}</h3>
                    <p className="mt-4 text-base leading-relaxed text-[var(--icd-ink-soft)]">
                      {a.body}
                    </p>
                    <p className="mt-7 text-[10px] uppercase tracking-[0.16em] text-[var(--icd-ink-soft)]">
                      Outcomes
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {a.outcomes.map((o) => (
                        <li
                          key={o}
                          className={`px-3 py-1.5 text-sm font-medium ${t.chip}`}
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── How it runs ─────────── */}
      <section className="border-b border-[var(--icd-green-pale)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">03 — How it runs</p>
          </Reveal>
          <ol className="mt-12 border-t-2 border-[var(--icd-green)]">
            {icd.cycle.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.06}>
                <li className="grid gap-3 border-b border-[var(--icd-green-pale)] py-8 sm:grid-cols-[4rem_13rem_1fr] sm:gap-8">
                  <span className="font-mono text-sm font-semibold text-[var(--icd-green)]">
                    {c.n}
                  </span>
                  <span className="font-serif text-xl text-[var(--icd-ink)]">{c.name}</span>
                  <span className="max-w-2xl text-base leading-relaxed text-[var(--icd-ink-soft)]">
                    {c.body}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.28}>
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--icd-ink-soft)]">
                Delivered in
              </span>
              {icd.delivered.map((d) => (
                <span
                  key={d}
                  className="rounded-full bg-[var(--icd-green-deep)] px-4 py-1.5 text-sm font-medium text-white"
                >
                  {d}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.34}>
            <div className="mt-14">
              <Quote>{icd.priority.quote}</Quote>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-[var(--icd-ink-soft)]">
                {icd.priority.body}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-12">
              <GalleryTrigger mediaKey="icd" label="ICD training">
                <p className="font-serif text-xl text-[var(--icd-ink)]">From the sessions</p>
              </GalleryTrigger>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Structures ─────────── */}
      <section className="border-b border-[var(--icd-green-pale)] bg-[var(--icd-green-deep)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow text-white/60">04 — {icd.structures.heading}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <blockquote className="mt-8 max-w-3xl border-l-[3px] border-ember pl-7 font-serif text-2xl italic leading-snug text-white sm:text-[1.75rem]">
              “{icd.structures.quote}”
            </blockquote>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-10 max-w-3xl text-lg leading-relaxed text-white/75">
              {icd.structures.body}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {icd.structures.items.map((s, i) => (
              <Reveal key={s.name} delay={0.18 + i * 0.08}>
                <div className="h-full border border-white/25 p-8">
                  <h3 className="font-display text-3xl text-white">{s.name}</h3>
                  <p className="mt-3 text-base text-white/70">{s.line}</p>
                  <p className="mt-6 border-t border-white/20 pt-6 font-serif text-lg italic leading-snug text-ember">
                    {s.why}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── Get in touch ─────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">05 — Working together</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[var(--icd-ink)]">
              Bring this to your institution.
            </h2>
          </Reveal>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {icd.invitations.map((inv, i) => (
              <Reveal key={inv.title} delay={0.1 + i * 0.05}>
                <li className="h-full border border-[var(--icd-green-pale)] bg-white p-7">
                  <p className="font-serif text-xl text-[var(--icd-green)]">{inv.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--icd-ink-soft)]">
                    {inv.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.3}>
            <p className="mt-14 max-w-3xl font-serif text-2xl leading-snug text-[var(--icd-ink)]">
              {icd.closing}
            </p>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact?subject=ICD%20training%20enquiry"
                className="group relative inline-flex overflow-hidden border-2 border-[var(--icd-green)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--icd-green)]"
              >
                <span className="absolute inset-0 -translate-y-full bg-[var(--icd-green)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-white">
                  Get in touch
                </span>
              </Link>
              <Link
                href="/research"
                className="inline-flex items-center gap-2 border border-[var(--icd-green-pale)] px-6 py-3 text-xs uppercase tracking-[0.16em] text-[var(--icd-ink-soft)] transition-colors hover:border-[var(--icd-green)] hover:text-[var(--icd-green)]"
              >
                The research behind it
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
