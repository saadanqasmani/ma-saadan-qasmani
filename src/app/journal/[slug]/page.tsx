import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
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
    <Container className="py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
            {post.category} · {post.readingTime} · {post.date}
          </p>
          <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-5xl">{post.title}</h1>
          {post.subtitle && (
            <p className="mt-3 font-serif text-xl italic text-ink-text-muted">{post.subtitle}</p>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rule my-10" />
          <div className="max-w-none space-y-6 font-serif text-lg leading-relaxed text-ink-text">
            <p>{post.body}</p>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
