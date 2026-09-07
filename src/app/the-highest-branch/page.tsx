import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { highestBranch, person } from "@/content/site";
import { PurchasePanel } from "@/components/book/PurchasePanel";

export const metadata: Metadata = {
  title: highestBranch.title,
  description: highestBranch.synopsis,
  openGraph: {
    title: highestBranch.title,
    description: highestBranch.synopsis,
    type: "book",
  },
};

export default function HighestBranchPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-b from-ink to-burgundy/10 py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-xs font-sans uppercase tracking-[0.3em] text-gold-bright">
                A Novel
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h1 className="mt-6 font-serif text-5xl italic leading-tight text-ink-text sm:text-7xl text-balance">
                {highestBranch.title}
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-ink-text-muted">
                {person.name}
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="mt-10 font-serif text-xl leading-relaxed text-ink-text text-balance">
                {highestBranch.synopsis}
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
                  Concept
                </p>
                <p className="mt-4 font-serif text-lg leading-relaxed text-ink-text">
                  {highestBranch.subject}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-2 gap-8">
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                    Genre
                  </dt>
                  <dd className="mt-2 font-serif text-lg text-ink-text">
                    {highestBranch.genre}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                    Length
                  </dt>
                  <dd className="mt-2 font-serif text-lg text-ink-text">
                    {highestBranch.chapterCount} chapters ·{" "}
                    {highestBranch.wordCount.toLocaleString()} words
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-text-muted">
                    Status
                  </dt>
                  <dd className="mt-2 text-sm text-ink-text-muted">{highestBranch.status}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="purchase" className="scroll-mt-20 border-t border-ink-text/10 bg-ink-deep py-24">
        <Container>
          <Reveal>
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
              Availability
            </p>
            <h2 className="mt-4 font-serif text-3xl text-ink-text sm:text-4xl">
              Buy {highestBranch.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <PurchasePanel />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
