import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { blogPosts } from "@/content/site";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Essays, reflections, and commentary.",
};

export default function JournalPage() {
  return (
    <Container className="py-28">
      <Reveal>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
          The Journal
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">Essays &amp; Notes</h1>
      </Reveal>

      <div className="mt-16 divide-y divide-ink-text/10 border-t border-ink-text/10">
        {blogPosts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <Link href={`/journal/${post.slug}`} className="group block py-10">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                {post.category} · {post.readingTime} · {post.date}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink-text transition-colors group-hover:text-gold-bright">
                {post.title}
              </h2>
              {post.subtitle && (
                <p className="mt-2 font-serif italic text-ink-text-muted">{post.subtitle}</p>
              )}
              <p className="mt-3 max-w-2xl text-sm text-ink-text-muted">{post.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
