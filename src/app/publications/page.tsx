import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { publications, highestBranch } from "@/content/site";

export const metadata: Metadata = {
  title: "Publications",
  description: "Books, articles, and published work.",
};

export default function PublicationsPage() {
  return (
    <Container className="py-28">
      <Reveal>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
          Publications
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">Published Work</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <Link
          href="/the-highest-branch"
          className="mt-16 flex flex-col justify-between gap-6 border border-gold/30 p-8 transition-colors hover:border-gold/60 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gold-bright">
              Flagship — Forthcoming
            </p>
            <p className="mt-2 font-serif text-2xl italic text-ink-text">
              {highestBranch.title}
            </p>
            <p className="mt-1 text-sm text-ink-text-muted">{highestBranch.genre}</p>
          </div>
          <span className="whitespace-nowrap text-xs uppercase tracking-[0.16em] text-gold-bright">
            Read More →
          </span>
        </Link>
      </Reveal>

      <div className="mt-16 divide-y divide-ink-text/10 border-t border-ink-text/10">
        {publications.length === 0 ? (
          <p className="py-16 text-center text-sm text-ink-text-muted">
            Further publications will appear here as they are released.
          </p>
        ) : (
          publications.map((pub) => (
            <article key={pub.slug} className="py-8">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                {pub.kind} · {pub.date}
              </p>
              <h2 className="mt-2 font-serif text-2xl text-ink-text">{pub.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-text-muted">{pub.summary}</p>
            </article>
          ))
        )}
      </div>
    </Container>
  );
}
