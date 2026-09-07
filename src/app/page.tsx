import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { person, highestBranch, researchItems } from "@/content/site";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(173,133,54,0.10),_transparent_60%)]"
        />
        <Reveal>
          <p className="mb-6 text-xs font-sans uppercase tracking-[0.35em] text-ink-text-muted">
            Istanbul
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <h1 className="font-serif text-[clamp(2.75rem,9vw,7rem)] font-medium leading-[0.95] tracking-tight text-ink-text text-balance">
            {person.name}
          </h1>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-6 font-sans text-sm uppercase tracking-[0.3em] text-gold-bright sm:text-base">
            {person.positioning}
          </p>
        </Reveal>
        <Reveal delay={0.55}>
          <div className="mt-16 flex flex-col items-center gap-2 text-ink-text-muted">
            <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
            <span className="h-10 w-px bg-gradient-to-b from-ink-text-muted to-transparent" />
          </div>
        </Reveal>
      </section>

      {/* The person / the work */}
      <section className="border-t border-ink-text/10 py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.4fr_1fr]">
            <Reveal>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
                The Author
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-serif text-2xl leading-relaxed text-ink-text sm:text-3xl text-balance">
                {person.bio}
              </p>
              <Link
                href="/about"
                className="mt-8 inline-block border-b border-gold/50 pb-1 text-sm uppercase tracking-[0.16em] text-gold-bright transition-colors hover:border-gold-bright"
              >
                Read the full biography
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Research strip */}
      <section className="border-t border-ink-text/10 bg-ink-deep py-28">
        <Container>
          <Reveal>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
              Selected Research
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden border border-ink-text/10 sm:grid-cols-2 lg:grid-cols-4">
            {researchItems.slice(0, 4).map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.05}>
                <Link
                  href={`/research#${item.slug}`}
                  className="group flex h-full flex-col justify-between bg-ink p-6 transition-colors hover:bg-ink-raised"
                >
                  <p className="font-serif text-lg leading-snug text-ink-text text-balance">
                    {item.title}
                  </p>
                  <p className="mt-6 text-xs uppercase tracking-[0.14em] text-ink-text-muted group-hover:text-gold-bright">
                    {item.area}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Link
              href="/research"
              className="mt-8 inline-block border-b border-ink-text/30 pb-1 text-sm uppercase tracking-[0.16em] text-ink-text-muted transition-colors hover:border-ink-text hover:text-ink-text"
            >
              View the archive
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* The Highest Branch — temperature change */}
      <section className="relative overflow-hidden border-t border-gold/20 bg-gradient-to-b from-ink via-ink to-burgundy/10 py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-xs font-sans uppercase tracking-[0.3em] text-gold-bright">
                The Novel
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 className="mt-6 font-serif text-4xl italic leading-tight text-ink-text sm:text-6xl text-balance">
                {highestBranch.title}
              </h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-8 font-serif text-lg leading-relaxed text-ink-text-muted text-balance">
                {highestBranch.synopsis}
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <Link
                href="/the-highest-branch"
                className="mt-10 inline-block border border-gold/60 px-8 py-3 text-xs font-sans uppercase tracking-[0.2em] text-gold-bright transition-colors hover:border-gold-bright hover:bg-gold/10"
              >
                Enter the Novel
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
