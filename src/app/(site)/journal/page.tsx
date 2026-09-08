import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getBlogPosts } from "@/lib/data";
import { Figure } from "@/components/media/Figure";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Essays, reflections, and commentary.",
};

export default async function JournalPage() {
  const blogPosts = await getBlogPosts();

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Essays"
        accent="& Notes"
        accentTone="azure"
        lede="Writing that sits between the research and the fiction."
        aside={
          <Reveal delay={0.3}>
            {/* Decorative: the page's title already says what this is. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/journal-cover.png"
              alt=""
              aria-hidden
              width={1289}
              height={802}
              className="h-auto w-full max-w-xl"
            />
          </Reveal>
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-24">
        {blogPosts.length === 0 && (
          <Reveal>
            <div className="max-w-2xl border-t border-line pt-10">
              <p className="eyebrow">Coming soon</p>
              <h2 className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
                The first essays are still being written.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                This is where the writing between the research and the fiction will live:
                notes from the archive, arguments still forming, and the occasional piece
                that belongs to neither. Subscribe and each one reaches you as it is
                published.
              </p>
              <div className="mt-9 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </Reveal>
        )}

        <div className="border-t border-line">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <Link
                href={`/journal/${post.slug}`}
                className="group grid gap-6 border-b border-line py-10 transition-colors hover:bg-canvas-light sm:grid-cols-[7rem_14rem_1fr] sm:gap-8"
              >
                <p className="text-xs uppercase tracking-[0.12em] text-ink-faint">
                  {post.category}
                  <br />
                  <span className="text-ink-faint/70">
                    {post.readingTime} · {post.date}
                  </span>
                </p>
                <Figure
                  src={post.coverImage}
                  alt={post.title}
                  label="Cover"
                  spec="1600 × 1000 px"
                  ratio="16 / 10"
                  tone="azure"
                />
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
