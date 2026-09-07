import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { workItems } from "@/content/site";

export const metadata: Metadata = {
  title: "The Work",
  description: "A living archive of projects, roles, and initiatives.",
};

export default function WorkPage() {
  return (
    <Container className="py-28">
      <Reveal>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
          The Work
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">A Living Archive</h1>
        <p className="mt-6 max-w-2xl text-base text-ink-text-muted">
          Academic, professional, and creative work, added continuously.
        </p>
      </Reveal>

      <div className="mt-16 divide-y divide-ink-text/10 border-t border-ink-text/10">
        {workItems.map((item, i) => (
          <Reveal key={item.slug} delay={i * 0.04}>
            <article className="grid gap-2 py-8 sm:grid-cols-[120px_1fr_auto] sm:items-start sm:gap-8">
              <p className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                {item.date}
              </p>
              <div>
                <h2 className="font-serif text-2xl text-ink-text">{item.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-text-muted">
                  {item.summary}
                </p>
              </div>
              <p className="text-xs uppercase tracking-[0.14em] text-gold-bright sm:text-right">
                {item.category}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
