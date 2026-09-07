import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { person } from "@/content/site";

export const metadata: Metadata = {
  title: "The Author",
  description: `Biography of ${person.name} — ${person.positioning}.`,
};

export default function AboutPage() {
  return (
    <Container className="py-28">
      <Reveal>
        <p className="text-xs font-sans uppercase tracking-[0.2em] text-ink-text-muted">
          The Author
        </p>
        <h1 className="mt-4 font-serif text-4xl text-ink-text sm:text-6xl">The Person</h1>
      </Reveal>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
                Based In
              </p>
              <p className="mt-2 font-serif text-lg text-ink-text">{person.location}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
                Current Roles
              </p>
              <ul className="mt-3 space-y-3">
                {person.roles.map((role) => (
                  <li key={role.title}>
                    <p className="font-serif text-lg text-ink-text">{role.title}</p>
                    <p className="text-sm text-ink-text-muted">{role.org}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">Founded</p>
              <ul className="mt-3 space-y-3">
                {person.founded.map((f) => (
                  <li key={f.name}>
                    <p className="font-serif text-lg text-ink-text">{f.name}</p>
                    <p className="text-sm text-ink-text-muted">{f.org}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
                Recognition
              </p>
              <ul className="mt-3 space-y-3">
                {person.honors.map((h) => (
                  <li key={h.title}>
                    <p className="font-serif text-lg text-ink-text">{h.title}</p>
                    <p className="text-sm text-ink-text-muted">{h.year}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-8">
            <p className="font-serif text-2xl leading-relaxed text-ink-text text-balance">
              {person.bio}
            </p>
            <div className="rule" />
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-ink-text-muted">
                The Work
              </p>
              <p className="mt-3 text-base leading-relaxed text-ink-text-muted">
                {person.practitionerNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
