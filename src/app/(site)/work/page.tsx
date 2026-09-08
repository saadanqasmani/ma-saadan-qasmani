import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getWorkItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Work",
  description: "A living archive of projects, roles, and initiatives.",
};

const CATEGORY_TONE: Record<string, string> = {
  Projects: "text-azure",
  "Global Engagement": "text-verdant",
  "International Education": "text-ember",
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
        <ul className="border-t border-line">
          {workItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.05}>
              <li className="group grid gap-3 border-b border-line py-9 transition-colors hover:bg-canvas-light sm:grid-cols-[7rem_1fr_auto] sm:gap-8">
                <span className="font-sans text-sm tabular-nums text-ink-faint">{item.date}</span>
                <div>
                  <h2 className="font-serif text-2xl leading-snug text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-3xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {item.summary}
                  </p>
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.12em] sm:text-right ${
                    CATEGORY_TONE[item.category] ?? "text-ink-faint"
                  }`}
                >
                  {item.category}
                </span>
              </li>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
