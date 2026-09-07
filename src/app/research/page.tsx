import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { researchItems } from "@/content/site";
import { ResearchRow } from "@/components/research/ResearchRow";

export const metadata: Metadata = {
  title: "Research",
  description: "Research papers, working papers, and academic publications.",
};

export default function ResearchPage() {
  return (
    <Container className="py-28">
      <Reveal>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
          The Archive
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">Research</h1>
        <p className="mt-6 max-w-2xl text-base text-ink-text-muted">
          Working papers and academic research on the political economy of
          internationalization, nation branding, and the securitization of international
          students. Restricted papers are sent only after a request is reviewed.
        </p>
      </Reveal>

      <div className="mt-16 divide-y divide-ink-text/10 border-t border-ink-text/10">
        {researchItems.map((item) => (
          <ResearchRow key={item.slug} item={item} />
        ))}
      </div>
    </Container>
  );
}
