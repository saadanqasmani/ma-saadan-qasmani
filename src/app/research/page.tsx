import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResearchArchive } from "@/components/research/ResearchArchive";
import { researchItems } from "@/content/site";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Working papers and academic research on the political economy of internationalization, nation branding, and the securitization of international students.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Archive"
        title="Research"
        lede="Working papers on the political economy of internationalization, nation branding, and the securitization of international students. Restricted papers are sent only after a request is reviewed personally."
      />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20">
        <ResearchArchive items={researchItems} />
      </div>
    </>
  );
}
