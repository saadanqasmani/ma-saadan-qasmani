import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { blogPosts } from "@/content/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-28 pt-24 sm:px-10 sm:pt-32">
      <Reveal>
        <Link
          href="/journal"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          The Journal
        </Link>
      </Reveal>

      <p className="eyebrow mt-10">
        {post.category} · {post.readingTime} · {post.date}
      </p>

      <SplitText
        text={post.title}
        as="h1"
        className="mt-5 font-display text-5xl leading-[0.95] sm:text-7xl"
      />

      {post.subtitle && (
        <Reveal delay={0.2}>
          <p className="mt-5 font-serif text-2xl italic text-ink-faint">{post.subtitle}</p>
        </Reveal>
      )}

      <Reveal delay={0.3}>
        <div className="mt-12 space-y-6 border-t border-line pt-12 font-serif text-xl leading-[1.7] text-ink">
          <p>{post.body}</p>
        </div>
      </Reveal>
    </article>
  );
}
