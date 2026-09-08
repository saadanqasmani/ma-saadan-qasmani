import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Mark } from "@/components/collect/Mark";
import { iris } from "@/content/iris";
import { irisDemo } from "@/content/site";
import { IrisEye } from "@/components/novel/IrisEye";

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
      <span className="absolute inset-0 -translate-y-full bg-azure transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-300 group-hover:text-canvas-light">
        Request a demo
      </span>
    </>
  );
  const cls = `group relative inline-flex overflow-hidden border border-azure px-6 py-3 text-xs font-medium uppercase tracking-[0.16em] text-azure ${className}`;
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

export default function IrisPage() {
  return (
    <>
      <IrisEye />

      <PageHeader
        eyebrow="The Work · Project"
        title={iris.name}
        accent={`by ${iris.by}`}
        accentTone="azure"
        lede={iris.lede}
      />

      <section className="mx-auto max-w-7xl px-6 pt-12 sm:px-10">
        <Reveal>
          <p className="font-serif text-xl italic text-ink-soft">{iris.expansion}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-4">
            <DemoLink />
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
          </div>
        </Reveal>
      </section>

      {/* ─────────── The problem ─────────── */}
      <section className="mt-24 border-y border-line bg-canvas-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">01 — The problem</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-4xl font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.05]">
              {iris.problem.heading}
              <br />
              <span className="text-ember">{iris.problem.counter}</span>
            </h2>
          </Reveal>

          <dl className="mt-16 grid gap-10 sm:grid-cols-3">
            {iris.problem.figures.map((f, i) => (
              <Reveal key={f.note} delay={0.1 + i * 0.08}>
                <div className="border-t border-line pt-5">
                  <dt className="font-display text-5xl leading-none sm:text-6xl">
                    {f.value}
                    {f.unit && (
                      <span className="ml-2 font-sans text-base uppercase tracking-[0.14em] text-ink-faint">
                        {f.unit}
                      </span>
                    )}
                  </dt>
                  <dd className="mt-3 text-sm leading-relaxed text-ink-soft">{f.note}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={0.2}>
            <ul className="mt-14 flex flex-wrap gap-2">
              {iris.problem.frictions.map((f) => (
                <li
                  key={f}
                  className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] text-ink-faint"
                >
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-14 max-w-2xl border-l-2 border-ember pl-6 font-serif text-2xl italic leading-snug">
              {iris.problem.close}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-6 font-display text-3xl text-azure sm:text-4xl">
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
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
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
                <div className="border-t-2 border-ink pt-7">
                  <div className="flex flex-wrap items-baseline gap-4">
                    <h3 className="font-display text-4xl">{inst.key}</h3>
                    <p className="font-serif text-lg italic text-ink-soft">{inst.role}</p>
                  </div>
                  <p className="mt-5 border border-line bg-canvas-light px-4 py-3 font-mono text-sm text-ink">
                    {inst.formula}
                  </p>
                  <dl className="mt-8 space-y-7">
                    {inst.parts.map((p) => (
                      <div key={p.key} className="grid gap-2 sm:grid-cols-[3.5rem_1fr] sm:gap-5">
                        <dt className="font-mono text-sm text-ember">{p.key}</dt>
                        <dd>
                          <p className="font-serif text-lg leading-snug">{p.name}</p>
                          <ul className="mt-2 space-y-1">
                            {p.items.map((it) => (
                              <li key={it} className="text-sm leading-relaxed text-ink-soft">
                                · {it}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <p className="mt-14 font-display text-3xl">{iris.instruments.close}</p>
          </Reveal>

          {/* Four profiles */}
          <div className="mt-20">
            <Reveal>
              <p className="eyebrow">{iris.profiles.heading}</p>
              <p className="mt-2 text-sm text-ink-faint">{iris.profiles.note}</p>
            </Reveal>
            <div className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2">
              {iris.profiles.items.map((p, i) => (
                <Reveal key={p.condition} delay={i * 0.06}>
                  <div className="h-full bg-canvas p-7">
                    <p className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                      {p.condition}
                    </p>
                    <p className="mt-3 font-serif text-2xl text-ink">{p.action}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <p className="mt-16 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.16em] text-ink-faint">
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
      <section className="border-y border-line bg-canvas-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">03 — The film</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
              Three and a half minutes, end to end.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            {/* Sandboxed: it is a self-contained page, and nothing on it needs
                access to this one. */}
            <div className="mt-10 overflow-hidden border border-ink bg-canvas">
              <iframe
                src={irisDemo.explainer}
                title="IRIS — the explainer film"
                loading="lazy"
                sandbox="allow-scripts"
                className="aspect-video h-full w-full"
              />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 text-sm text-ink-faint">
              Sound is off until you turn it on, inside the film.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── The modules ─────────── */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">04 — What it does</p>
          </Reveal>
          <ul className="mt-12 border-t border-line">
            {iris.modules.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.04}>
                <li className="grid gap-2 border-b border-line py-7 sm:grid-cols-[4rem_14rem_1fr] sm:gap-8">
                  <span className="font-mono text-sm text-ink-faint">{m.n}</span>
                  <span className="font-serif text-xl text-ink">{m.name}</span>
                  <span className="text-base leading-relaxed text-ink-soft">{m.line}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ─────────── The engine ─────────── */}
      <section className="border-t border-line bg-canvas-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="eyebrow">05 — The architecture</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl font-display text-[clamp(1.8rem,4vw,3rem)] leading-tight">
              {iris.engine.heading}
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-3">
            {[
              { label: "Sources", items: iris.engine.inputs, tone: "text-azure" },
              { label: "Engine", items: iris.engine.core, tone: "text-ember" },
              { label: "Outputs", items: iris.engine.outputs, tone: "text-verdant" },
            ].map((col, i) => (
              <Reveal key={col.label} delay={0.1 + i * 0.08}>
                <div className="border-t border-line pt-6">
                  <p className={`text-xs uppercase tracking-[0.16em] ${col.tone}`}>{col.label}</p>
                  <ul className="mt-4 space-y-2">
                    {col.items.map((it) => (
                      <li key={it} className="font-serif text-lg leading-snug text-ink">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28}>
            <p className="mt-14 max-w-3xl font-serif text-xl leading-relaxed text-ink">
              {iris.engine.close}
            </p>
          </Reveal>
          <Reveal delay={0.32}>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-soft">
              {iris.engine.library}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────── Close ─────────── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <Reveal>
            <p className="max-w-4xl font-display text-[clamp(1.8rem,4.2vw,3.4rem)] leading-[1.1]">
              {iris.closing}
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 text-xs uppercase tracking-[0.16em] text-ink-faint">
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
    </>
  );
}
