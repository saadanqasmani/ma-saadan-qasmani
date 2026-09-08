import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { getWorkItems } from "@/lib/data";
import { WorkList } from "@/components/work/WorkList";

export const metadata: Metadata = {
  title: "The Work",
  description: "A living archive of projects, roles, and initiatives.",
};

export default async function WorkPage() {
  const workItems = await getWorkItems();

  return (
    <>
      <PageHeader
        eyebrow="The Work"
        title="A Living Archive"
        lede="Academic, professional, and creative work — added continuously rather than curated once."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <WorkList items={workItems} />
      </section>
    </>
  );
}
