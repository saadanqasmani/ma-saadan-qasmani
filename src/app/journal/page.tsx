import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { blogPosts } from "@/content/site";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Essays, reflections, and commentary.",
};

export default function JournalPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Essays & Notes"
        lede="Writing that sits between the research and the fiction."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        <div className="border-t border-line">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link
                href={`/journal/${post.slug}`}
                className="group grid gap-4 border-b border-line py-10 transition-colors hover:bg-canvas-light sm:grid-cols-[10rem_1fr] sm:gap-10"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                  {post.category}
                  <br />
                  <span className="text-ink-faint/70">
                    {post.readingTime} · {post.date}
                  </span>
                </p>
                <div>
                  <h2 className="font-display text-3xl leading-tight text-ink transition-transform duration-500 ease-out group-hover:translate-x-1.5 sm:text-4xl">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="mt-2 font-serif text-lg italic text-ink-faint">
                      {post.subtitle}
                    </p>
                  )}
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
