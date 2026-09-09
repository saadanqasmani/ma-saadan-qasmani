import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResearchArchive } from "@/components/research/ResearchArchive";
import { getResearchItems } from "@/lib/data";
import { Mark } from "@/components/collect/Mark";
import { ResearchConstellation } from "@/components/art/ResearchConstellation";
import { Reveal } from "@/components/ui/Reveal";
import { collaborators, researchNote } from "@/content/site";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Working papers and academic research on the political economy of internationalization, nation branding, and the securitization of international students.",
};

export default async function ResearchPage() {
  const researchItems = await getResearchItems();
  // LinkedIn when Saadan sends it; his ResearchGate profile until then.
  const collaborator = collaborators[researchNote.name];
  const noteProfile = collaborator?.linkedin ?? collaborator?.profile ?? null;

  return (
    <>
      <PageHeader
        eyebrow="The Archive"
        title="Research"
        accent="Archive"
        accentTone="azure"
        lede="Working papers on the political economy of internationalization, nation branding, and the securitization of international students. Restricted papers are sent only after a request is reviewed personally."
      />
      <section className="border-b border-line bg-canvas-light py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-[0.36fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">The Shape of It</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                Nine papers, one question.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
                How institutions say one thing about international students and do another —
                traced through policy instruments, partnerships, merit, and security.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ResearchConstellation items={researchItems} />
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <p className="mb-4 max-w-2xl border-l-2 border-ember pl-5 font-serif text-lg italic leading-relaxed text-ink-soft">
          {researchNote.before}
          {noteProfile ? (
            <a
              href={noteProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-ember decoration-1 underline-offset-4 transition-colors hover:text-ember"
            >
              {researchNote.name}
            </a>
          ) : (
            researchNote.name
          )}
          {researchNote.after}
        </p>
        <p className="mb-8 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint">
          Three of these belong to one set
          <Mark id="trilogy" className="-my-2" />
        </p>
        <ResearchArchive items={researchItems} />
      </div>
    </>
  );
}
