import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/collect/Mark";
import { FloatCard } from "@/components/ui/FloatCard";
import { iris } from "@/content/iris";
import { irisDemo } from "@/content/site";
import { IrisEye } from "@/components/novel/IrisEye";
import { IrisLock } from "@/components/work/IrisLock";
import { IRIS_COOKIE, tokenIsValid } from "@/lib/irisGate";

/**
 * The IRIS project page.
 *
 * Reached by opening IRIS from The Work rather than from the navigation:
 * it is one project's detail, not a section of the site. Everything on it
 * comes from Saadan's own explainer, which is embedded partway down.
 */

export const metadata: Metadata = {
  title: `${iris.name} by ${iris.by}`,
  description: `${iris.expansion}. ${iris.lede}`,
};

function DemoLink({ className = "" }: { className?: string }) {
  const href = irisDemo.url ?? "/contact?subject=IRIS%20demo%20request";
  const external = Boolean(irisDemo.url);
  const inner = (
    <>
      <span className="absolute inset-0 -translate-y-full bg-[var(--iris-blue)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
        Request a demo
      </span>
    </>
  );
  const cls = `group relative inline-flex overflow-hidden border-2 border-[var(--iris-blue)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--iris-blue)] ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/**
 * Stands in for a locked section's content: it keeps the page's shape
 * legible without putting any of the section in the document.
 */
function Withheld({ line }: { line: string }) {
  return (
    <Reveal delay={0.08}>
      <div className="mt-8 max-w-2xl border-l-2 border-ember pl-6">
        <p className="font-serif text-xl italic leading-snug text-[var(--iris-navy)]">{line}</p>
        <a
          href="#film"
          className="mt-4 inline-flex text-xs uppercase tracking-[0.16em] text-[var(--iris-blue)] underline underline-offset-4"
        >
          Enter the access code
        </a>
      </div>
    </Reveal>
  );
}

export default async function IrisPage() {
  // Read on the server: a locked visitor is never sent the film, the module
  // list or the architecture, so there is nothing in the page to reveal.
  const unlocked = await tokenIsValid((await cookies()).get(IRIS_COOKIE)?.value);

  return (
    <div className="iris-theme bg-[var(--iris-ground)]">
      <IrisEye />

      <PageHeader
        eyebrow="The Work · Project"
        title={iris.name}
        sub={`by ${iris.by}`}
        lede={iris.lede}
      />

      <section className="mx-auto max-w-7xl px-6 pt-12 sm:px-10">
        <Reveal>
          <p className="font-serif text-xl italic text-ink-soft">{iris.expansion}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-4">
            <DemoLink />
            {unlocked ? (
              <a
                href={irisDemo.explainer}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
              >
                <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                  Open the film full screen
                </span>
              </a>
            ) : (
              <a
                href="#film"
                className="group relative inline-flex overflow-hidden border border-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.16em]"
              >
                <span className="absolute inset-0 -translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
                  Unlock the film
                </span>
              </a>
            )}
          </div>
        </Reveal>
      </section>

      {/* ─────────── The problem ─────────── */}
      <section className="mt-24 border-y border-[var(--iris-blue-pale)] bg-[var(--iris-ground-deep)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">01 — The problem</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.05] text-[var(--iris-navy)]">
              {iris.problem.heading}
              <br />
              <span className="text-ember">{iris.problem.counter}</span>
            </h2>
          </Reveal>

          <dl className="mt-16 grid gap-10 sm:grid-cols-3">
            {iris.problem.figures.map((f, i) => (
              <Reveal key={f.note} delay={0.1 + i * 0.08}>
                <FloatCard tone="ember" index={i} innerClassName="px-7 pb-7 pt-6">
                  <dt className="font-display text-5xl leading-none text-ember sm:text-6xl">
                    {f.value}
                    {f.unit && (
                      <span className="ml-2 font-sans text-base uppercase tracking-[0.14em] text-[var(--iris-navy-soft)]">
                        {f.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-[var(--iris-navy-soft)]">{f.note}</dd>
                </FloatCard>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2}>
            <ul className="mt-14 flex flex-wrap gap-2">
              {iris.problem.frictions.map((f) => (
                <li
                  key={f}
                  className="bg-white px-3.5 py-2 text-[11px] uppercase tracking-[0.1em] text-[var(--iris-navy-soft)] shadow-[0_6px_16px_-12px_rgba(21,32,60,0.6)]"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-14 max-w-2xl border-l-2 border-ember pl-6 font-serif text-2xl italic leading-snug text-[var(--iris-navy)]">
              {iris.problem.close}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-6 font-display text-3xl text-[var(--iris-blue)] sm:text-4xl">
              {iris.problem.turn}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── The instruments ─────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow flex items-center gap-1">
              02 — The diagnostic backbone
              <Mark id="trilogy" className="-my-2 ml-1" />
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[var(--iris-navy)]">
              {iris.instruments.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-faint">
              {iris.instruments.attribution}
            </p>
          </Reveal>

          <div className="mt-16 grid gap-14 lg:grid-cols-2">
            {[iris.instruments.img, iris.instruments.ipi].map((inst, idx) => (
              <Reveal key={inst.key} delay={0.15 + idx * 0.1}>
                <FloatCard
                  tone={idx === 0 ? "ember" : "blue"}
                  index={idx}
                  innerClassName="p-8 sm:p-9"
                >
                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3
                      className={`font-display text-5xl ${
                        idx === 0 ? "text-ember" : "text-[var(--iris-blue)]"
                      }`}
                    >
                      {inst.key}
                    </h3>
                    <p className="font-serif text-lg italic text-[var(--iris-navy-soft)]">
                      {inst.role}
                    </p>
                  </div>
                  <p className="mt-5 bg-[var(--iris-ground)] px-4 py-3 font-mono text-sm text-[var(--iris-navy)]">
                    {inst.formula}
                  </p>
                  <dl className="mt-8 space-y-7">
                    {inst.parts.map((p) => (
                      <div key={p.key} className="grid gap-2 sm:grid-cols-[3.5rem_1fr] sm:gap-5">
                        <dt
                          className={`font-mono text-sm ${
                            idx === 0 ? "text-ember" : "text-[var(--iris-blue)]"
                          }`}
                        >
                          {p.key}
                        </dt>
                        <dd>
                          <p className="font-serif text-lg leading-snug text-[var(--iris-navy)]">{p.name}</p>
                          <ul className="mt-2 space-y-1">
                            {p.items.map((it) => (
                              <li key={it} className="text-sm leading-relaxed text-[var(--iris-navy-soft)]">
                                · {it}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </FloatCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-14 font-display text-3xl text-[var(--iris-navy)]">{iris.instruments.close}</p>
          </Reveal>

          {/* Four profiles */}
          <div className="mt-20">
            <Reveal>
              <p className="eyebrow">{iris.profiles.heading}</p>
              <p className="mt-2 text-sm text-ink-faint">{iris.profiles.note}</p>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {iris.profiles.items.map((p, i) => {
                // Deploy and advance are the go-signals; the other two are
                // holds. Colour carries that rather than the words alone.
                const go = i === 0 || i === 1;
                return (
                  <Reveal key={p.condition} delay={i * 0.06}>
                    <FloatCard tone={go ? "blue" : "ember"} index={i} innerClassName="p-8">
                      <p className="text-xs uppercase tracking-[0.12em] text-[var(--iris-navy-soft)]">
                        {p.condition}
                      </p>
                      <p
                        className={`mt-3 font-display text-3xl ${
                          go ? "text-[var(--iris-blue)]" : "text-ember"
                        }`}
                      >
                        {p.action}
                      </p>
                    </FloatCard>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal delay={0.2}>
            <p className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.16em] text-[var(--iris-blue)]">
              {iris.chain.map((step, i) => (
                <span key={step} className="flex items-center gap-4">
                  {i > 0 && <span className="text-ember">→</span>}
                  {step}
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── The film ─────────── */}
      <section
        id="film"
        className="scroll-mt-24 border-y border-[var(--iris-blue-pale)] bg-[var(--iris-navy)] py-20 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">03 — The film</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight text-canvas-light">
              Three and a half minutes, <span className="text-ember">end to end</span>.
            </h2>
          </Reveal>

          {unlocked ? (
            <>
              <Reveal delay={0.14}>
                {/* Sandboxed: it is a self-contained page, and nothing on it needs
                    access to this one. */}
                <FloatCard tone="mixed" className="mt-10" innerClassName="overflow-hidden bg-canvas">
                  <iframe
                    src={irisDemo.explainer}
                    title="IRIS — the explainer film"
                    loading="lazy"
                    sandbox="allow-scripts"
                    className="aspect-video h-full w-full"
                  />
                </FloatCard>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 text-sm text-canvas-light/60">
                  Sound is off until you turn it on, inside the film.
                </p>
              </Reveal>
            </>
          ) : (
            <Reveal delay={0.14}>
              <div className="mt-10">
                <IrisLock />
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ─────────── The modules ─────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">04 — What it does</p>
          </Reveal>
          {!unlocked && (
            <Withheld line="The eight modules IRIS runs are held with the film." />
          )}
          {unlocked && (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {iris.modules.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.04}>
                <li>
                  <FloatCard
                    tone={i % 3 === 2 ? "ember" : "blue"}
                    index={i}
                    innerClassName="flex h-full flex-col p-7"
                  >
                    <span className="font-mono text-sm font-semibold text-[var(--iris-blue)]">
                      {m.n}
                    </span>
                    <span className="mt-3 font-serif text-xl text-[var(--iris-navy)]">
                      {m.name}
                    </span>
                    <span className="mt-2 text-sm leading-relaxed text-[var(--iris-navy-soft)]">
                      {m.line}
                    </span>
                  </FloatCard>
                </li>
              </Reveal>
            ))}
          </ul>
          )}
        </div>
      </section>

      {/* ─────────── The engine ─────────── */}
      <section className="border-t border-[var(--iris-blue-pale)] bg-[var(--iris-ground-deep)] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">05 — The architecture</p>
          </Reveal>
          {!unlocked && (
            <Withheld line="How IRIS is built, end to end, is held with the film." />
          )}
          {unlocked && (
          <>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[var(--iris-navy)]">
              {iris.engine.heading}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {[
              { label: "Sources", items: iris.engine.inputs, tone: "blue" as const, fg: "text-[var(--iris-blue)]" },
              { label: "Engine", items: iris.engine.core, tone: "mixed" as const, fg: "text-[var(--iris-blue)]" },
              { label: "Outputs", items: iris.engine.outputs, tone: "ember" as const, fg: "text-ember" },
            ].map((col, i) => (
              <Reveal key={col.label} delay={0.1 + i * 0.08}>
                <FloatCard tone={col.tone} index={i} innerClassName="p-8">
                  <p className={`text-xs uppercase tracking-[0.16em] ${col.fg}`}>{col.label}</p>
                  <ul className="mt-5 space-y-2">
                    {col.items.map((it) => (
                      <li
                        key={it}
                        className="font-serif text-lg leading-snug text-[var(--iris-navy)]"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </FloatCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <p className="mt-14 max-w-3xl font-serif text-xl leading-relaxed text-[var(--iris-navy)]">
              {iris.engine.close}
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--iris-navy-soft)]">
              {iris.engine.library}
            </p>
          </Reveal>
          </>
          )}
        </div>
      </section>

      {/* ─────────── Close ─────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="max-w-4xl font-display text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.1] text-[var(--iris-navy)]">
              {iris.closing}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-[var(--iris-blue)]">
              {iris.credit}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-4">
              <DemoLink />
              <Link
                href="/work"
                className="inline-flex items-center gap-2 border border-line px-6 py-3 text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Back to the work
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
