import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { getPerson } from "@/lib/data";
import { Figure } from "@/components/media/Figure";
import { SocialRow } from "@/components/layout/SocialRow";
import { GalleryTrigger } from "@/components/media/GalleryTrigger";
import { Mark } from "@/components/collect/Mark";
import { orgLinks } from "@/content/site";
import { LocaleLink } from "@/components/i18n/LocaleLink";
import { getContent } from "@/lib/i18n/content";
import { fill, getDictionary } from "@/lib/i18n/dictionary";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { localeAlternates } from "@/lib/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const [person, dict, content] = await Promise.all([
    getPerson(),
    getDictionary(locale),
    getContent(locale),
  ]);

  const said = content.person(person);

  return {
    title: dict.about.eyebrow,
    description: fill(dict.about.metaDescription, {
      name: said.name,
      positioning: said.positioning.toLowerCase(),
    }),
    alternates: localeAlternates("/about", locale),
  };
}

export default async function AboutPage({ params }: Params) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const [person, dict, content] = await Promise.all([
    getPerson(),
    getDictionary(locale),
    getContent(locale),
  ]);
  const t = dict.about;
  const said = content.person(person);

  return (
    <>
      <PageHeader eyebrow={t.eyebrow} title={t.titleLead} accent={t.titleAccent} />

      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid gap-16 lg:grid-cols-[0.32fr_1fr]">
          <div className="space-y-8">
            <Reveal>
              <p className="eyebrow">{t.biography}</p>
            </Reveal>
            <Figure
              src={person.portrait}
              bare
              alt="Saadan Qasmani"
              label={t.portraitLabel}
              spec="Portrait orientation · 1200 × 1600 px or larger · /public/portrait.png"
              ratio="3 / 4"
              tone="ember"
            />
            <SocialRow className="mt-5" />
          </div>
          <div>
            <SplitText
              text={said.bio}
              as="p"
              stagger={0.012}
              className="max-w-2xl text-lg leading-relaxed text-ink-soft"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas-light py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.32fr_1fr]">
            <Reveal>
              <p className="eyebrow lg:sticky lg:top-32">{t.theWork}</p>
            </Reveal>

            <div className="space-y-16">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl">{t.currentRoles}</h2>
                <ul className="mt-8 border-t border-line">
                  {said.roles.map((role, i) => (
                    <Reveal key={role.title} delay={i * 0.06}>
                      <li className="grid gap-1 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8">
                        <span className="font-serif text-xl text-ink">{role.title}</span>
                        {orgLinks[role.org] ? (
                          // An internal path opens in place; an external site
                          // opens in its own tab.
                          orgLinks[role.org]!.startsWith("/") ? (
                            <LocaleLink
                              href={orgLinks[role.org]!}
                              className="text-sm text-ink-soft underline decoration-azure decoration-1 underline-offset-4 transition-colors hover:text-azure"
                            >
                              {role.org}
                            </LocaleLink>
                          ) : (
                            <a
                              href={orgLinks[role.org]!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-ink-soft underline decoration-ember decoration-1 underline-offset-4 transition-colors hover:text-ember"
                            >
                              {role.org}
                            </a>
                          )
                        ) : (
                          <span className="text-sm text-ink-soft">{role.org}</span>
                        )}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <Reveal>
                <div>
                  <h2 className="flex items-center gap-2 font-display text-3xl sm:text-4xl">
                    {t.practice}
                    <Mark id="unesco" />
                  </h2>
                  <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                    {said.practitionerNote}
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-12 sm:grid-cols-2">
                <Reveal>
                  <div>
                    <h2 className="flex items-center gap-2 font-display text-2xl">
                      {t.founded}
                      <Mark id="founded" />
                    </h2>
                    <ul className="mt-5 space-y-4">
                      {said.founded.map((f) => (
                        <li key={f.name}>
                          <p className="font-serif text-lg text-ink">{f.name}</p>
                          <p className="text-sm text-ink-faint">{f.org}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={0.08}>
                  <div>
                    <h2 className="font-display text-2xl">{t.recognition}</h2>
                    <ul className="mt-5 space-y-4">
                      {said.honors.map((h) => (
                        <li key={h.title}>
                          <GalleryTrigger
                            set={h.media ? content.mediaSet(h.media) : null}
                            label={h.title}
                            copy={dict.gallery}
                          >
                            <p className="font-serif text-lg text-ink">{h.title}</p>
                            {h.org && <p className="mt-0.5 text-sm text-ink-soft">{h.org}</p>}
                            <p className="text-sm text-ink-faint">{h.year}</p>
                          </GalleryTrigger>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>

              <Reveal>
                <div className="flex flex-wrap gap-4 pt-4">
                  <MagneticLink href="/research">{t.theResearch}</MagneticLink>
                  <MagneticLink href="/contact">{t.getInTouch}</MagneticLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
