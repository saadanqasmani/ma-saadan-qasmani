import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { publications, highestBranch } from "@/content/site";

export const metadata: Metadata = {
  title: "Publications",
  description: "Books, articles, and published work.",
};

export default function PublicationsPage() {
  return (
    <>
      <PageHeader eyebrow="Publications" title="Published Work" />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <Reveal>
          <Link
            href="/the-highest-branch"
            className="group relative flex flex-col justify-between gap-8 overflow-hidden border border-ink bg-canvas-light p-8 transition-colors sm:flex-row sm:items-end sm:p-12"
          >
            <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
            <div className="relative">
              <p className="eyebrow transition-colors group-hover:text-canvas-light/70">
                Flagship — Forthcoming
              </p>
              <p className="mt-4 font-display text-4xl italic leading-none transition-colors group-hover:text-canvas-light sm:text-6xl">
                {highestBranch.title}
              </p>
              <p className="mt-4 text-sm text-ink-soft transition-colors group-hover:text-canvas-light/80">
                {highestBranch.genre} · {highestBranch.chapterCount} chapters
              </p>
            </div>
            <span className="relative whitespace-nowrap text-xs uppercase tracking-[0.16em] transition-colors group-hover:text-canvas-light">
              Read more →
            </span>
          </Link>
        </Reveal>

        <div className="mt-16 border-t border-line">
          {publications.length === 0 ? (
            <p className="py-20 text-center font-serif text-lg italic text-ink-faint">
              Further publications will appear here as they are released.
            </p>
          ) : (
            publications.map((pub, i) => (
              <Reveal key={pub.slug} delay={i * 0.05}>
                <article className="grid gap-3 border-b border-line py-8 sm:grid-cols-[8rem_1fr] sm:gap-8">
                  <p className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                    {pub.kind} · {pub.date}
                  </p>
                  <div>
                    <h2 className="font-serif text-2xl text-ink">{pub.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm text-ink-soft">{pub.summary}</p>
                  </div>
                </article>
              </Reveal>
            ))
          )}
        </div>
      </section>
    </>
  );
}
